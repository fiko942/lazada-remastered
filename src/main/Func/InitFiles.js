import fs from 'fs';

export default function InitFiles(global) {
  // Initializing directories
  try {
    for (var dir of Object.values(global.dirs)) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
    }
  } catch (err) {
    console.log(`Terjadi kesalahan saat menginisialisasi direktori: ${err}`);
  }
  // * Initializing file pengaturan shuffle
  try {
    if (!fs.existsSync(global.dirs.tmp)) {
      fs.mkdirSync(global.dirs.tmp.splice(-1, 1));
    }
  } catch (err) {
    console.error(`Terjadi kesalahan saat menginisialisasi file: ${err}`);
  }
  // * Initializing files
  try {
    if (!fs.existsSync(global.files.collection_list)) {
      fs.writeFileSync(global.files.collection_list, '[]', 'utf-8');
    }
  } catch (err) {
    console.error(`Terjadi kesalahan saat menginisialisasi file: ${err}`);
  }

  // * Initializing file pengaturan rumus
  try {
    if (!fs.existsSync(global.files.pengaturan_rumus)) {
      fs.writeFileSync(global.files.pengaturan_rumus, '[]', 'utf-8');
    }
  } catch (err) {
    console.error(`Terjadi kesalahan saat menginisialisasi file: ${err}`);
  }

  // * Initializing file pengaturan shuffle
  try {
    if (!fs.existsSync(global.files.pengaturan_shuffle)) {
      const data = {
        start_title: [],
        start_desc: '',
        end_desc: '',
      };
      fs.writeFileSync(
        global.files.pengaturan_shuffle,
        JSON.stringify(data),
        'utf-8'
      );
    }
  } catch (err) {
    console.error(`Terjadi kesalahan saat menginisialisasi file: ${err}`);
  }

  // * Initializing file pengaturan shuffle
  try {
    if (!fs.existsSync(global.files.pengaturan_kata_melanggar)) {
      const data = {
        start_title: [],
        start_desc: '',
        end_desc: '',
      };
      fs.writeFileSync(
        global.files.pengaturan_kata_melanggar,
        JSON.stringify(data),
        'utf-8'
      );
    }
  } catch (err) {
    console.error(`Terjadi kesalahan saat menginisialisasi file: ${err}`);
  }

  // * Initializing file pengaturan shuffle
  try {
    if (!fs.existsSync(global.files.pengaturan_general)) {
      const data = {
        split_file: false,
        random_image: false,
      };
      fs.writeFileSync(
        global.files.pengaturan_general,
        JSON.stringify(data),
        'utf-8'
      );
    }
  } catch (err) {
    console.error(`Terjadi kesalahan saat menginisialisasi file: ${err}`);
  }

  // * Initializing file pengaturan shuffle
  try {
    if (!fs.existsSync(global.current_color)) {
      fs.writeFileSync(global.current_color, '#FE5722', 'utf-8');
    }
  } catch (err) {
    console.error(`Terjadi kesalahan saat menginisialisasi file: ${err}`);
  }

  // * Initializing file pengaturan shuffle
  try {
    if (!fs.existsSync(global.main_session)) {
      fs.writeFileSync(global.main_session, '[]', 'utf-8');
    }
  } catch (err) {
    console.error(`Terjadi kesalahan saat menginisialisasi file: ${err}`);
  }

  return 1;
}
