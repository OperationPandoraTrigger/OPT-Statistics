#!/bin/bash

for f in teamblau/*.svg; do
    basename=`basename $f .svg`
    echo Resizing $f ...
    magick montage -background transparent teamblau/${basename}.svg -geometry +0 -trim -resize x400 -gravity southwest -extent x420 resized/schulterklappen/${basename}.png
done

for f in orden/*.svg; do
    basename=`basename $f .svg`
    echo Resizing $f ...
    magick montage -background transparent orden/${basename}.svg -geometry +0 -trim -resize x300 -gravity southwest -extent x320 resized/orden/${basename}.png
done

