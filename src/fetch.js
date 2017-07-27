const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');

const git = simpleGit('');

function fetch() {
  return new Promise((resolve, reject) => {
    if(!fs.existsSync('content')) {
      git.clone('https://github.com/MalekaiProject/crowfall-images', './content', null, () => resolve());
    } else {
      git.cwd('./content').pull(() => resolve());
    }
  });
}

module.exports = {
  fetch: fetch
}

fetch().then(d => { console.log('Done fetching!'); process.exit(); }).catch(e => console.error(e));
