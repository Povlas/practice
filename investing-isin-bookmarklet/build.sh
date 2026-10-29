#!/bin/sh
# Turns isin-bookmarklet.js into a single javascript: line (bookmarklet.txt).
cd "$(dirname "$0")"
node -e '
const src = require("fs").readFileSync("isin-bookmarklet.js", "utf8")
  .split("\n").filter(l => !/^\s*\/\//.test(l))
  .map(l => l.trim()).join(" ")
  .replace(/\s*\/\/[^"\x27]*$/gm, "");
process.stdout.write("javascript:" + encodeURIComponent(src).replace(/%20/g, " ") + "\n");
' > bookmarklet.txt
