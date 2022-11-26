#!/bin/bash

# create temp
mkdir dist/diuasdasbdiuasydiaus-temp

# Copy old version
cp -r dist/previous/* dist/diuasdasbdiuasydiaus-temp

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

# create prod
mkdir dist/prod
echo "Prod created"

# Copy over App From Temp
cp -r dist/diuasdasbdiuasydiaus-temp/* dist/prod
echo "App stored in prod"

# clear temp
rm -rf dist/diuasdasbdiuasydiaus-temp
echo "Temp removed"

# Sync with folder
aws s3 sync ./dist/prod s3://tictactoe.lilithsgames.com
echo "App Deployed to S3"