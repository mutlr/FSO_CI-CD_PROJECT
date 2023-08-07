#!/bin/bash
npm install
cd bloglist-frontend && npm install && npm run build && cd .. && cp -r bloglist-frontend/build/* .