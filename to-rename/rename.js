// Node.js program to demonstrate the    
// fs.rename() method 
     
// Import filesystem module
const fs = require('fs');
   
// List all the filenames before renaming
const files = fs.readdirSync(__dirname)

files.filter(name => {
  if (name.startsWith('stage-')) return false
  if (!name.includes('stage-')) return false
  return true
}).forEach(name => {
  const stage = name.split('stage-')[1]
  fs.renameSync(__dirname + '/' + name, __dirname + '/stage-' + stage)
})