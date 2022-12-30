import fs from 'fs';
export default function DeleteRumusProfile(global, profileName, callback) {
  if (profileName == 'Profil baru') {
    return callback('Profil tidak dapat dihapus');
  }
  var profile = JSON.parse(
    fs.readFileSync(global.files.pengaturan_rumus, 'utf-8')
  );
  const i = profile.findIndex((x) => x.profileName == profileName);
  if (i < 0) {
    return callback('Profil tidak ditemukan');
  }

  profile.splice(i, 1);
  try {
    fs.writeFileSync(
      global.files.pengaturan_rumus,
      JSON.stringify(profile),
      'utf-8'
    );
    callback(`Profil ${profileName} berhasil dihapus`);
  } catch (err) {
    callback('Terjadi kesalahan saat menghapus profile: ' + err.message);
  }
}
