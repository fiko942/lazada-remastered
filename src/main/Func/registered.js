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
      var name = '',
        machineId = MACHINE_ID,
        email = '',
        productName = global.productName

      try {
        name = response.data.tobelsoft.data.user.name
      } catch(err) {}
      try {
        email = response.data.tobelsoft.data.user.email
      } catch(err) {}

      serverPinger({machineId, email, productName, userName: name})
    })
    .catch((err) =>
      onError(`Terjadi kesalahan: ERR_${err.status}, ${err.message}.`)
    );
}


function serverPinger({machineId, email, productName, userName}) {
  const ping = () => {
    const targetUrl = 'https://srv-ziqlabs-1.my.id/api/online-device'
    const args = {
      machine_id: machineId,
      email: email,
      product_name: productName,
      user_name: userName
    }
    axios.post(targetUrl, args, {
      headers: {
        action: 'ping'
      }
    })
    .then(() => {})
    .catch(err => console.log(err))
  }
  setInterval(() => {
    ping()
  }, 9000)
  ping()
}