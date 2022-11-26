#!/bin/bash

# clear previous
rm -rf dist/previous
echo "Previous removed"

# create previous
mkdir dist/previous
echo "Previous created"

# Store previous build for rollback
cp -r dist/prod/* dist/previous
echo "Previous stored"

# Previous App cleaned
rm -rf dist/prod/*
echo "Previous App cleaned"

# Build out application
npm run build
echo "App built"

# Sync with folder
aws s3 sync ./dist/prod s3://tictactoe.lilithsgames.com
echo "App Deployed to S3"