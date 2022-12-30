import FormData from 'form-data';
import axios from 'axios';
import fs from 'fs';
import { machineIdSync } from 'node-machine-id';

export default async function ({ global, onSuccess, onError }) {
  const formData = new FormData();
  const MACHINE_ID = machineIdSync({ original: true });
  formData.append('machine_id', MACHINE_ID);
  formData.append('product', global.productName);
  return axios
    .post(global.api.base + `device/status`, formData)
    .then((response) => {
      response.data.MACHINE_ID = MACHINE_ID;
      onSuccess(response.data);
    })
    .catch((err) =>
      onError(`Terjadi kesalahan: ERR_${err.status}, ${err.message}.`)
    );
}
