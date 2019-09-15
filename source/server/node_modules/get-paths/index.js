const path = require('path');
const fs = require('fs');
const Promise = require('bluebird');

const stat = Promise.promisify(fs.stat);

function getPaths(abs, rel, ext) {
  return stat(path.join(abs, rel))
    .then(stats => {
      if (stats.isDirectory()) {
        // a directory
        return {
          rel: path.join(rel, `index.${ext}`),
          ext
        };
      }
      // a file
      return { rel, ext: path.extname(rel).slice(1) };
    })
    .catch(err => {
      // not a valid file/directory
      if (!path.extname(rel) || path.extname(rel).slice(1) !== ext) {
        // Template file has been provided without the right extension
        // so append to it to try another lookup
        return getPaths(abs, `${rel}.${ext}`, ext);
      }
      throw err;
    });
}

module.exports = getPaths;
