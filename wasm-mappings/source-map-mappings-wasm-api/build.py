#!/usr/bin/env python3

import argparse
import os
import re
import subprocess
import sys

DESC = """

Build, trim, and optimize the `.wasm` file for inclusion in the
`mozilla/source-map` library.

Requires:

- wasm-nm: https://github.com/fitzgen/wasm-nm
- wasm-gc: https://github.com/alexcrichton/wasm-gc
- wasm-snip: https://github.com/fitzgen/wasm-snip
- wasm-opt: https://github.com/WebAssembly/binaryen

"""

parser = argparse.ArgumentParser(
    formatter_class=argparse.RawDescriptionHelpFormatter,
    description=DESC)

parser.add_argument(
    "-g",
    "--debug",
    action="store_true",
    help="Include debug info (the \"name\" section) in the final `.wasm` file.")

parser.add_argument(
    "-p",
    "--profiling",
    action="store_true",
    help="Enable the `profiling` cargo feature.")

parser.add_argument(
    "-o",
    "--output",
    type=str,
    default=None,
    help="The path to write the output `.wasm` file to. If not supplied, the `.wasm` file is written to `stdout`.")

parser.add_argument(
    "--no-wasm-opt",
    dest="wasm_opt",
    action="store_false",
    help="Do not run `wasm-opt`.")

parser.add_argument(
    "--no-wasm-gc",
    dest="wasm_gc",
    action="store_false",
    help="Do not run `wasm-gc`.")

parser.add_argument(
    "--no-wasm-snip",
    dest="wasm_snip",
    action="store_false",
    help="Do not run `wasm-snip`.")

def decode(f):
    return f.decode(encoding="utf-8", errors="ignore")

def run(cmd, **kwargs):
    sys.stderr.write(str(cmd) + "\n")

    if "stdout" not in kwargs:
        kwargs["stdout"] = subprocess.PIPE
    child = subprocess.run(cmd, **kwargs)
    if child.returncode != 0:
        raise Exception("{} did not exit OK".format(str(cmd)))
    return decode(child.stdout)

def add_path_ext_prefix(path, prefix):
    (root, ext) = os.path.splitext(path)
    return root + "." + prefix + ext

def build(args):
    cmd = ["cargo", "build", "--release", "--target", "wasm32-unknown-unknown"]
    if args.profiling:
        cmd.extend(["--features", "profiling"])
    run(cmd)
    return "./target/wasm32-unknown-unknown/release/source_map_mappings_wasm_api.wasm"

def wasm_gc(args, wasm_path):
    if not args.wasm_gc:
        return wasm_path

    out_path = add_path_ext_prefix(wasm_path, "gc")
    run(["wasm-gc", wasm_path, out_path])
    return out_path

SHOULD_SNIP = [
    re.compile(r".*(std|core)(9|::)panicking.*"),
    re.compile(r".*(std|core)(3|::)fmt.*"),
    re.compile(r".*core(6|::)option(13|::)expect_failed.*"),
    re.compile(r".*core(5|::)slice(\d+|::)slice_index_.*_fail.*"),
    re.compile(r".*core(3|::)str(\d+|::)slice_.*_fail.*"),
    re.compile(r".*core(6|::)result(13|::)unwrap_failed.*"),
    re.compile(r".*std(6|::)thread(5|::)local.*"),
    re.compile(r".*std(2|::)io(5|::).*"),
    re.compile(r"__.*2"),
    re.compile(r".*(std|core)(5|::)error.*"),
    re.compile(r".*(std|core)(3|::)any(3|::)Any.*"),
]

def wasm_snip(args, wasm_path):
    if not args.wasm_snip:
        return wasm_path

    out_path = add_path_ext_prefix(wasm_path, "snip")

    private_functions = run(["wasm-nm", "-j", wasm_path]).splitlines()

    snip_functions = set()
    for snip in SHOULD_SNIP:
        snip_functions.update(filter(lambda f: re.match(snip, f),
                                     private_functions))

    run(["wasm-snip", "-o", out_path, wasm_path, *snip_functions]),
    return out_path

def wasm_opt(args, wasm_path):
    if not args.wasm_opt:
        return wasm_path

    out_path = add_path_ext_prefix(wasm_path, "opt")

    cmd = [
        "wasm-opt",
        "-O3",
        "-Oz",
        "--duplicate-function-elimination",
        "-o", out_path,
        wasm_path
    ]
    if args.debug:
        cmd.append("-g")
    run(cmd)
    return out_path

def main():
    args = parser.parse_args()
    os.chdir(os.path.dirname(sys.argv[0]))

    wasm_path = build(args)
    wasm_path = wasm_gc(args, wasm_path)
    wasm_path = wasm_snip(args, wasm_path)
    # GC again after snipping.
    wasm_path = wasm_gc(args, wasm_path)
    wasm_path = wasm_opt(args, wasm_path)

    if args.output:
        run(["cp", wasm_path, args.output])
    else:
        run(["cat", wasm_path], stdout=subprocess.STDOUT)

if __name__ == "__main__":
    main()
