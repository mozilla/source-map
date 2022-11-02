extern crate source_map_mappings;

use source_map_mappings::{parse_mappings, Bias, Mapping, Mappings, OriginalLocation};

#[test]
fn parse_empty_mappings() {
    let mut mappings = parse_mappings::<()>(&[]).expect("should parse OK");
    assert!(mappings.by_generated_location().is_empty());
    assert_eq!(mappings.by_original_location().count(), 0);
}

#[test]
fn invalid_mappings() {
    assert!(parse_mappings::<()>(b"...").is_err());
}

// From mozilla/source-map's test/util.js `exports.testMap`.
const TEST_MAPPINGS: &'static [u8] =
    b"CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA";

#[test]
fn can_parse_test_mappings_ok() {
    parse_mappings::<()>(TEST_MAPPINGS).unwrap();
}

fn assert_generated_location_for(
    mappings: &mut Mappings,
    source: u32,
    original_line: u32,
    original_column: u32,
    bias: Bias,
    expected: Option<Mapping>,
) {
    let actual = mappings.generated_location_for(source, original_line, original_column, bias);
    assert_eq!(actual, expected.as_ref());
}

fn assert_original_location_for(
    mappings: &mut Mappings,
    generated_line: u32,
    generated_column: u32,
    bias: Bias,
    expected: Option<Mapping>,
) {
    let actual = mappings.original_location_for(generated_line, generated_column, bias);
    assert_eq!(actual, expected.as_ref());
}

fn assert_bidirectional(mappings: &mut Mappings, mapping: Mapping) {
    let orig = mapping.original.as_ref().unwrap();
    for bias in &[Bias::GreatestLowerBound, Bias::LeastUpperBound] {
        assert_generated_location_for(
            mappings,
            orig.source,
            orig.original_line,
            orig.original_column,
            *bias,
            Some(mapping.clone()),
        );

        assert_original_location_for(
            mappings,
            mapping.generated_line,
            mapping.generated_column,
            *bias,
            Some(mapping.clone()),
        );
    }
}

#[test]
fn test_mapping_back_exactly() {
    let mut mappings = parse_mappings::<()>(TEST_MAPPINGS).unwrap();

    assert_bidirectional(
        &mut mappings,
        Mapping {
            generated_line: 0,
            generated_column: 1,
            last_generated_column: Some(5),
            original: Some(OriginalLocation {
                source: 0,
                original_line: 0,
                original_column: 1,
                name: None,
            }),
        },
    );
    assert_bidirectional(
        &mut mappings,
        Mapping {
            generated_line: 0,
            generated_column: 5,
            last_generated_column: Some(9),
            original: Some(OriginalLocation {
                source: 0,
                original_line: 0,
                original_column: 5,
                name: None,
            }),
        },
    );
    assert_bidirectional(
        &mut mappings,
        Mapping {
            generated_line: 0,
            generated_column: 9,
            last_generated_column: Some(18),
            original: Some(OriginalLocation {
                source: 0,
                original_line: 0,
                original_column: 11,
                name: None,
            }),
        },
    );
    assert_bidirectional(
        &mut mappings,
        Mapping {
            generated_line: 0,
            generated_column: 18,
            last_generated_column: Some(21),
            original: Some(OriginalLocation {
                source: 0,
                original_line: 0,
                original_column: 21,
                name: Some(0),
            }),
        },
    );
    assert_bidirectional(
        &mut mappings,
        Mapping {
            generated_line: 0,
            generated_column: 21,
            last_generated_column: Some(28),
            original: Some(OriginalLocation {
                source: 0,
                original_line: 1,
                original_column: 3,
                name: None,
            }),
        },
    );
    assert_bidirectional(
        &mut mappings,
        Mapping {
            generated_line: 0,
            generated_column: 28,
            last_generated_column: Some(32),
            original: Some(OriginalLocation {
                source: 0,
                original_line: 1,
                original_column: 10,
                name: Some(1),
            }),
        },
    );
    assert_bidirectional(
        &mut mappings,
        Mapping {
            generated_line: 0,
            generated_column: 32,
            last_generated_column: None,
            original: Some(OriginalLocation {
                source: 0,
                original_line: 1,
                original_column: 14,
                name: Some(0),
            }),
        },
    );

    assert_bidirectional(
        &mut mappings,
        Mapping {
            generated_line: 1,
            generated_column: 1,
            last_generated_column: Some(5),
            original: Some(OriginalLocation {
                source: 1,
                original_line: 0,
                original_column: 1,
                name: None,
            }),
        },
    );
    assert_bidirectional(
        &mut mappings,
        Mapping {
            generated_line: 1,
            generated_column: 5,
            last_generated_column: Some(9),
            original: Some(OriginalLocation {
                source: 1,
                original_line: 0,
                original_column: 5,
                name: None,
            }),
        },
    );
    assert_bidirectional(
        &mut mappings,
        Mapping {
            generated_line: 1,
            generated_column: 9,
            last_generated_column: Some(18),
            original: Some(OriginalLocation {
                source: 1,
                original_line: 0,
                original_column: 11,
                name: None,
            }),
        },
    );
    assert_bidirectional(
        &mut mappings,
        Mapping {
            generated_line: 1,
            generated_column: 18,
            last_generated_column: Some(21),
            original: Some(OriginalLocation {
                source: 1,
                original_line: 0,
                original_column: 21,
                name: Some(2),
            }),
        },
    );
    assert_bidirectional(
        &mut mappings,
        Mapping {
            generated_line: 1,
            generated_column: 21,
            last_generated_column: Some(28),
            original: Some(OriginalLocation {
                source: 1,
                original_line: 1,
                original_column: 3,
                name: None,
            }),
        },
    );
    assert_bidirectional(
        &mut mappings,
        Mapping {
            generated_line: 1,
            generated_column: 28,
            last_generated_column: None,
            original: Some(OriginalLocation {
                source: 1,
                original_line: 1,
                original_column: 10,
                name: Some(2),
            }),
        },
    );
}

// From mozilla/source-map's test/test-source-map-consumer.js's "test
// allGeneratedPositionsFor for line" test case.
const TEST_MAPPINGS_2: &'static [u8] = b";EAAC,ACAA;EACA,CAAC;EACD";

#[test]
fn test_all_generated_locations_for_some_line() {
    let mut mappings = parse_mappings::<()>(TEST_MAPPINGS_2).unwrap();

    let mappings_on_source_1_line_1: Vec<_> = mappings
        .all_generated_locations_for(1, 1, None)
        .cloned()
        .collect();

    assert_eq!(
        mappings_on_source_1_line_1,
        vec![
            Mapping {
                generated_line: 2,
                generated_column: 2,
                last_generated_column: Some(3),
                original: Some(OriginalLocation {
                    source: 1,
                    original_line: 1,
                    original_column: 1,
                    name: None,
                }),
            },
            Mapping {
                generated_line: 2,
                generated_column: 3,
                last_generated_column: None,
                original: Some(OriginalLocation {
                    source: 1,
                    original_line: 1,
                    original_column: 2,
                    name: None,
                }),
            },
        ]
    );
}

// Taken from mozilla/source-map's test/test-source-map-consumer.js's "test
// allGeneratedPositionsFor for line fuzzy"
const TEST_MAPPINGS_3: &'static [u8] = b";EAAC,ACAA;;EAEA";

#[test]
fn test_all_generated_locations_for_line_fuzzy() {
    let mut mappings = parse_mappings::<()>(TEST_MAPPINGS_3).unwrap();

    let mappings_on_source_1_line_1: Vec<_> = mappings
        .all_generated_locations_for(1, 1, None)
        .cloned()
        .collect();

    assert_eq!(
        mappings_on_source_1_line_1,
        vec![
            Mapping {
                generated_line: 3,
                generated_column: 2,
                last_generated_column: None,
                original: Some(OriginalLocation {
                    source: 1,
                    original_line: 2,
                    original_column: 1,
                    name: None,
                }),
            },
        ]
    );
}

// Taken from mozilla/source-map's test/test-source-map-consumer.js's "test
// allGeneratedPositionsFor for column".
const TEST_MAPPINGS_4: &'static [u8] = b"EAAC,CAAA";

#[test]
fn test_all_generated_locations_for_column() {
    let mut mappings = parse_mappings::<()>(TEST_MAPPINGS_4).unwrap();

    let mappings_on_source_0_line_0_column_1: Vec<_> = mappings
        .all_generated_locations_for(0, 0, Some(1))
        .cloned()
        .collect();

    assert_eq!(
        mappings_on_source_0_line_0_column_1,
        vec![
            Mapping {
                generated_line: 0,
                generated_column: 2,
                last_generated_column: Some(3),
                original: Some(OriginalLocation {
                    source: 0,
                    original_line: 0,
                    original_column: 1,
                    name: None,
                }),
            },
            Mapping {
                generated_line: 0,
                generated_column: 3,
                last_generated_column: None,
                original: Some(OriginalLocation {
                    source: 0,
                    original_line: 0,
                    original_column: 1,
                    name: None,
                }),
            },
        ]
    );
}

#[test]
fn test_all_generated_locations_for_column_fuzzy() {
    let mut mappings = parse_mappings::<()>(TEST_MAPPINGS_4).unwrap();

    let mappings_on_source_0_line_0_column_0: Vec<_> = mappings
        .all_generated_locations_for(0, 0, Some(0))
        .cloned()
        .collect();

    assert_eq!(
        mappings_on_source_0_line_0_column_0,
        vec![
            Mapping {
                generated_line: 0,
                generated_column: 2,
                last_generated_column: Some(3),
                original: Some(OriginalLocation {
                    source: 0,
                    original_line: 0,
                    original_column: 1,
                    name: None,
                }),
            },
            Mapping {
                generated_line: 0,
                generated_column: 3,
                last_generated_column: None,
                original: Some(OriginalLocation {
                    source: 0,
                    original_line: 0,
                    original_column: 1,
                    name: None,
                }),
            },
        ]
    );
}

// From mozilla/source-map's test/test-source-map-consumer.js's "test
// allGeneratedPositionsFor for column on different line fuzzy".
const TEST_MAPPINGS_5: &'static [u8] = b";EACC,CAAA";

#[test]
fn test_all_generated_locations_for_column_on_different_line_fuzzy() {
    let mut mappings = parse_mappings::<()>(TEST_MAPPINGS_5).unwrap();

    let mappings_on_source_0_line_0_column_0: Vec<_> = mappings
        .all_generated_locations_for(0, 0, Some(0))
        .cloned()
        .collect();

    assert!(mappings_on_source_0_line_0_column_0.is_empty());
}
