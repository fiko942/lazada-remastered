import fs from 'fs';
import moment from 'moment/timezone';
import 'moment/locale/id';

export default async function AddRumusProfile({
  data,
  onMessage,
  onSuccess,
  global,
}) {
  // *  Validate data
  console.log(data);

  //   * Validate profile name
  if (data.profileName.trim().length <= 3) {
    return onMessage('Masukkan nama lebih dari 3 karakter');
  }

  // * Validate rumus
  for (var r of data.rumus) {
    if (
      !parseInt(r.from) ||
      isNaN(r.from) ||
      !parseInt(r.to) ||
      isNaN(r.to) ||
      !parseInt(r.increase.range.from) ||
      isNaN(r.increase.range.from) ||
      !parseInt(r.increase.range.to) ||
      isNaN(r.increase.range.to)
    ) {
      return onMessage(
        'Ada rumus yang tidak valid! silahkan cek satu persatu apakah semua rumus sudah benar!'
      );
    }
  }

  // * Validasi harga tambahan
  if (!parseInt(data.additional_price) || isNaN(data.additional_price)) {
    return onMessage('Harga tambahan yang anda masukkan tidak valid!');
  }
  if (
    !parseInt(data.pembulatan) ||
    isNaN(data.pembulatan) ||
    data.pembulatan.length < 1
  ) {
    return onMessage('Pembulatan yang anda masukkan tidak valid!');
  }
  if (
    !parseInt(data.split_perfile) ||
    isNaN(data.split_perfile) ||
    data.split_perfile.length < 1
  ) {
    return onMessage('Split per file yang anda masukkan tidak valid!');
  }
  if (
    !parseInt(data.minstock) ||
    isNaN(data.minstock) ||
    data.minstock.length < 1
  ) {
    return onMessage('Minimal stock yang anda masukkan tidak valid!');
  }

  data.additional_price = parseInt(data.additional_price);
  data.pembulatan = parseInt(data.pembulatan);
  data.split_perfile = parseInt(data.split_perfile);
  data.minstock = parseInt(data.minstock);

  var profile = JSON.parse(
    fs.readFileSync(global.files.pengaturan_rumus, 'utf-8')
  );
  if (data.default) {
    // * Remove all default profile
    for (let i = 0; i < profile.length; i++) {
      profile[i].default = false;
    }
  }

  if (data.profileName.trim() == 'Profil baru') {
    return onMessage('Nama profil tidak dapat digunakan!');
  }

  // * jika profil yang dimaksud untuk menambahkan data
  data.profileName = data.profileName.trim();
  if (data.selectedProfile == 'Profil baru') {
    profile.push(data);
  } else {
    // * Update profile
    const i = profile.findIndex(
      (x) => x.profileName.trim() == data.selectedProfile.trim()
    );
    if (i >= 0) {
      profile[i] = data;
    } else {
      return onMessage('Terjadi kesalahan: Profil tidak ditemukan');
    }
  }

  // * Simpan data profile
  delete data.selectedProfile;

  try {
    fs.writeFileSync(
      global.files.pengaturan_rumus,
      JSON.stringify(profile),
      'utf-8'
    );
    onMessage('Rumus berhasil tersimpan');
    return onSuccess();
  } catch (err) {
    return onMessage('Terjadi kesalahan: ' + err.message);
  }
}
