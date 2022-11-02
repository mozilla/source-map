#[macro_use]
extern crate quickcheck;
extern crate source_map_mappings;
extern crate vlq;

use quickcheck::{Arbitrary, Gen};
use source_map_mappings::{Bias, Error};
use std::cmp::Ordering;
use std::fmt;
use std::i64;
use std::iter;
use std::marker::PhantomData;

trait VlqRange: 'static + Send + Copy + Clone + fmt::Debug + fmt::Display {
    fn low() -> i64;
    fn high() -> i64;
}

#[derive(Copy, Clone, Debug)]
struct Vlq<R>(i64, PhantomData<R>);

impl<R> Arbitrary for Vlq<R>
where
    R: VlqRange,
{
    fn arbitrary<G: Gen>(g: &mut G) -> Self {
        Vlq(g.gen_range(R::low(), R::high()), PhantomData)
    }

    fn shrink(&self) -> Box<Iterator<Item = Self>> {
        Box::new(self.0.shrink().map(|x| Vlq(x, PhantomData)))
    }
}

impl<R> fmt::Display for Vlq<R> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let mut v = vec![];
        vlq::encode(self.0, &mut v).unwrap();
        write!(f, "{}", String::from_utf8_lossy(&v))
    }
}

#[derive(Clone, Debug)]
enum Mapping<R> {
    Generated {
        generated_column: Vlq<R>,
    },
    Original {
        generated_column: Vlq<R>,
        source: Vlq<R>,
        original_line: Vlq<R>,
        original_column: Vlq<R>,
    },
    OriginalWithName {
        generated_column: Vlq<R>,
        source: Vlq<R>,
        original_line: Vlq<R>,
        original_column: Vlq<R>,
        name: Vlq<R>,
    },
}

impl<R> Arbitrary for Mapping<R>
where
    R: VlqRange,
{
    fn arbitrary<G: Gen>(g: &mut G) -> Self {
        match g.gen_range(0, 3) {
            0 => Mapping::Generated {
                generated_column: Vlq::<R>::arbitrary(g),
            },
            1 => Mapping::Original {
                generated_column: Vlq::<R>::arbitrary(g),
                source: Vlq::<R>::arbitrary(g),
                original_line: Vlq::<R>::arbitrary(g),
                original_column: Vlq::<R>::arbitrary(g),
            },
            2 => Mapping::OriginalWithName {
                generated_column: Vlq::<R>::arbitrary(g),
                source: Vlq::<R>::arbitrary(g),
                original_line: Vlq::<R>::arbitrary(g),
                original_column: Vlq::<R>::arbitrary(g),
                name: Vlq::<R>::arbitrary(g),
            },
            _ => unreachable!(),
        }
    }

    fn shrink(&self) -> Box<Iterator<Item = Self>> {
        match *self {
            Mapping::Generated { generated_column } => Box::new(
                generated_column
                    .shrink()
                    .map(|generated_column| Mapping::Generated { generated_column }),
            ),
            Mapping::Original {
                generated_column,
                source,
                original_line,
                original_column,
            } => {
                let shrunkens = generated_column.shrink().zip(
                    source
                        .shrink()
                        .zip(original_line.shrink().zip(original_column.shrink())),
                );
                let shrunkens = shrunkens.map(
                    move |(generated_column, (source, (original_line, original_column)))| {
                        Mapping::Original {
                            generated_column,
                            source,
                            original_line,
                            original_column,
                        }
                    },
                );

                let generated = Mapping::Generated { generated_column };
                Box::new(iter::once(generated).chain(shrunkens))
            }
            Mapping::OriginalWithName {
                generated_column,
                source,
                original_line,
                original_column,
                name,
            } => {
                let shrunkens = generated_column.shrink().zip(
                    source.shrink().zip(
                        original_line
                            .shrink()
                            .zip(original_column.shrink().zip(name.shrink())),
                    ),
                );
                let shrunkens = shrunkens.map(
                    move |(
                        generated_column,
                        (source, (original_line, (original_column, name))),
                    )| {
                        Mapping::OriginalWithName {
                            generated_column,
                            source,
                            original_line,
                            original_column,
                            name,
                        }
                    },
                );

                let generated = Mapping::Generated { generated_column };
                let original = Mapping::Original {
                    generated_column,
                    source,
                    original_line,
                    original_column,
                };
                Box::new(
                    iter::once(generated)
                        .chain(iter::once(original))
                        .chain(shrunkens),
                )
            }
        }
    }
}

impl<R: Copy> fmt::Display for Mapping<R> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match *self {
            Mapping::Generated { generated_column } => generated_column.fmt(f),
            Mapping::Original {
                generated_column,
                source,
                original_line,
                original_column,
            } => {
                generated_column.fmt(f)?;
                source.fmt(f)?;
                original_line.fmt(f)?;
                original_column.fmt(f)
            }
            Mapping::OriginalWithName {
                generated_column,
                source,
                original_line,
                original_column,
                name,
            } => {
                generated_column.fmt(f)?;
                source.fmt(f)?;
                original_line.fmt(f)?;
                original_column.fmt(f)?;
                name.fmt(f)
            }
        }
    }
}

#[derive(Clone, Debug)]
struct GeneratedLine<R>(Vec<Mapping<R>>);

impl<R> Arbitrary for GeneratedLine<R>
where
    R: VlqRange,
{
    fn arbitrary<G: Gen>(g: &mut G) -> Self {
        GeneratedLine(Vec::arbitrary(g))
    }

    fn shrink(&self) -> Box<Iterator<Item = Self>> {
        Box::new(self.0.shrink().map(|v| GeneratedLine(v)))
    }
}

impl<R: Copy> fmt::Display for GeneratedLine<R> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let mut needs_comma = false;
        for m in &self.0 {
            if needs_comma {
                write!(f, ",")?;
            }
            m.fmt(f)?;
            needs_comma = true;
        }
        Ok(())
    }
}

#[derive(Clone, Debug)]
struct Mappings<R>(Vec<GeneratedLine<R>>);

impl<R> Arbitrary for Mappings<R>
where
    R: VlqRange,
{
    fn arbitrary<G: Gen>(g: &mut G) -> Self {
        Mappings(Vec::arbitrary(g))
    }

    fn shrink(&self) -> Box<Iterator<Item = Self>> {
        Box::new(self.0.shrink().map(|v| Mappings(v)))
    }
}

impl<R: Copy> fmt::Display for Mappings<R> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let mut needs_semi = false;
        for line in &self.0 {
            if needs_semi {
                write!(f, ";")?;
            }
            line.fmt(f)?;
            needs_semi = true;
        }
        Ok(())
    }
}

#[derive(Copy, Clone, Debug)]
struct FullRange;

impl fmt::Display for FullRange {
    fn fmt(&self, _: &mut fmt::Formatter) -> fmt::Result {
        Ok(())
    }
}

impl VlqRange for FullRange {
    fn low() -> i64 {
        i64::MIN
    }
    fn high() -> i64 {
        i64::MAX
    }
}

#[derive(Copy, Clone, Debug)]
struct SmallPositives;

impl fmt::Display for SmallPositives {
    fn fmt(&self, _: &mut fmt::Formatter) -> fmt::Result {
        Ok(())
    }
}

impl VlqRange for SmallPositives {
    fn low() -> i64 {
        0
    }
    fn high() -> i64 {
        5
    }
}

quickcheck! {
    fn parse_without_panicking(mappings: Mappings<FullRange>) -> () {
        let mappings_string = mappings.to_string();
        let _ = source_map_mappings::parse_mappings::<()>(mappings_string.as_bytes());
    }

    fn parse_valid_mappings(mappings: Mappings<SmallPositives>) -> Result<(), Error> {
        let mappings_string = mappings.to_string();
        source_map_mappings::parse_mappings::<()>(mappings_string.as_bytes())?;
        Ok(())
    }

    fn compute_column_spans(mappings: Mappings<SmallPositives>) -> Result<(), Error> {
        let mappings_string = mappings.to_string();
        let mut mappings = source_map_mappings::parse_mappings::<()>(mappings_string.as_bytes())?;

        // Can compute column spans without panicking.
        mappings.compute_column_spans();

        // And those column spans make sense.
        for window in mappings.by_generated_location().windows(2) {
            let this_mapping = &window[0];
            let next_mapping = &window[1];
            if this_mapping.generated_line == next_mapping.generated_line {
                assert_eq!(this_mapping.last_generated_column.unwrap(), next_mapping.generated_column);
            } else {
                assert!(this_mapping.last_generated_column.is_none());
            }
        }

        Ok(())
    }

    fn original_location_for(
        mappings: Mappings<SmallPositives>,
        line: u32,
        col: u32,
        lub: bool
    ) -> Result<(), Error> {
        let mappings_string = mappings.to_string();
        let mappings = source_map_mappings::parse_mappings::<()>(mappings_string.as_bytes())?;
        if mappings.by_generated_location().is_empty() {
            return Ok(());
        }

        // To make this more useful, wrap `line` and `col` around the maximum
        // line and column in the mappings respectively.
        let max_line = mappings.by_generated_location()
            .iter()
            .map(|m| m.generated_line)
            .max()
            .unwrap();
        let max_col = mappings.by_generated_location()
            .iter()
            .map(|m| m.generated_column)
            .max()
            .unwrap();
        let line = line % (max_line + 1);
        let col = col % (max_col + 1);

        let bias = if lub {
            Bias::LeastUpperBound
        } else {
            Bias::GreatestLowerBound
        };

        // If we find a mapping, then it should either be an exact match or it
        // should have the proper ordering relation to our query line/column
        // based on the given bias.
        if let Some(mapping) = mappings.original_location_for(line, col, bias) {
            let found_line = mapping.generated_line;
            let found_col = mapping.generated_column;
            match line.cmp(&found_line).then(col.cmp(&found_col)) {
                Ordering::Equal => {}
                Ordering::Greater if bias == Bias::GreatestLowerBound => {}
                Ordering::Less if bias == Bias::LeastUpperBound => {}
                _ => panic!(
                    "Found bad location {{ line = {}, col = {} }} when \
                     searching for {{ line = {}, col = {} }} with bias {:?}",
                    found_line,
                    found_col,
                    line,
                    col,
                    bias
                ),
            }
            return Ok(())
        }

        // If we didn't get any result, then every mapping should not match our
        // query, and should additionally be on the opposite side of ordering
        // from our requested bias.
        for m in mappings.by_generated_location().iter() {
            match m.generated_line.cmp(&line).then(m.generated_column.cmp(&col)) {
                Ordering::Equal => panic!("found matching mapping when we returned none"),
                Ordering::Less => {
                    assert_eq!(bias, Bias::LeastUpperBound);
                }
                Ordering::Greater => {
                    assert_eq!(bias, Bias::GreatestLowerBound);
                }
            }
        }

        Ok(())
    }

    fn original_mappings_have_original(
        mappings: Mappings<SmallPositives>
    ) -> Result<bool, Error> {
        let mappings_string = mappings.to_string();
        let mut mappings = source_map_mappings::parse_mappings::<()>(mappings_string.as_bytes())?;
        Ok(mappings.by_original_location().all(|m| m.original.as_ref().is_some()))
    }

    fn generated_location_for(
        mappings: Mappings<SmallPositives>,
        source: u32,
        line: u32,
        col: u32,
        lub: bool
    ) -> Result<(), Error> {
        let mappings_string = mappings.to_string();
        let mut mappings = source_map_mappings::parse_mappings::<()>(mappings_string.as_bytes())?;
        if !mappings.by_generated_location().iter().any(|m| m.original.is_some()) {
            return Ok(());
        }

        // To make this more useful, wrap `source`, `line`, and `col` around the
        // maximums.
        let max_source = mappings.by_original_location()
            .map(|m| m.original.as_ref().unwrap().source)
            .max()
            .unwrap();
        let max_line = mappings.by_original_location()
            .map(|m| m.original.as_ref().unwrap().original_line)
            .max()
            .unwrap();
        let max_col = mappings.by_original_location()
            .map(|m| m.original.as_ref().unwrap().original_column)
            .max()
            .unwrap();
        let source = source % (max_source + 1);
        let line = line % (max_line + 1);
        let col = col % (max_col + 1);

        let bias = if lub {
            Bias::LeastUpperBound
        } else {
            Bias::GreatestLowerBound
        };

        // If we find a mapping, then it should either be an exact match or it
        // should have the proper ordering relation to our query line/column
        // based on the given bias.
        if let Some(mapping) = mappings.generated_location_for(source, line, col, bias) {
            let found_source = mapping.original.as_ref().unwrap().source;
            let found_line = mapping.original.as_ref().unwrap().original_line;
            let found_col = mapping.original.as_ref().unwrap().original_column;

            let order = source.cmp(&found_source)
                .then(line.cmp(&found_line))
                .then(col.cmp(&found_col));

            match order {
                Ordering::Equal => {}
                Ordering::Greater if bias == Bias::GreatestLowerBound => {}
                Ordering::Less if bias == Bias::LeastUpperBound => {}
                _ => panic!(
                    "Found bad location {{ line = {}, col = {} }} when \
                     searching for {{ line = {}, col = {} }} with bias {:?}",
                    found_line,
                    found_col,
                    line,
                    col,
                    bias
                ),
            }
            return Ok(())
        }

        // If we didn't get any result, then every mapping should not match our
        // query, and should additionally be on the opposite side of ordering
        // from our requested bias.
        for m in mappings.by_original_location() {
            let m_orig = m.original.as_ref().unwrap();
            let m_source = m_orig.source;
            let m_line = m_orig.original_line;
            let m_col = m_orig.original_column;

            let order = m_source.cmp(&source)
                .then(m_line.cmp(&line))
                .then(m_col.cmp(&col));

            match order {
                Ordering::Equal => panic!("found matching mapping when we returned none"),
                Ordering::Less => {
                    assert_eq!(bias, Bias::LeastUpperBound);
                }
                Ordering::Greater => {
                    assert_eq!(bias, Bias::GreatestLowerBound);
                }
            }
        }

        Ok(())
    }

    fn all_generated_locations_for(
        mappings: Mappings<SmallPositives>,
        source: u32,
        line: u32,
        col: Option<u32>
    ) -> Result<(), Error> {
        let mappings_string = mappings.to_string();
        let mut mappings = source_map_mappings::parse_mappings::<()>(mappings_string.as_bytes())?;
        if !mappings.by_generated_location().iter().any(|m| m.original.is_some()) {
            return Ok(());
        }

        let max_source = mappings.by_original_location()
            .map(|m| m.original.as_ref().unwrap().source)
            .max()
            .unwrap();
        let max_line = mappings.by_original_location()
            .map(|m| m.original.as_ref().unwrap().original_line)
            .max()
            .unwrap();
        let max_col = mappings.by_original_location()
            .map(|m| m.original.as_ref().unwrap().original_column)
            .max()
            .unwrap();
        let source = source % (max_source + 1);
        let mut line = line % (max_line + 1);
        let mut col = if let Some(col) = col {
            Some(col % (max_col + 1))
        } else {
            None
        };

        let mut count = 0;
        {
            let locations = mappings.all_generated_locations_for(source, line, col);

            for (idx, m) in locations.into_iter().enumerate() {
                count += 1;

                let m_orig = m.original.as_ref().unwrap();

                // `all_generated_locations_for` does fuzzy searching: it will
                // slide down to the next original line if there are no mappings
                // on the queried line. Ditto for columns. This is to match
                // mozilla/source-map's behavior.
                if idx == 0 {
                    if m_orig.original_line != line {
                        assert!(m_orig.original_line > line);
                        line = m_orig.original_line;
                    }
                    if let Some(c) = col {
                        if c != m_orig.original_column {
                            col = Some(m_orig.original_column);
                        }
                    }
                }

                assert_eq!(
                    m_orig.original_line,
                    line,
                    "result location's line is our query's line",
                );

                if let Some(col) = col {
                    assert_eq!(
                        m_orig.original_column,
                        col,
                        "result location's column is our query's column",
                    );
                }
            }
        }

        assert_eq!(
            count,
            mappings.by_original_location()
                .filter(|m| {
                    let m_orig = m.original.as_ref().unwrap();
                    if m_orig.source != source || m_orig.original_line != line {
                        return false;
                    }
                    if let Some(col) = col {
                        if m_orig.original_column != col {
                            return false;
                        }
                    }
                    true
                })
                .count(),
            "the iterator should find the right number of results"
        );

        Ok(())
    }
}
