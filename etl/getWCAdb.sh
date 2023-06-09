#!/bin/bash

# Download and extract the latest WCA database
wget -O ~/Downloads/WCA_export.sql.zip https://www.worldcubeassociation.org/results/misc/WCA_export.sql.zip
unzip -o ~/Downloads/WCA_export.sql.zip -d ~/WCADatabase/

# Copy the database to the docker container
docker cp ~/WCADatabase/WCA_export.sql cubingza-website-wca-database-1:/tmp/WCA_export.sql

# Import the database into the docker container
docker exec cubingza-website-wca-database-1 sh -c 'mysql --user=wca --password=wca wca < /tmp/WCA_export.sql'



