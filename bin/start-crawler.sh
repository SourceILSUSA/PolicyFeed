#!/bin/sh

MEM=160m

ROOT_DIR=$(dirname $(cd $(dirname "$0"); pwd););

LIB_DIR="$ROOT_DIR/lib";
CONFIG_DIR="$ROOT_DIR/config";
MODULES_DIR="$ROOT_DIR/modules";

# set monitor mode for resuming java job from background
#set -o monitor

java \
    "-Xms$MEM" "-Xmx$MEM" \
    -Dringo.classpath="./**"\
    -jar "$LIB_DIR/run.jar"\
    -D ringo.home="$LIB_DIR/ringo.jar"\
    -e "require.paths.push('$CONFIG_DIR')"\
    -i "$MODULES_DIR/start-crawler.js"

# save pid of java process:
echo $! > "$ROOT_DIR/data/crawler.pid"

# bring java process to foreground:
# fg
