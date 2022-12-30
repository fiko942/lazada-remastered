import fs from 'fs';

export default function GetShuffleData(global, onErr) {
  try {
    const data = JSON.parse(
      fs.readFileSync(global.files.pengaturan_shuffle, 'utf-8')
    );
    return data;
  } catch (err) {
    onErr('Terjadi kesalahan saat memuat data shuffle: ' + err.message);
  }
}
