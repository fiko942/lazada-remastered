import fs from 'fs';
export default async function GetCollectionData(path, callback = () => {}) {
  return fs.readFile(path, 'utf-8', (err, result) => {
    if (err) throw new Error(err);
    return callback(JSON.parse(result));
  });
}
