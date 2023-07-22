#!/bin/bash

      - name: Install dependencies backend
        working-directory: ./
        run: npm install
      - name: Check style backend
        working-directory: ./       
        run: npm run eslint
      - name: Test backend
        run: npm run test