#!/bin/sh -x


for dataFile in $@; do
	TMP=`mktemp`
	mtime=`stat -c '%Y' $dataFile`
	sha=`sha256sum $dataFile | cut -d\  -f1`
	jq "(.timestamp |= (now|todate)) \
	    | (.datafiles[] | select(.filename==\"${dataFile}\")) \
	    |= (.timestamp |= (${mtime}|todate) | .sha256|= \"${sha}\")" \
		manifest.json > ${TMP}
	mv ${TMP} manifest.json
done

#	    | (.datafiles[] | select(.version==\"4.3\")) \
