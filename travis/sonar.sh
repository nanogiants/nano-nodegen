#!/bin/bash

PACKAGE_VERSION=$(node -p "require('./package.json').version")

sonar-scanner -X \
  -D sonar.projectVersion=$PACKAGE_VERSION \
  -D sonar.branch.name=$TRAVIS_BRANCH
  -D sonar.host.url=$SONAR_HOST_URL \
  -D sonar.login=$SONAR_TOKEN \

