rm -rf src/assets/developer/normalize.css
cp node_modules/normalize.css/normalize.css src/assets/developer

rm -rf src/assets/developer/html-custom-elements.umd.js
cp node_modules/html-custom-elements/dist/html-custom-elements.umd.js src/assets/developer

rm -rf src/assets/developer/fontawesome
mkdir -p src/assets/developer/fontawesome/css src/assets/developer/fontawesome/webfonts
cp node_modules/\@fortawesome/fontawesome-free/css/* src/assets/developer/fontawesome/css
cp node_modules/\@fortawesome/fontawesome-free/webfonts/* src/assets/developer/fontawesome/webfonts

