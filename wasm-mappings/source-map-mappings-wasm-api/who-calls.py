#!/usr/bin/env python3

import argparse
import re
import subprocess

DESC = """

List the callers of some function in the given `.wasm` file.

Constructs the call graph of functions in the `.wasm` file and then queries
edges in that call graph.

Requires that the `wasm-objdump` tool from the WABT[0] is installed and on the
`$PATH`.

[0]: https://github.com/WebAssembly/wabt

## Example Usage

Print every caller of `std::panicking::begin_panic`:

    $ ./who-calls.py path/to/something.wasm \\
         --function "std::panicking::begin_panic::h59c9bbae5c8cc295"

Print the top 5 largest functions and their callers:

    $ ./who-calls.py path/to/something.wasm --top

"""

parser = argparse.ArgumentParser(
    formatter_class=argparse.RawDescriptionHelpFormatter,
    description=DESC)

parser.add_argument(
    "wasm_file",
    type=str,
    help="The input `.wasm` file.")

parser.add_argument(
    "--function",
    type=str,
    help="The function whose callers should be listed.")

parser.add_argument(
    "-t",
    "--top",
    type=int,
    default=None,
    help="Display the largest N functions and their callers")

parser.add_argument(
    "-d",
    "--max-depth",
    type=int,
    default=None,
    help="The maximum call stack depth to display")

def decode(f):
    return f.decode(encoding="utf-8", errors="ignore")

def run(cmd, **kwargs):
    kwargs["stdout"] = subprocess.PIPE
    child = subprocess.run(cmd, **kwargs)
    if child.returncode != 0:
        raise Exception("{} did not exit OK".format(str(cmd)))
    return decode(child.stdout)

def disassemble(args):
    return run(["wasm-objdump", "-d", args.wasm_file])

START_FUNCTION = re.compile(r"^(\w+) <([\w<>:\s]+)>:$")
CALL_FUNCTION = re.compile(r"^ \w+: [\w ]*\|\s*call \w+ <([\w<>:\s]+)>$")

def parse_call_graph(disassembly, args):
    call_graph = {}
    current_function = None

    for line in disassembly.splitlines():
        match = re.match(START_FUNCTION, line)
        if match:
            current_function = match.groups()[1]
            call_graph[current_function] = set()
            continue

        match = re.match(CALL_FUNCTION, line)
        if match and current_function:
            call_graph[current_function].add(match.groups()[0])

    return call_graph

def parse_top_functions(disassembly, args):
    functions = []
    last_function = None

    for line in disassembly.splitlines():
        match = re.match(START_FUNCTION, line)
        if match:
            (start, function) = match.groups()
            start = int(start, 16)
            if last_function:
                (f, last_start) = last_function
                functions.append((f, start - last_start))
            last_function = (function, start)

    top_functions = sorted(functions, key=lambda a: a[1], reverse=True)
    return top_functions[:args.top]

def reverse_call_graph(call_graph, args):
    reversed_call_graph = {}

    for function, calls in call_graph.items():
        if function not in reversed_call_graph:
            reversed_call_graph[function] = set()

        for call in calls:
            if call not in reversed_call_graph:
                reversed_call_graph[call] = set()
            reversed_call_graph[call].add(function)

    return reversed_call_graph

def print_callers(reversed_call_graph, args, function=None, depth=0, seen=set()):
    if not function:
        function = args.function
    seen.add(function)

    if depth == 0:
        depth += 1
        print("{}".format(function))
        if function not in reversed_call_graph:
            print("    <function not defined>")
            return

    if args.max_depth is None or depth < args.max_depth:
        for caller in reversed_call_graph[function]:
            if caller in seen:
                continue

            indent = ""
            for _ in range(0, depth):
                indent += "    "

            print("{}⬑ {}".format(indent, caller))

            print_callers(reversed_call_graph, args, function=caller, depth=depth+1, seen=seen)

    seen.remove(function)

def main():
    args = parser.parse_args()
    disassembly = disassemble(args)
    call_graph = parse_call_graph(disassembly, args)
    reversed_call_graph = reverse_call_graph(call_graph, args)

    if args.function:
        print_callers(reversed_call_graph, args)
    elif args.top:
        top_functions = parse_top_functions(disassembly, args)
        for f, size in top_functions:
            print(size, "bytes: ", end="")
            print_callers(reversed_call_graph, args, function=f)
    else:
        raise Exception("Must use one of --function or --top")

if __name__ == "__main__":
    main()
