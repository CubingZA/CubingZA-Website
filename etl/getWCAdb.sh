#!/bin/bash

# Prepare a temporary directory
TMPFOLDER=/tmp/wca-database
mkdir -p $TMPFOLDER

# Download and extract the latest WCA database
wget -O $TMPFOLDER/WCA_export.sql.zip https://www.worldcubeassociation.org/export/results/WCA_export.sql.zip
unzip -o $TMPFOLDER/WCA_export.sql.zip -d $TMPFOLDER

# Copy the database to the docker container
docker cp $TMPFOLDER/WCA_export.sql cubingza-website-wca-database-1:/tmp/WCA_export.sql

# Import the database into the docker container
docker exec cubingza-website-wca-database-1 sh -c 'mysql --user=wca --password=wca wca < /tmp/WCA_export.sql'
