import { TextField, Button, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';

export default function KataMelanggar() {
  const [kataMelanggar, setKataMelangar] = useState('');
  const handleChangeKataMelanggar = (e) => setKataMelangar(e.target.value);
  const handleSaveKataMelanggar = () => {
    window.electron.ipcRenderer.sendMessage(
      'simpan kata melanggar',
      kataMelanggar
    );
  };

  useEffect(() => {
    window.electron.ipcRenderer.once('kata melanggar', (km) =>
      setKataMelangar(km.join('\n'))
    );
    window.electron.ipcRenderer.sendMessage('get kata melanggar');
  }, []);

  return (
    <div className="kata-melanggar">
      <TextField
        variant="outlined"
        multiline={true}
        minRows={5}
        maxRows={20}
        className="field"
        label="Kata melanggar"
        helperText="Pisahkan kata melanggar dengan baris baru"
        value={kataMelanggar}
        onChange={handleChangeKataMelanggar.bind(this)}
      />
      <Button
        className="btn-save"
        variant="contained"
        startIcon={<SaveIcon />}
        onClick={handleSaveKataMelanggar.bind(this)}
      >
        Simpan
      </Button>
    </div>
  );
}
