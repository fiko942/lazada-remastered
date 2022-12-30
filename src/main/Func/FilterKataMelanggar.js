import fs from 'fs';
import GetKataMelanggar from './GetKataMelanggar';

var total_item = 0;
export default async function FilterKataMelanggar(
  global,
  collections,
  onSuccess
) {
  var total_collection = 0;
  var total_kata_melanggar = 0;

  try {
    var tasks = [];
    const badwords = GetKataMelanggar(global);
    total_kata_melanggar = badwords.length;
    for (var c = 0; c < collections.length; c++) {
      // * Loop per collection
      var collection_data = JSON.parse(
        fs.readFileSync(collections[c].path, 'utf-8')
      );
      tasks.push(
        filterSingleCollection(collection_data, badwords, collections[c].path)
      );
      total_collection++;
    }
    await Promise.all(tasks);
    return onSuccess(
      `${total_collection} collection berhasil difilter dengan jumlah item ${total_item} dan total kata melanggar ${total_kata_melanggar}.`
    );
  } catch (err) {
    return onSuccess(
      'Terjadi kesalahan saat melakukan filter data: ' + err.message
    );
  }
}

async function filterSingleCollection(collection_data, badwords, path) {
  for (var r = 0; r < collection_data.length; r++) {
    // * Loop per collection data row
    for (var b = 0; b < badwords.length; b++) {
      // * Loop per kata melanggar

      collection_data[r].title = collection_data[r].title.replacei(
        badwords[b],
        ''
      );
      collection_data[r].description = collection_data[r].description.replacei(
        badwords[b],
        ''
      );
    }
    total_item++;
  }
  return fs.writeFileSync(path, JSON.stringify(collection_data), 'utf-8');
}

String.replacei = String.prototype.replacei = function (rep, rby) {
  var pos = this.toLowerCase().indexOf(rep.toLowerCase());
  return pos == -1
    ? this
    : this.substr(0, pos) + rby + this.substr(pos + rep.length);
};
