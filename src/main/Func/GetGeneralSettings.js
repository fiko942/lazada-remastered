import fs from 'fs';

export default function GetGeneralSettings(global) {
  return JSON.parse(fs.readFileSync(global.files.pengaturan_general, 'utf-8'));
}
