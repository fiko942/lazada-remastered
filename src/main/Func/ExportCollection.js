import fs from 'fs';
import Downloader from 'nodejs-file-downloader';
import { dialog } from 'electron';
import GetDefaultProfile from './GetDefaultProfile';
import MarkupHarga from './MarkupHarga';
import GetGeneralSettings from './GetGeneralSettings';
import GetShuffleData from './GetShuffleData';
import Distribute from './Distribute';
import Shuffle from './Shuffle';

import exceljs from 'exceljs';

export default async function ExportCollection({
  global,
  collections,
  onLog,
  onError,
  onSuccess,
  custom_template,
}) {
  // * Download the template
  await downloadTemplate(global);
  console.log('Custom template: ', custom_template);
  const templatePath = custom_template
    ? global.files.template_tokped
    : (
        await dialog.showOpenDialogSync({
          title: 'Pilih templat tokopedia',
          filters: [
            {
              extensions: ['xlsx'],
            },
          ],
        })
      )[0];

  if (typeof templatePath != 'string') {
    return 0;
  }

  const profile = GetDefaultProfile(global);
  if (profile == undefined) {
    return onError('Silahkan pilih profil default terlebih dahulu!');
  }

  var rows_collections_merged = [];
  // * Penggabungan data collections
  for (let c = 0; c < collections.length; c++) {
    const single_data_collection = JSON.parse(
      fs.readFileSync(collections[c].path, 'utf-8')
    );
    rows_collections_merged.push(...single_data_collection);
  }
  // ! Penggabungan data collections

  // * Markup harga
  rows_collections_merged = MarkupHarga(rows_collections_merged, profile[0]);

  // * Convert kedalam xlsx file
  const shuffleData = GetShuffleData(global, (msg) => onError(msg));
  const generalData = GetGeneralSettings(global);

  // * Random image jika bernilai true
  if (generalData.random_image) {
    for (var i = 0; i < rows_collections_merged; i++) {
      rows_collections_merged[i].images = Shuffle(
        rows_collections_merged[i].images
      );
    }
  }
  // ! Random image jika bernilai true

  console.log('Profile: ', profile[0]);

  if (generalData.split_file) {
    // * Jika split file aktif
    var outputDir = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    });
    if (outputDir.canceled) {
      return onError('Aksi dibatalkan oleh pengguna!');
    }

    outputDir = outputDir.filePaths[0] + '\\';
    const splitted_data = rows_collections_merged.chunk(
      profile[0].split_perfile
    );
    for (var data of splitted_data) {
      // Splitted
      const i = splitted_data.indexOf(data) + 1;
      const targetPath =
        outputDir + collections[0].keywords[0] + '_' + i + '.xlsx';
      const workbook = new exceljs.Workbook();
      try {
        await workbook.xlsx.readFile(templatePath);
      } catch (err) {
        return onError(
          `Terjadi kesalahan saat export file: ${err.message}, silahkan edit tanpa menambahkan data ditemplate lalu simpan menggunakan libreoffice, wpsoffice atau msoffice 2017 kebawah lalu simpan dan ulangi lagi`
        );
      }
      const worksheet = await workbook.getWorksheet(
        'ISI Template Impor Produk'
      );
      for (var row of data) {
        row.images = row.images.map((x) => x.replace('._webp', ''));
        var generated_random_title =
          shuffleData.start_title[
            Math.floor(Math.random() * shuffleData.start_title.length)
          ];
        generated_random_title = generated_random_title
          ? generated_random_title + ' '
          : '';
        worksheet.addRow([
          '',
          capitalize(max(70, generated_random_title + row.title)),
          max(
            2000,
            shuffleData.start_desc +
              row.description.replace(/\s+/g, ' ').trim() +
              shuffleData.end_desc
          ),
          profile[0].defaultValue.categoryCode,
          profile[0].defaultValue.heavy,
          1,
          '',
          profile[0].defaultValue.preorder,
          'Baru',
          row.images[0] ? row.images[0] : '',
          row.images[1] ? row.images[1] : '',
          row.images[2] ? row.images[2] : '',
          row.images[3] ? row.images[3] : '',
          row.images[4] ? row.images[4] : '',
          '',
          '',
          '',
          'laz_' + row.sku,
          'Aktif',
          row.stock >= 1000 ? 99 : row.stock,
          row.price,
          profile[0].defaultValue.asurance,
        ]);
      }
      // * Simpan file dalam buffer
      fs.writeFile(targetPath, await workbook.xlsx.writeBuffer(), (err) => {
        if (err) {
          onError(err.message);
        }
      });
      // End of splitted
    }
    return onSuccess();
  } else {
    // * Jika tanpa split file
    // Minta folder untuk menyimpan file
    const outputDir = await dialog.showSaveDialogSync({
      title: 'Pilih folder untuk output file',
      defaultPath:
        collections[0].keywords[0] +
        ' - ' +
        rows_collections_merged.length +
        '.xlsx',
    });
    if (outputDir == undefined) {
      return onError('Aksi dibatalkan oleh pengguna!');
    }

    const workbook = new exceljs.Workbook();
    try {
      await workbook.xlsx.readFile(templatePath);
    } catch (err) {
      return onError(
        `Terjadi kesalahan saat export file: ${err.message}, silahkan edit tanpa menambahkan data ditemplate lalu simpan menggunakan libreoffice, wpsoffice atau msoffice 2017 kebawah lalu simpan dan ulangi lagi`
      );
    }
    const worksheet = await workbook.getWorksheet('ISI Template Impor Produk');
    for (var row of rows_collections_merged) {
      var generated_random_title =
        shuffleData.start_title[
          Math.floor(Math.random() * shuffleData.start_title.length)
        ];
      generated_random_title = generated_random_title
        ? generated_random_title + ' '
        : '';
      worksheet.addRow([
        '',
        capitalize(max(70, generated_random_title + row.title)),
        max(
          2000,
          shuffleData.start_desc +
            row.description.replace(/\s+/g, ' ').trim() +
            shuffleData.end_desc
        ),
        profile[0].defaultValue.categoryCode,
        profile[0].defaultValue.heavy,
        1,
        '',
        profile[0].defaultValue.preorder,
        'Baru',
        row.images[0] ? row.images[0] : '',
        row.images[1] ? row.images[1] : '',
        row.images[2] ? row.images[2] : '',
        row.images[3] ? row.images[3] : '',
        row.images[4] ? row.images[4] : '',
        '',
        '',
        '',
        'laz_' + row.id,
        'Aktif',
        row.stock >= 1000 ? 99 : row.stock,
        row.price,
        profile[0].defaultValue.asurance,
      ]);
    }
    // * Simpan file dalam buffer
    fs.writeFile(outputDir, await workbook.xlsx.writeBuffer(), (err) => {
      if (err) {
        onError(err.message);
      }
    });
    return onSuccess();
  }
}

async function downloadTemplate(global) {
  if (!fs.existsSync(global.files.template_tokped)) {
    const downloader = new Downloader({
      url: 'https://aliex.static.ziqva.com/file/template.xlsx',
      directory: 'C:\\com.ziqvakampungsongo\\ziqva-lazada-scrapper-remastered',
      fileName: global.files.template_tokped.split('\\').pop(),
    });
    downloader.download();
  }
  return;
}

function max(maxchars = 5, str) {
  if (str.length > maxchars) str = str.substring(0, maxchars);
  return str;
}

function capitalize(str) {
  var arr = str.split(' ');
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  return arr.join(' ');
}

Object.defineProperty(Array.prototype, 'chunk', {
  value: function (chunkSize) {
    var array = this;
    return [].concat.apply(
      [],
      array.map(function (elem, i) {
        return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
      })
    );
  },
});
