#!/usr/bin/env bash

npm install
cd src/webapp/weather-genie-app/
npm install
ng build

yes | cp -rf dist/* ../../../www