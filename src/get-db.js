const path = require('path');
const sqlite3 = require('better-sqlite3');
const glob = require('glob');

let dbFile = glob.sync('{,!(node_modules|dist|coverage)**/}mock-responses.sqlite3')[0];
console.log('dbFile', dbFile);
let mockResponsesDBPath = path.join(process.cwd(), dbFile);
console.info('mock-responses is using sqlite3 db', mockResponsesDBPath);

module.exports = {
  get path() {
    return mockResponsesDBPath;
  },
  get sqlite3() {
    return new sqlite3(this.path);
  }
}
