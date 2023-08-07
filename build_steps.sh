#!/bin/bash
npm install
rm -rf build
cd bloglist-frontend && npm install && npm run build && cp -r build ../