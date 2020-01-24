#!/usr/bin/env node
/*
 * Accept a file name to watch
 *
 * Check last-modified timestamp for changes in loop
 *
 * On change, execute file
 *
 */
const fs = require('fs');
const {exec} = require('child_process');

const watchFilePath = process.argv[2] || 'main.js';

let lastMod;
setInterval(() => {
  lastModified(watchFilePath, (newLastMod) => {
    if(newLastMod !== lastMod){
      lastMod = newLastMod;
      run(watchFilePath);
    }  
  });
}, 50);

function lastModified(filePath, callback){
  const interval = setInterval(() => {
    fs.stat(filePath, (err, stats) => {
      if(stats){
        clearInterval(interval);
        callback(stats.mtimeMs);
      }
    });
  }, 10);
}

function run(filePath){
  exec(`node ${filePath}`, (err, stdout, stderr) => {
    console.log([err, stdout, stderr]
      .filter(cur => cur)
      .join('\n\n')
      .trim()
    );
  });
}



