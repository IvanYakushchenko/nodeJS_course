const fs = require('fs');
const path = require('path');
const dbPath = path.resolve(__dirname, '../database.json');

exports.read = () => {
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, '[]');
  return JSON.parse(fs.readFileSync(dbPath));
};

exports.write = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};