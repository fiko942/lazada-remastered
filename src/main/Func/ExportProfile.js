import { dialog } from 'electron';
import moment from 'moment-timezone';
import 'moment/locale/id';
import fs from 'fs';

export default async function ExportProfile(global, success, error) {
  try {
    const path = await dialog.showSaveDialog({
      defaultPath:
        'Profile ' +
        moment().tz('Asia/Jakarta').format('dddd, DD MMMM') +
        '.json',
    });
    if (path.canceled) {
      return error('Aksi dibatalkan oleh pengguna!');
    }

    const targetPath = path.filePath;
    var data = JSON.parse(
      fs.readFileSync(global.files.pengaturan_rumus, 'utf-8')
    );

    for (var i = 0; i < data.length; i++) {
      data[i].default = false;
    }
    fs.writeFileSync(targetPath, JSON.stringify(data), 'utf-8');
    return success(`${data.length} profile berhasil diexport`);
  } catch (err) {
    return error(`Terjadi kesalahan saat export profile: ${err.message}`);
  }
}
