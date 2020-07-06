#!/bin/bash

echo $(command -v sonar-scanner)
if [[ $(command -v sonar-scanner) ]]
then echo "sonar-scanner already installed..."
else 
echo "Installing sonar-scanner globally"
npm i -g sonar-scanner
fi

while getopts ":k:" opt; do
  case $opt in
    k) key="$OPTARG"
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
    ;;
  esac
done

echo "$key"

sonar-scanner \
  -D sonar.host.url=http://localhost:9000 \
  -D sonar.login=$key