#!/bin/sh
#rm -rf ../www-built
#node r.js -o build.js

# Build the docs
node r.js -o docs.build.js
cd ..
docco docs/aura.js


