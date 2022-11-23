#!/bin/bash

# build deev
npm run build:dev:env

# sync
aws s3 sync ./dist/dev s3://dev.tictactoefun.com
