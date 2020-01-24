#!/usr/bin/env node
/*
 * Usage: autorunner.js ~/path/to/entry_point.js
 *
 * It will run `node entry_point.js` anytime a file is modified in
 * the entry point's directory
 *
 */

const fs = require('fs');
const {exec} = require('child_process');

const executable = process.argv[2];
const watchDir = executable.match(/^(.*)\/[^\/]+$/)[1];

let lastModifiedTime;

fs.watch(watchDir, eventType => {
  if (eventType === 'change') {
    lastModified(executable)
      .then(time => {
        if (time !== lastModifiedTime) {
          lastModifiedTime = time;
          exec(`node ${executable}`, (err, stdout, stderr) => {
            console.log([err, stdout, stderr]
              .filter(cur => cur)
              .join('\n\n')
              .trim()
            );
          }); 
        }
      }).catch(err => console.log(err));
  }
});

function lastModified(filePath){
  return new Promise(resolve => {
    const interval = setInterval(() => {
      fs.promises.stat(filePath)
        .then(stats => {
          clearInterval(interval);
          resolve(stats.mtimeMs);
        }, err => null);
    }, 10);
  });
}


