if test -f "analytics-tag.txt"; then
    ANALYTICS_TAG=$(cat "analytics-tag.txt")
    sed -i -e 's|<\/head>|'"$ANALYTICS_TAG"'</head>|' ./dist/client/index.html
fi
