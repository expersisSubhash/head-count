#!/bin/sh

# export file path
source local_constants.sh
export PATH

#CRON_FILE_TO_RUN to be assigned by the cron script which has to be executed

# Execute script
python ../cron_main.py $CRON_FILE_TO_RUN
