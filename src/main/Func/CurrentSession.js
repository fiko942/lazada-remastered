import fs from 'fs';

export default async function ({ global, callback }) {
  const SESS_PATH = global.files.session;
  const SESS = JSON.parse(fs.readFileSync(SESS_PATH, 'utf-8'));
  return callback(SESS);
}
