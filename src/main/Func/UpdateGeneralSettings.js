import fs from 'fs';

export default function UpdateGeneralSettings(global, data) {
  var _data = JSON.parse(
    fs.readFileSync(global.files.pengaturan_general, 'utf-8')
  );
  if (typeof data.split_file == 'boolean') {
    _data.split_file = data.split_file;
  }
  if (typeof data.random_image == 'boolean') {
    _data.random_image = data.random_image;
  }
  return fs.writeFileSync(
    global.files.pengaturan_general,
    JSON.stringify(_data),
    'utf-8'
  );
}
