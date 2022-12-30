import fs from 'fs';

export default function SaveShuffle(global, data, callback) {
  try {
    fs.writeFileSync(
      global.files.pengaturan_shuffle,
      JSON.stringify(data),
      'utf-8'
    );
    callback('Shuffle berhasil disimpan');
  } catch (err) {
    callback(`Terjadi kesalahan: ${err.message}`);
  }
}
