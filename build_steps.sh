#!/bin/bash
npm install
cd bloglist-frontend && npm install && npm run build && cp -r build ../