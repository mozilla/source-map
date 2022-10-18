#![deny(missing_debug_implementations)]

extern crate rand;
extern crate vlq;

pub mod comparators;

use comparators::ComparatorFunction;
use std::cmp;
use std::marker::PhantomData;
use std::mem;
use std::slice;
use std::u32;

/// Errors that can occur during parsing.
#[derive(Copy, Clone, Debug)]
#[repr(u32)]
pub enum Error {
    // NB: 0 is reserved for OK.
    /// The mappings contained a negative line, column, source index, or name
    /// index.
    UnexpectedNegativeNumber = 1,

    /// The mappings contained a number larger than `u32::MAX`.
    UnexpectedlyBigNumber = 2,

    /// Reached EOF while in the middle of parsing a VLQ.
    VlqUnexpectedEof = 3,

    /// Encountered an invalid base 64 character while parsing a VLQ.
    VlqInvalidBase64 = 4,

    /// VLQ encountered a number that, when decoded, would not fit in
    /// an i64.
    VlqOverflow = 5,
}

impl From<vlq::Error> for Error {
    #[inline]
    fn from(e: vlq::Error) -> Error {
        match e {
            vlq::Error::UnexpectedEof => Error::VlqUnexpectedEof,
            vlq::Error::InvalidBase64(_) => Error::VlqInvalidBase64,
            vlq::Error::Overflow => Error::VlqOverflow,
        }
    }
}

/// When doing fuzzy searching, whether to slide the next larger or next smaller
/// mapping from the queried location.
#[derive(Copy, Clone, Debug, PartialEq, Eq)]
#[repr(u32)]
pub enum Bias {
    // XXX: make sure these values always match `mozilla/source-map`'s
    // `SourceMapConsumer.{GreatestLower,LeastUpper}Bound` values!
    /// Slide to the next smaller mapping.
    GreatestLowerBound = 1,

    /// Slide to the next larger mapping.
    LeastUpperBound = 2,
}

impl Default for Bias {
    #[inline]
    fn default() -> Bias {
        Bias::GreatestLowerBound
    }
}

/// A trait for defining a set of RAII types that can observe the start and end
/// of various operations and queries we perform in their constructors and
/// destructors.
///
/// This is also implemented for `()` as the "null observer" that doesn't
/// actually do anything.
pub trait Observer: Default {
    /// Observe the parsing of the `"mappings"` string.
    type ParseMappings: Default;

    /// Observe sorting parsed mappings by original location.
    type SortByOriginalLocation: Default;

    /// Observe sorting parsed mappings by generated location.
    type SortByGeneratedLocation: Default;

    /// Observe computing column spans.
    type ComputeColumnSpans: Default;

    /// Observe querying what the original location for some generated location
    /// is.
    type OriginalLocationFor: Default;

    /// Observe querying what the generated location for some original location
    /// is.
    type GeneratedLocationFor: Default;

    /// Observe querying what all generated locations for some original location
    /// is.
    type AllGeneratedLocationsFor: Default;
}

impl Observer for () {
    type ParseMappings = ();
    type SortByOriginalLocation = ();
    type SortByGeneratedLocation = ();
    type ComputeColumnSpans = ();
    type OriginalLocationFor = ();
    type GeneratedLocationFor = ();
    type AllGeneratedLocationsFor = ();
}

#[derive(Debug)]
enum LazilySorted<T, F, O> {
    Sorted(Vec<T>, PhantomData<F>, PhantomData<O>),
    Unsorted(Vec<T>),
}

impl<T, F, O> LazilySorted<T, F, O>
where
    F: comparators::ComparatorFunction<T>,
    O: Default,
{
    #[inline]
    fn sort(&mut self) -> &[T] {
        let me = mem::replace(self, LazilySorted::Unsorted(vec![]));
        let items = match me {
            LazilySorted::Sorted(items, ..) => items,
            LazilySorted::Unsorted(mut items) => {
                let _observer = O::default();
                items.sort_unstable_by(F::compare);
                items
            }
        };
        mem::replace(self, LazilySorted::Sorted(items, PhantomData, PhantomData));
        unwrap(self.sorted())
    }

    #[inline]
    fn unsorted(&mut self) -> Option<&mut Vec<T>> {
        match *self {
            LazilySorted::Unsorted(ref mut items) => Some(items),
            LazilySorted::Sorted(..) => None,
        }
    }

    #[inline]
    fn sorted(&self) -> Option<&[T]> {
        match *self {
            LazilySorted::Sorted(ref items, ..) => Some(items),
            LazilySorted::Unsorted(_) => None,
        }
    }

    #[inline]
    fn is_empty(&self) -> bool {
        match *self {
            LazilySorted::Sorted(ref items, ..) |
            LazilySorted::Unsorted(ref items) => items.is_empty()
        }
    }
}

/// A parsed set of mappings that can be queried.
///
/// Constructed via `parse_mappings`.
#[derive(Debug)]
pub struct Mappings<O = ()>
where
    O: Observer
{
    by_generated: Vec<Mapping>,
    computed_column_spans: bool,
    observer: O,

    // The `by_original` field maps source index to mappings within that
    // original source. This lets us essentially do bucket sort on a per-source
    // basis, and also enables lazily sorting different source's mappings.
    by_original: Option<Vec<LazilySorted<Mapping, comparators::ByOriginalLocationSameSource, O::SortByOriginalLocation>>>,
}

#[cfg(debug_assertions)]
fn unwrap<T>(o: Option<T>) -> T {
    o.unwrap()
}

#[cfg(not(debug_assertions))]
#[inline]
fn unwrap<T>(o: Option<T>) -> T {
    use std::process;
    match o {
        Some(t) => t,
        None => process::abort(),
    }
}

impl<O: Observer> Mappings<O> {
    /// Get the full set of mappings, ordered by generated location.
    #[inline]
    pub fn by_generated_location(&self) -> &[Mapping] {
        &self.by_generated
    }

    /// Compute the last generated column of each mapping.
    ///
    /// After this method has been called, any mappings with
    /// `last_generated_column == None` means that the mapping spans to the end
    /// of the line.
    #[inline]
    pub fn compute_column_spans(&mut self) {
        if self.computed_column_spans {
            return;
        }
        self.compute_column_spans_slow_path();
    }

    #[inline(never)]
    fn compute_column_spans_slow_path(&mut self) {
        debug_assert!(!self.computed_column_spans);

        let _observer = O::ComputeColumnSpans::default();

        let mut by_generated = self.by_generated.iter_mut().peekable();
        while let Some(this_mapping) = by_generated.next() {
            if let Some(next_mapping) = by_generated.peek() {
                if this_mapping.generated_line == next_mapping.generated_line {
                    this_mapping.last_generated_column = Some(next_mapping.generated_column);
                }
            }
        }

        self.computed_column_spans = true;
    }

    #[inline]
    fn source_buckets(&mut self) -> &mut [LazilySorted<Mapping, comparators::ByOriginalLocationSameSource, O::SortByOriginalLocation>] {
        if let Some(ref mut buckets) = self.by_original {
            return buckets;
        }
        self.source_buckets_slow_path()
    }

    #[inline(never)]
    fn source_buckets_slow_path(&mut self) -> &mut [LazilySorted<Mapping, comparators::ByOriginalLocationSameSource, O::SortByOriginalLocation>] {
        debug_assert!(self.by_original.is_none());

        self.compute_column_spans();

        let _observer = O::SortByOriginalLocation::default();

        let mut originals = vec![];
        for m in self.by_generated.iter().filter(|m| m.original.is_some()) {
            let source = unwrap(m.original.as_ref()).source as usize;
            while originals.len() <= source {
                originals.push(LazilySorted::Unsorted(vec![]));
            }
            unwrap(originals[source].unsorted()).push(m.clone());
        }

        self.by_original = Some(originals);
        unwrap(self.by_original.as_mut().map(|x| &mut x[..]))
    }

    /// Get the set of mappings that have original location information for the
    /// given source and ordered by original location.
    #[inline]
    pub fn by_original_source(&mut self, source: u32) -> &[Mapping] {
        if let Some(ms) = self.source_buckets().get_mut(source as usize) {
            ms.sort()
        } else {
            &[]
        }
    }

    /// Iterate over all mappings that contain original location information,
    /// sorted by their original location information.
    #[inline]
    pub fn by_original_location(&mut self) -> ByOriginalLocation<O::SortByOriginalLocation> {
        ByOriginalLocation {
            buckets: self.source_buckets().iter_mut(),
            this_bucket: [].iter(),
        }
    }

    /// Get the mapping closest to the given generated location, if any exists.
    pub fn original_location_for(
        &self,
        generated_line: u32,
        generated_column: u32,
        bias: Bias,
    ) -> Option<&Mapping> {
        let _observer = O::OriginalLocationFor::default();

        let by_generated = self.by_generated_location();

        let position = by_generated.binary_search_by(|m| {
            m.generated_line
                .cmp(&generated_line)
                .then(m.generated_column.cmp(&generated_column))
        });

        match position {
            Ok(idx) => Some(&by_generated[idx]),
            Err(idx) => match bias {
                Bias::LeastUpperBound => by_generated.get(idx),
                Bias::GreatestLowerBound => if idx == 0 {
                    None
                } else {
                    by_generated.get(idx - 1)
                },
            },
        }
    }

    /// Get the mapping closest to the given original location, if any exists.
    pub fn generated_location_for(
        &mut self,
        source: u32,
        original_line: u32,
        original_column: u32,
        bias: Bias,
    ) -> Option<&Mapping> {
        let _observer = O::GeneratedLocationFor::default();

        let position = {
            let by_original = self.by_original_source(source);

            by_original.binary_search_by(|m| {
                let original = unwrap(m.original.as_ref());
                original
                    .source
                    .cmp(&source)
                    .then(original.original_line.cmp(&original_line))
                    .then(original.original_column.cmp(&original_column))
            })
        };

        let idx = match position {
            Ok(idx) => return Some(&self.by_original_source(source)[idx]),
            Err(idx) => idx,
        };

        match bias {
            Bias::LeastUpperBound => if idx == self.by_original_source(source).len() {
                // Slide down to the next source's set of mappings.
                let mut source = source + 1;
                while unwrap(self.by_original.as_ref())
                    .get(source as usize)
                    .map_or(false, |b| b.is_empty())
                {
                    source += 1;
                }
                unwrap(self.by_original.as_mut())
                    .get_mut(source as usize)
                    .and_then(|ms| ms.sort().first())
            } else {
                self.by_original_source(source).get(idx)
            },

            Bias::GreatestLowerBound => if idx == 0 {
                if source == 0 {
                    return None;
                }

                // Slide up to the previous source's set of mappings.
                let mut source = source - 1;
                while source > 0 && unwrap(self.by_original.as_ref())
                    .get(source as usize)
                    .map_or(false, |b| b.is_empty())
                {
                    source -= 1;
                }
                unwrap(self.by_original.as_mut())
                    .get_mut(source as usize)
                    .and_then(|ms| ms.sort().first())
            } else {
                self.by_original_source(source).get(idx - 1)
            },
        }
    }

    /// Get all mappings at the given original location.
    ///
    /// If `original_column` is `None`, get all mappings on the given source and
    /// original line regardless what columns they have. If `original_column` is
    /// `Some`, only return mappings for which all of source, original line, and
    /// original column match.
    pub fn all_generated_locations_for(
        &mut self,
        source: u32,
        original_line: u32,
        original_column: Option<u32>,
    ) -> AllGeneratedLocationsFor {
        let _observer = O::AllGeneratedLocationsFor::default();

        let query_column = original_column.unwrap_or(0);

        let by_original = self.by_original_source(source);

        let compare = |m: &Mapping| {
            let original: &OriginalLocation = unwrap(m.original.as_ref());
            debug_assert_eq!(unwrap(m.original.as_ref()).source, source);
            original.original_line.cmp(&original_line)
                .then(original.original_column.cmp(&query_column))
        };

        let idx = by_original.binary_search_by(&compare);
        let mut idx = match idx {
            Ok(idx) | Err(idx) => idx,
        };

        // If there are multiple mappings for this original location, the binary
        // search gives no guarantees that this is the index for the first of
        // them, so back up to the first.
        while idx > 0 && compare(&by_original[idx - 1]) == cmp::Ordering::Equal {
            idx -= 1;
        }

        let (mappings, original_line, original_column) = if idx < by_original.len() {
            let orig = unwrap(by_original[idx].original.as_ref());
            let mappings = by_original[idx..].iter();

            // Fuzzy line matching only happens when we don't have a column.
            let original_line = if original_column.is_some() {
                original_line
            } else {
                orig.original_line
            };

            let original_column = if original_column.is_some() {
                Some(orig.original_column)
            } else {
                None
            };

            (mappings, original_line, original_column)
        } else {
            ([].iter(), original_line, original_column)
        };

        AllGeneratedLocationsFor {
            mappings,
            original_line,
            original_column,
        }
    }
}

impl<O: Observer> Default for Mappings<O> {
    #[inline]
    fn default() -> Mappings<O> {
        Mappings {
            by_generated: vec![],
            by_original: None,
            computed_column_spans: false,
            observer: Default::default(),
        }
    }
}

/// An iterator returned by `Mappings::by_original_location`.
#[derive(Debug)]
pub struct ByOriginalLocation<'a, O: 'a> {
    buckets: slice::IterMut<'a, LazilySorted<Mapping, comparators::ByOriginalLocationSameSource, O>>,
    this_bucket: slice::Iter<'a, Mapping>,
}

impl<'a, O: 'a + Default> Iterator for ByOriginalLocation<'a, O> {
    type Item = &'a Mapping;

    #[inline]
    fn next(&mut self) -> Option<Self::Item> {
        loop {
            if let Some(m) = self.this_bucket.next() {
                return Some(m);
            }

            if let Some(b) = self.buckets.next() {
                self.this_bucket = b.sort().iter();
                continue;
            }

            return None;
        }
    }
}

/// An iterator returned by `Mappings::all_generated_locations_for`.
#[derive(Debug)]
pub struct AllGeneratedLocationsFor<'a> {
    mappings: slice::Iter<'a, Mapping>,
    original_line: u32,
    original_column: Option<u32>,
}

impl<'a> Iterator for AllGeneratedLocationsFor<'a> {
    type Item = &'a Mapping;

    #[inline]
    fn next(&mut self) -> Option<Self::Item> {
        match self.mappings.next() {
            None => None,
            Some(m) => {
                let m_orig = unwrap(m.original.as_ref());

                if m_orig.original_line != self.original_line {
                    return None;
                }

                if let Some(original_column) = self.original_column {
                    if m_orig.original_column != original_column {
                        return None;
                    }
                }

                Some(m)
            }
        }
    }
}

/// A single bidirectional mapping.
///
/// Always contains generated location information.
///
/// Might contain original location information, and if so, might also have an
/// associated name.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Mapping {
    /// The generated line.
    pub generated_line: u32,

    /// The generated column.
    pub generated_column: u32,

    /// The end column of this mapping's generated location span.
    ///
    /// Before `Mappings::computed_column_spans` has been called, this is always
    /// `None`. After `Mappings::computed_column_spans` has been called, it
    /// either contains `Some` column at which the generated location ends
    /// (exclusive), or it contains `None` if it spans until the end of the
    /// generated line.
    pub last_generated_column: Option<u32>,

    /// The original location information, if any.
    pub original: Option<OriginalLocation>,
}

impl Default for Mapping {
    #[inline]
    fn default() -> Mapping {
        Mapping {
            generated_line: 0,
            generated_column: 0,
            last_generated_column: None,
            original: None,
        }
    }
}

/// Original location information within a mapping.
///
/// Contains a source filename, an original line, and an original column. Might
/// also contain an associated name.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct OriginalLocation {
    /// The source filename.
    pub source: u32,

    /// The original line.
    pub original_line: u32,

    /// The original column.
    pub original_column: u32,

    /// The associated name, if any.
    pub name: Option<u32>,
}

#[inline]
fn is_mapping_separator(byte: u8) -> bool {
    byte == b';' || byte == b','
}

#[inline]
fn read_relative_vlq<B>(previous: &mut u32, input: &mut B) -> Result<(), Error>
where
    B: Iterator<Item = u8>,
{
    let decoded = vlq::decode(input)?;
    let (new, overflowed) = (*previous as i64).overflowing_add(decoded);
    if overflowed || new > (u32::MAX as i64) {
        return Err(Error::UnexpectedlyBigNumber);
    }

    if new < 0 {
        return Err(Error::UnexpectedNegativeNumber);
    }

    *previous = new as u32;
    Ok(())
}

/// Parse a source map's `"mappings"` string into a queryable `Mappings`
/// structure.
pub fn parse_mappings<O: Observer>(input: &[u8]) -> Result<Mappings<O>, Error> {
    let _observer = O::ParseMappings::default();

    let mut generated_line = 0;
    let mut generated_column = 0;
    let mut original_line = 0;
    let mut original_column = 0;
    let mut source = 0;
    let mut name = 0;
    let mut generated_line_start_index = 0;

    let mut mappings = Mappings::default();

    // `input.len() / 2` is the upper bound on how many mappings the string
    // might contain. There would be some sequence like `A,A,A,...` or
    // `A;A;A;...`.
    let mut by_generated = Vec::with_capacity(input.len() / 2);

    let mut input = input.iter().cloned().peekable();

    while let Some(byte) = input.peek().cloned() {
        match byte {
            b';' => {
                generated_line += 1;
                generated_column = 0;
                unwrap(input.next());

                // Because mappings are sorted with regards to generated line
                // due to the encoding format, and sorting by generated location
                // starts by comparing generated line, we can sort only the
                // smaller subsequence of this generated line's mappings and end
                // up with a fully sorted array.
                if generated_line_start_index < by_generated.len() {
                    let _observer = O::SortByGeneratedLocation::default();
                    by_generated[generated_line_start_index..].sort_unstable_by(comparators::ByGeneratedTail::compare);
                    generated_line_start_index = by_generated.len();
                }
            }
            b',' => {
                unwrap(input.next());
            }
            _ => {
                let mut mapping = Mapping::default();
                mapping.generated_line = generated_line;

                // First is a generated column that is always present.
                read_relative_vlq(&mut generated_column, &mut input)?;
                mapping.generated_column = generated_column as u32;

                // Read source, original line, and original column if the
                // mapping has them.
                mapping.original = if input.peek().cloned().map_or(true, is_mapping_separator) {
                    None
                } else {
                    read_relative_vlq(&mut source, &mut input)?;
                    read_relative_vlq(&mut original_line, &mut input)?;
                    read_relative_vlq(&mut original_column, &mut input)?;

                    Some(OriginalLocation {
                        source: source,
                        original_line: original_line,
                        original_column: original_column,
                        name: if input.peek().cloned().map_or(true, is_mapping_separator) {
                            None
                        } else {
                            read_relative_vlq(&mut name, &mut input)?;
                            Some(name)
                        },
                    })
                };

                by_generated.push(mapping);
            }
        }
    }

    if generated_line_start_index < by_generated.len() {
        let _observer = O::SortByGeneratedLocation::default();
        by_generated[generated_line_start_index..].sort_unstable_by(comparators::ByGeneratedTail::compare);
    }

    mappings.by_generated = by_generated;
    Ok(mappings)
}
