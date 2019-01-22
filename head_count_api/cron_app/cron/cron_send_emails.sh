#!/bin/sh

BASEDIR=$(dirname "$0")
cd $BASEDIR

CRON_FILE_TO_RUN=1
source cron_main.sh

