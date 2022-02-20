#!/bin/bash

for f in teamblau/*.svg; do
    basename=`basename $f .svg`
    echo Resizing $f ...
    magick montage -background transparent teamblau/${basename}.svg -geometry +0 -trim -resize x500 resized/schulterklappen/${basename}.png
done

for f in orden/*.svg; do
    basename=`basename $f .svg`
    echo Resizing $f ...
    magick montage -background transparent orden/${basename}.svg -geometry +0 -trim -resize x360 resized/orden/${basename}.png
done

