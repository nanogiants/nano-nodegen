#!/bin/bash

TEMPLATE_PATHS=$(find src -type d -regex '.*/*/templates')
REGEX="src\/([a-z]+)\/templates"

echo "copying assets from src to generator..."

for OUTPUT in $TEMPLATE_PATHS
do
    if [[ $OUTPUT =~ $REGEX ]]; then
        FOLDER=${BASH_REMATCH[1]}
        cp -r ./src/$FOLDER/templates generators/$FOLDER/templates
    fi
done

echo "done copying assets from src to generator"

