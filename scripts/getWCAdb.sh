#!/bin/bash

wget -O ~/Downloads/WCA_export.sql.zip https://www.worldcubeassociation.org/results/misc/WCA_export.sql.zip
unzip -o ~/Downloads/WCA_export.sql.zip -d ~/WCADatabase/
mysql --port=4204 --user=wca -password=wca wca < ~/WCADatabase/WCA_export.sql

