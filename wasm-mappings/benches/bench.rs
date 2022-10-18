#![feature(test)]

extern crate source_map_mappings;
extern crate test;

static FIXTURE: &'static [u8] = include_bytes!("./part-of-scala-js-source-map");

#[bench]
fn bench_parse_part_of_scala_js_source_map(b: &mut test::Bencher) {
    b.iter(|| {
        let mut mappings = source_map_mappings::parse_mappings::<()>(FIXTURE).unwrap();
        test::black_box(
            mappings
                .all_generated_locations_for(7, 2, None)
                .count(),
        );
    });
}
