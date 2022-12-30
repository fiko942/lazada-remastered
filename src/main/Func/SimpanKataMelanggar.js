import fs from 'fs';

export default function KataMelanggar(global, tx, callback) {
  try {
    const txpath = global.files.pengaturan_kata_melanggar;
    fs.writeFileSync(txpath, JSON.stringify(tx.split('\n')), 'utf-8');
    return callback('Kata melanggar berhasil disimpan');
  } catch (err) {
    return callback(
      'Terjadi kesalahan saat menyimpan kata melanggar: ' + err.message
    );
  }
}
