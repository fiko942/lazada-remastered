import { SingleMarkupHarga } from './MarkupHarga';
import { dialog } from 'electron';
import GetDefaultProfile from './GetDefaultProfile';

export default async function getPerkiraanHargaOutput({ data, global }) {
  const profile = await GetDefaultProfile(global);
  if (!profile) {
    dialog.showMessageBoxSync({
      title: 'Application Error',
      message:
        'Silahkan pilih profil default terlebih dahulu, data tidak akan ditampilkan jika anda belum memiliki profil default',
      icon: 'warning',
      type: 'warning',
    });
    return [];
  } else {
    let tmp = [];
    for (var row of data) {
      let d = row;
      d.perkiraan_harga = SingleMarkupHarga(row, profile[0]).price;
      tmp.push(d);
    }
    console.log('Data: ', tmp[0]);
    return tmp;
  }
}
