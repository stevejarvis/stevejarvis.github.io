#!/bin/bash

# Normal working situation is the dev version is acive.
mv _config.yml _config.yml.dev
mv _config.yml.prod _config.yml

jekyll build

mv _config.yml _config.yml.prod
mv _config.yml.dev _config.yml
