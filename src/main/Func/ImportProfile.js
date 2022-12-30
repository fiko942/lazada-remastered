import fs from 'fs';
import moment from 'moment-timezone';
import { dialog } from 'electron';
import 'moment/locale/id';

export default async function ImportProfile(global, success, error) {
  try {
    const filepath = await dialog.showOpenDialog({
      filters: [{ name: 'JSON', extensions: ['json'] }],
    });

    if (filepath.canceled) {
      return error('Aksi dibatalkan oleh pengguna!');
    }

    const filePath = filepath.filePaths[0];
    var data = JSON.parse(
      fs.readFileSync(global.files.pengaturan_rumus, 'utf-8')
    );

    const newData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    // bersihkan data baru dari default profile
    for (var i = 0; i < newData.length; i++) {
      newData[i].default = false;
    }
    data = [...data, ...newData];
    fs.writeFileSync(
      global.files.pengaturan_rumus,
      JSON.stringify(data),
      'utf-8'
    );
    return success(
      `${newData.length} profile data telah berhasil ditambahkan!`
    );
  } catch (err) {
    return error(`Terjadi kesalahan saat menambahkan profile: ${err.message}`);
  }
}
