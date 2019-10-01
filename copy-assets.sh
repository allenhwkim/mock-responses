rm -rf src/assets/normalize.css
cp node_modules/normalize.css/normalize.css src/assets

rm -rf src/assets/html-custom-elements.umd.js
cp node_modules/html-custom-elements/dist/html-custom-elements.umd.js src/assets

rm -rf src/assets/fontawesome-free
mkdir -p src/assets/fontawesome/css src/assets/fontawesome/webfonts
cp node_modules/\@fortawesome/fontawesome-free/css/* src/assets/fontawesome/css
cp node_modules/\@fortawesome/fontawesome-free/webfonts/* src/assets/fontawesome/webfonts

