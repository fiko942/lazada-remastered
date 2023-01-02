import fs from 'fs';
import getPerkiraanHargaOutput from './GetPerkiraanHarga';

export default async function GetCollectionData(
  path,
  global,
  callback = () => {}
) {
  return fs.readFile(path, 'utf-8', async (err, result) => {
    if (err) throw new Error(err);
    const res = await getPerkiraanHargaOutput({
      data: JSON.parse(result),
      global,
    });
    return callback(res);
  });
}
