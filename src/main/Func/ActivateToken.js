import axios from 'axios';
import { machineIdSync } from 'node-machine-id';
import FormData from 'form-data';

export default async function ({ global, token, error, success }) {
  const formData = new FormData();
  formData.append('product', global.productName);
  formData.append('machine_id', machineIdSync({ original: true }));
  formData.append('token', token);

  return axios
    .post(global.api.base + 'device/activation', formData, {
      headers: formData.getHeaders(),
    })
    .then((response) => {
      if (response.data.tobelsoft.error) {
        return error(response.data.tobelsoft.message);
      } else {
        return success(
          'Perangkat anda berhasil diaktivasi, silahkan tekan ok untuk melanjutkan'
        );
      }
    })
    .catch((err) => {
      return error(`Terjadi kesalahan: ERR_${err.status}, ${err.message}.`);
    });
}
