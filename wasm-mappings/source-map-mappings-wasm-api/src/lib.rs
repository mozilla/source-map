//! The public JS API to the `source-map-mappings` crate.
//!
//! ## Usage
//!
//! 1. Instantiate the WebAssembly module, supplying a JS implementation of
//! `mapping_callback`.
//!
//! 2. Allocate space for the mappings string with `allocate_mappings`.
//!
//! 3. Initialize the mappings string by copying the JS `String`'s data into it.
//!
//! 4. Parse the mappings with `parse_mappings`. Handle errors, if any.
//!
//! 5. Query the resulting `Mappings` structure as needed with
//! `by_generated_location`, `by_original_location`, `compute_column_spans`,
//! `original_location_for`, `generated_location_for`, and
//! `all_generated_locations_for` as needed.
//!
//! 6. When finished with `Mappings` structure, dispose of it with
//! `free_mappings`.

// NB: every exported function must be `#[no_mangle]` and `pub extern "C"`.

#![deny(missing_docs)]

extern crate source_map_mappings;

use source_map_mappings::{Bias, Error, Mapping, Mappings};
use std::mem;
use std::ptr;
use std::process;
use std::slice;

#[cfg(feature = "profiling")]
mod observer {
    use source_map_mappings;

    macro_rules! define_raii_observer {
        ( $name:ident , $ctor:ident , $dtor:ident ) => {
            #[derive(Debug)]
            pub struct $name;

            impl Default for $name {
                #[inline]
                fn default() -> $name {
                    extern "C" {
                        fn $ctor();
                    }
                    unsafe {
                        $ctor();
                    }
                    $name
                }
            }

            impl Drop for $name {
                #[inline]
                fn drop(&mut self) {
                    extern "C" {
                        fn $dtor();
                    }
                    unsafe {
                        $dtor();
                    }
                }
            }
        }
    }

    define_raii_observer!(ParseMappings, start_parse_mappings, end_parse_mappings);
    define_raii_observer!(
        SortByOriginalLocation,
        start_sort_by_original_location,
        end_sort_by_original_location
    );
    define_raii_observer!(
        SortByGeneratedLocation,
        start_sort_by_generated_location,
        end_sort_by_generated_location
    );
    define_raii_observer!(
        ComputeColumnSpans,
        start_compute_column_spans,
        end_compute_column_spans
    );
    define_raii_observer!(
        OriginalLocationFor,
        start_original_location_for,
        end_original_location_for
    );
    define_raii_observer!(
        GeneratedLocationFor,
        start_generated_location_for,
        end_generated_location_for
    );
    define_raii_observer!(
        AllGeneratedLocationsFor,
        start_all_generated_locations_for,
        end_all_generated_locations_for
    );

    #[derive(Debug, Default)]
    pub struct Observer;

    impl source_map_mappings::Observer for Observer {
        type ParseMappings = ParseMappings;
        type SortByOriginalLocation = SortByOriginalLocation;
        type SortByGeneratedLocation = SortByGeneratedLocation;
        type ComputeColumnSpans = ComputeColumnSpans;
        type OriginalLocationFor = OriginalLocationFor;
        type GeneratedLocationFor = GeneratedLocationFor;
        type AllGeneratedLocationsFor = AllGeneratedLocationsFor;
    }
}

#[cfg(not(feature = "profiling"))]
mod observer {
    pub type Observer = ();
}

use observer::Observer;

static mut LAST_ERROR: Option<Error> = None;

/// Get the last error's error code, or 0 if there was none.
///
/// See `source_map_mappings::Error` for the error code definitions.
#[no_mangle]
pub extern "C" fn get_last_error() -> u32 {
    unsafe {
        match LAST_ERROR {
            None => 0,
            Some(e) => e as u32,
        }
    }
}

#[inline]
fn assert_pointer_is_word_aligned(p: *mut u8) {
    debug_assert_eq!(p as usize & (mem::size_of::<usize>() - 1), 0);
}

/// Allocate space for a mappings string of the given size (in bytes).
///
/// It is the JS callers responsibility to initialize the resulting buffer by
/// copying the JS `String` holding the source map's "mappings" into it (encoded
/// in ascii).
#[no_mangle]
pub extern "C" fn allocate_mappings(size: usize) -> *mut u8 {
    // Make sure that we don't lose any bytes from size in the remainder.
    let size_in_units_of_usize = (size + mem::size_of::<usize>() - 1) / mem::size_of::<usize>();

    // Make room for two additional `usize`s: we'll stuff capacity and length in
    // there.
    let mut vec: Vec<usize> = Vec::with_capacity(size_in_units_of_usize + 2);

    // And do the stuffing.
    let capacity = vec.capacity();
    vec.push(capacity);
    vec.push(size);

    // Leak the vec's elements and get a pointer to them.
    let ptr = vec.as_mut_ptr();
    debug_assert!(!ptr.is_null());
    mem::forget(vec);

    // Advance the pointer past our stuffed data and return it to JS, so that JS
    // can write the mappings string into it.
    let ptr = ptr.wrapping_offset(2) as *mut u8;
    assert_pointer_is_word_aligned(ptr);
    ptr
}

#[inline]
fn constrain<'a, T>(_scope: &'a (), reference: &'a T) -> &'a T
where
    T: ?Sized,
{
    reference
}

/// Parse the given initialized mappings string into a `Mappings` structure.
///
/// Returns `NULL` on failure, or a pointer to the parsed `Mappings` structure
/// on success.
///
/// In the case of failure, the error can be retrieved with `get_last_error`.
///
/// In the case of success, the caller takes ownership of the result, and must
/// call `free_mappings` to destroy it when finished.
///
/// In both the success or failure cases, the caller gives up ownership of the
/// input mappings string and must not use it again.
#[no_mangle]
pub extern "C" fn parse_mappings(mappings: *mut u8) -> *mut Mappings<Observer> {
    assert_pointer_is_word_aligned(mappings);
    let mappings = mappings as *mut usize;

    // Unstuff the data we put just before the pointer to the mappings
    // string.
    let capacity_ptr = mappings.wrapping_offset(-2);
    debug_assert!(!capacity_ptr.is_null());
    let capacity = unsafe { *capacity_ptr };

    let size_ptr = mappings.wrapping_offset(-1);
    debug_assert!(!size_ptr.is_null());
    let size = unsafe { *size_ptr };

    // Construct the input slice from the pointer and parse the mappings.
    let result = unsafe {
        let input = slice::from_raw_parts(mappings as *const u8, size);
        let this_scope = ();
        let input = constrain(&this_scope, input);
        source_map_mappings::parse_mappings(input)
    };

    // Deallocate the mappings string and its two prefix words.
    let size_in_usizes = (size + mem::size_of::<usize>() - 1) / mem::size_of::<usize>();
    unsafe {
        Vec::<usize>::from_raw_parts(capacity_ptr, size_in_usizes + 2, capacity);
    }

    // Return the result, saving any errors on the side for later inspection by
    // JS if required.
    match result {
        Ok(mappings) => Box::into_raw(Box::new(mappings)),
        Err(e) => {
            unsafe {
                LAST_ERROR = Some(e);
            }
            ptr::null_mut()
        }
    }
}

/// Destroy the given `Mappings` structure.
///
/// The caller gives up ownership of the mappings and must not use them again.
#[no_mangle]
pub extern "C" fn free_mappings(mappings: *mut Mappings<Observer>) {
    unsafe {
        Box::from_raw(mappings);
    }
}

#[inline]
unsafe fn mappings_mut<'a>(
    _scope: &'a (),
    mappings: *mut Mappings<Observer>,
) -> &'a mut Mappings<Observer> {
    mappings.as_mut().unwrap()
}

extern "C" {
    fn mapping_callback(
        // These two parameters are always valid.
        generated_line: u32,
        generated_column: u32,

        // The `last_generated_column` parameter is only valid if
        // `has_last_generated_column` is `true`.
        has_last_generated_column: bool,
        last_generated_column: u32,

        // The `source`, `original_line`, and `original_column` parameters are
        // only valid if `has_original` is `true`.
        has_original: bool,
        source: u32,
        original_line: u32,
        original_column: u32,

        // The `name` parameter is only valid if `has_name` is `true`.
        has_name: bool,
        name: u32,
    );
}

#[inline]
unsafe fn invoke_mapping_callback(mapping: &Mapping) {
    let generated_line = mapping.generated_line;
    let generated_column = mapping.generated_column;

    let (has_last_generated_column, last_generated_column) =
        if let Some(last_generated_column) = mapping.last_generated_column {
            (true, last_generated_column)
        } else {
            (false, 0)
        };

    let (has_original, source, original_line, original_column, has_name, name) =
        if let Some(original) = mapping.original.as_ref() {
            let (has_name, name) = if let Some(name) = original.name {
                (true, name)
            } else {
                (false, 0)
            };

            (
                true,
                original.source,
                original.original_line,
                original.original_column,
                has_name,
                name,
            )
        } else {
            (false, 0, 0, 0, false, 0)
        };

    mapping_callback(
        generated_line,
        generated_column,
        has_last_generated_column,
        last_generated_column,
        has_original,
        source,
        original_line,
        original_column,
        has_name,
        name,
    );
}

/// Invoke the `mapping_callback` on each mapping in the given `Mappings`
/// structure, in order of generated location.
#[no_mangle]
pub extern "C" fn by_generated_location(mappings: *mut Mappings<Observer>) {
    let this_scope = ();
    let mappings = unsafe { mappings_mut(&this_scope, mappings) };

    mappings
        .by_generated_location()
        .iter()
        .for_each(|m| unsafe {
            invoke_mapping_callback(m);
        });
}

/// Compute column spans for the given mappings.
#[no_mangle]
pub extern "C" fn compute_column_spans(mappings: *mut Mappings<Observer>) {
    let this_scope = ();
    let mappings = unsafe { mappings_mut(&this_scope, mappings) };

    mappings.compute_column_spans();
}

/// Invoke the `mapping_callback` on each mapping in the given `Mappings`
/// structure that has original location information, in order of original
/// location.
#[no_mangle]
pub extern "C" fn by_original_location(mappings: *mut Mappings<Observer>) {
    let this_scope = ();
    let mappings = unsafe { mappings_mut(&this_scope, mappings) };

    mappings.by_original_location().for_each(|m| unsafe {
        invoke_mapping_callback(m);
    });
}

#[inline]
fn u32_to_bias(bias: u32) -> Bias {
    match bias {
        1 => Bias::GreatestLowerBound,
        2 => Bias::LeastUpperBound,
        otherwise => if cfg!(debug_assertions) {
            panic!(
                "Invalid `Bias = {}`; must be `Bias::GreatestLowerBound = {}` or \
                 `Bias::LeastUpperBound = {}`",
                otherwise,
                Bias::GreatestLowerBound as u32,
                Bias::LeastUpperBound as u32,
            )
        } else {
            process::abort()
        },
    }
}

/// Find the mapping for the given generated location, if any exists.
///
/// If a mapping is found, the `mapping_callback` is invoked with it
/// once. Otherwise, the `mapping_callback` is not invoked at all.
#[no_mangle]
pub extern "C" fn original_location_for(
    mappings: *mut Mappings<Observer>,
    generated_line: u32,
    generated_column: u32,
    bias: u32,
) {
    let this_scope = ();
    let mappings = unsafe { mappings_mut(&this_scope, mappings) };
    let bias = u32_to_bias(bias);

    if let Some(m) = mappings.original_location_for(generated_line, generated_column, bias) {
        unsafe {
            invoke_mapping_callback(m);
        }
    }
}

/// Find the mapping for the given original location, if any exists.
///
/// If a mapping is found, the `mapping_callback` is invoked with it
/// once. Otherwise, the `mapping_callback` is not invoked at all.
#[no_mangle]
pub extern "C" fn generated_location_for(
    mappings: *mut Mappings<Observer>,
    source: u32,
    original_line: u32,
    original_column: u32,
    bias: u32,
) {
    let this_scope = ();
    let mappings = unsafe { mappings_mut(&this_scope, mappings) };
    let bias = u32_to_bias(bias);

    if let Some(m) = mappings.generated_location_for(source, original_line, original_column, bias) {
        unsafe {
            invoke_mapping_callback(m);
        }
    }
}

/// Find all mappings for the given original location, and invoke the
/// `mapping_callback` on each of them.
///
/// If `has_original_column` is `true`, then the `mapping_callback` is only
/// invoked with mappings with matching source and original line **and**
/// original column is equal to `original_column`. If `has_original_column` is
/// `false`, then the `original_column` argument is ignored, and the
/// `mapping_callback` is invoked on all mappings with matching source and
/// original line.
#[no_mangle]
pub extern "C" fn all_generated_locations_for(
    mappings: *mut Mappings<Observer>,
    source: u32,
    original_line: u32,
    has_original_column: bool,
    original_column: u32,
) {
    let this_scope = ();
    let mappings = unsafe { mappings_mut(&this_scope, mappings) };

    let original_column = if has_original_column {
        Some(original_column)
    } else {
        None
    };

    for m in mappings.all_generated_locations_for(source, original_line, original_column) {
        unsafe {
            invoke_mapping_callback(m);
        }
    }
}
