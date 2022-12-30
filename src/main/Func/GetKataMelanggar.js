import fs from 'fs';

export default function GetKataMelanggar(global) {
  return JSON.parse(
    fs.readFileSync(global.files.pengaturan_kata_melanggar, 'utf-8')
  );
}
