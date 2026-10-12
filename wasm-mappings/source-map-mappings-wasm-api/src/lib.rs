//! The public JS API to the `source-map-mappings` crate.
//!
//! This is a `wasm-bindgen` module. JS obtains a `Mappings` handle from
//! `parseMappings`, queries it, and calls `free()` on it when finished.
//!
//! Query methods that yield mappings take a `MappingCallback` -- a JS function
//! invoked once per mapping with a flat list of primitives. Passing the
//! callback per-call (rather than as a single module-level import) is what
//! lets JS avoid maintaining a stack of "currently active" callbacks.

#![deny(missing_docs)]

extern crate source_map_mappings;
extern crate wasm_bindgen;

use source_map_mappings::{Bias, Mapping};
use std::process;
use wasm_bindgen::prelude::*;

#[cfg(feature = "profiling")]
mod observer {
    use wasm_bindgen::prelude::*;

    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = console)]
        fn time(label: &str);
        #[wasm_bindgen(js_namespace = console, js_name = timeEnd)]
        fn time_end(label: &str);
    }

    macro_rules! define_raii_observer {
        ( $name:ident , $label:expr ) => {
            #[derive(Debug)]
            pub struct $name;

            impl Default for $name {
                #[inline]
                fn default() -> $name {
                    time($label);
                    $name
                }
            }

            impl Drop for $name {
                #[inline]
                fn drop(&mut self) {
                    time_end($label);
                }
            }
        };
    }

    define_raii_observer!(ParseMappings, "parse_mappings");
    define_raii_observer!(SortByOriginalLocation, "sort_by_original_location");
    define_raii_observer!(SortByGeneratedLocation, "sort_by_generated_location");
    define_raii_observer!(ComputeColumnSpans, "compute_column_spans");
    define_raii_observer!(OriginalLocationFor, "original_location_for");
    define_raii_observer!(GeneratedLocationFor, "generated_location_for");
    define_raii_observer!(AllGeneratedLocationsFor, "all_generated_locations_for");

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
    /// No-op observer used when the `profiling` feature is disabled.
    pub type Observer = ();
}

use observer::Observer;

#[wasm_bindgen]
extern "C" {
    /// A JS function invoked once per mapping.
    pub type MappingCallback;

    /// Invoke the callback with a single mapping.
    ///
    /// `last_generated_column` is only meaningful when
    /// `has_last_generated_column`; `source`, `original_line` and
    /// `original_column` only when `has_original`; `name` only when
    /// `has_name`.
    #[wasm_bindgen(method, js_name = call, catch)]
    fn invoke(
        this: &MappingCallback,
        ctx: &JsValue,
        generated_line: u32,
        generated_column: u32,
        has_last_generated_column: bool,
        last_generated_column: u32,
        has_original: bool,
        source: u32,
        original_line: u32,
        original_column: u32,
        has_name: bool,
        name: u32,
    ) -> Result<(), JsValue>;
}

#[inline]
fn emit(cb: &MappingCallback, mapping: &Mapping) -> Result<(), JsValue> {
    let (has_last_generated_column, last_generated_column) =
        match mapping.last_generated_column {
            Some(c) => (true, c),
            None => (false, 0),
        };

    let (has_original, source, original_line, original_column, has_name, name) =
        match mapping.original.as_ref() {
            Some(original) => {
                let (has_name, name) = match original.name {
                    Some(name) => (true, name),
                    None => (false, 0),
                };
                (
                    true,
                    original.source,
                    original.original_line,
                    original.original_column,
                    has_name,
                    name,
                )
            }
            None => (false, 0, 0, 0, false, 0),
        };

    cb.invoke(
        &JsValue::NULL,
        mapping.generated_line,
        mapping.generated_column,
        has_last_generated_column,
        last_generated_column,
        has_original,
        source,
        original_line,
        original_column,
        has_name,
        name,
    )
}

#[inline]
fn u32_to_bias(bias: u32) -> Bias {
    match bias {
        1 => Bias::GreatestLowerBound,
        2 => Bias::LeastUpperBound,
        otherwise => {
            if cfg!(debug_assertions) {
                panic!(
                    "Invalid `Bias = {}`; must be `Bias::GreatestLowerBound = {}` or \
                     `Bias::LeastUpperBound = {}`",
                    otherwise,
                    Bias::GreatestLowerBound as u32,
                    Bias::LeastUpperBound as u32,
                )
            } else {
                process::abort()
            }
        }
    }
}

/// A parsed `mappings` string, ready to be queried.
///
/// JS owns this handle and must call `free()` on it when finished.
#[wasm_bindgen]
#[derive(Debug)]
pub struct Mappings {
    inner: source_map_mappings::Mappings<Observer>,
}

/// Parse a source map's `mappings` string.
///
/// On failure, rejects with the numeric `source_map_mappings::Error` code.
/// Replaces the old `allocate_mappings` / `parse_mappings` / `get_last_error`
/// trio: `wasm-bindgen` copies the string into wasm memory itself, so JS no
/// longer has to hand-manage a buffer.
#[wasm_bindgen(js_name = parseMappings)]
pub fn parse_mappings(mappings: &str) -> Result<Mappings, JsValue> {
    source_map_mappings::parse_mappings(mappings.as_bytes())
        .map(|inner| Mappings { inner })
        .map_err(|e| JsValue::from(e as u32))
}

#[wasm_bindgen]
impl Mappings {
    /// Invoke `cb` on each mapping, in order of generated location.
    #[wasm_bindgen(js_name = byGeneratedLocation)]
    pub fn by_generated_location(&mut self, cb: &MappingCallback) -> Result<(), JsValue> {
        for m in self.inner.by_generated_location().iter() {
            emit(cb, m)?;
        }
        Ok(())
    }

    /// Invoke `cb` on each mapping that has original location information, in
    /// order of original location.
    #[wasm_bindgen(js_name = byOriginalLocation)]
    pub fn by_original_location(&mut self, cb: &MappingCallback) -> Result<(), JsValue> {
        for m in self.inner.by_original_location() {
            emit(cb, m)?;
        }
        Ok(())
    }

    /// Compute column spans for the mappings.
    #[wasm_bindgen(js_name = computeColumnSpans)]
    pub fn compute_column_spans(&mut self) {
        self.inner.compute_column_spans();
    }

    /// Find the mapping for the given generated location, if any exists, and
    /// invoke `cb` with it once.
    #[wasm_bindgen(js_name = originalLocationFor)]
    pub fn original_location_for(
        &mut self,
        generated_line: u32,
        generated_column: u32,
        bias: u32,
        cb: &MappingCallback,
    ) -> Result<(), JsValue> {
        if let Some(m) =
            self.inner
                .original_location_for(generated_line, generated_column, u32_to_bias(bias))
        {
            emit(cb, m)?;
        }
        Ok(())
    }

    /// Find the mapping for the given original location, if any exists, and
    /// invoke `cb` with it once.
    #[wasm_bindgen(js_name = generatedLocationFor)]
    pub fn generated_location_for(
        &mut self,
        source: u32,
        original_line: u32,
        original_column: u32,
        bias: u32,
        cb: &MappingCallback,
    ) -> Result<(), JsValue> {
        if let Some(m) = self.inner.generated_location_for(
            source,
            original_line,
            original_column,
            u32_to_bias(bias),
        ) {
            emit(cb, m)?;
        }
        Ok(())
    }

    /// Find all mappings for the given original location and invoke `cb` on
    /// each of them.
    ///
    /// When `has_original_column` is false, `original_column` is ignored and
    /// every mapping with a matching source and original line is yielded.
    #[wasm_bindgen(js_name = allGeneratedLocationsFor)]
    pub fn all_generated_locations_for(
        &mut self,
        source: u32,
        original_line: u32,
        has_original_column: bool,
        original_column: u32,
        cb: &MappingCallback,
    ) -> Result<(), JsValue> {
        let original_column = if has_original_column {
            Some(original_column)
        } else {
            None
        };

        for m in self
            .inner
            .all_generated_locations_for(source, original_line, original_column)
        {
            emit(cb, m)?;
        }
        Ok(())
    }
}
