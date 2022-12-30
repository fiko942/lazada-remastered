import { TextField, Button, IconButton, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';

export default function Shuffle() {
  const [awalTitle, setAwalTitle] = useState('');
  const [awalDeskripsi, setAwalDeskripsi] = useState('');
  const [akhirDeskripsi, setAkhirDeskripsi] = useState('');

  // * Event handler
  const handleAwalTitleChange = (e) => setAwalTitle(e.target.value);
  const handleAwalDescChange = (e) => setAwalDeskripsi(e.target.value);
  const handleAkhirDescChange = (e) => setAkhirDeskripsi(e.target.value);
  const saveHandle = () => {
    const data = {
      start_title: awalTitle.split(',').map((x) => x.trim()),
      start_desc: awalDeskripsi,
      end_desc: akhirDeskripsi,
    };
    window.electron.ipcRenderer.sendMessage('save settings suffle data', data);
  };
  // ! Event handler

  // * Load the current data
  useEffect(() => {
    window.electron.ipcRenderer.once('shuffle data', (shuffleData) => {
      setAwalTitle(shuffleData.start_title.join(','));
      setAkhirDeskripsi(shuffleData.end_desc);
      setAwalDeskripsi(shuffleData.start_desc);
      console.log(shuffleData);
    });
    window.electron.ipcRenderer.sendMessage('get shuffle data');
  }, []);
  // ! Load the current data

  return (
    <div className="shuffle">
      <div className="form">
        <TextField
          multiline={false}
          size="small"
          label="Awal title"
          value={awalTitle}
          onChange={handleAwalTitleChange.bind(this)}
          helperText="Acak awalan title, pisahkan dengan koma jika lebih dari 1"
        />
        <TextField
          multiline={true}
          size="small"
          label="Deskripsi tambahan awal"
          minRows={5}
          maxRows={10}
          value={awalDeskripsi}
          onChange={handleAwalDescChange.bind(this)}
        />
        <TextField
          multiline={true}
          size="small"
          label="Deskripsi tambahan akhir"
          minRows={5}
          maxRows={10}
          value={akhirDeskripsi}
          onChange={handleAkhirDescChange.bind(this)}
        />
        <Button
          size="small"
          className="btn-save-2"
          variant="outlined"
          startIcon={<SaveIcon />}
          onClick={saveHandle.bind(this)}
        >
          Simpan
        </Button>
      </div>
      <Tooltip title="Simpan shuffle">
        <IconButton
          onClick={saveHandle.bind(this)}
          className="btn-save"
          color="primary"
        >
          <SaveIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}
