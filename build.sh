#!/usr/bin/env bash

mkdir www
npm install
cd src/webapp/weather-genie-app/
npm install
ng build

yes | cp -rf dist/* ../../../www