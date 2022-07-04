#!/bin/bash
for file in *.jpg; do
    guild=${file##GB-S4-}
    guild=${guild%%-??-??-??.jpg}
    mv $file $guild
done
