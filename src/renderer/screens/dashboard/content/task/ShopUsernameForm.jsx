import { Button, TextField, FormControlLabel, Checkbox } from '@mui/material';
import { useEffect, useState } from 'react';
import Dialog from './Dialog';

export default function ShopUsernameForm(args) {
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [freeShipping, setFreeShipping] = useState(false);
  const [maxPage, setMaxPage] = useState(1);
  const [core, setCore] = useState(1);
  // ---
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleFreeShippingChange = (e) => setFreeShipping(e.target.checked);
  const handleMaxPageChange = (e) => setMaxPage(e.target.value);
  const handleCoreChange = (e) => setCore(e.target.value);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleTaskStart = () => {
    if (isNaN(maxPage) || !parseInt(maxPage)) {
      setDialogMessage('Jumlah halaman yang anda masukkan tidak valid!');
      return setDialogOpen(true);
    }
    if (isNaN(core) || !parseInt(core)) {
      setDialogMessage('Tab yang anda masukkan tidak valid');
      return setDialogOpen(true);
    }

    const params = {
      type: 'SHOP',
      usernames: username.split(',').map((x) => x.trim()),
      free_shipping: freeShipping,
      max_page: maxPage,
      core,
    };
    return args.onTaskStart(params);
  };

  useEffect(() => {
    setLoading(args.loading);
  }, [args.loading]);
  return (
    <div className="keyword-form">
      <Dialog
        open={dialogOpen}
        title={dialogTitle}
        message={dialogMessage}
        onClose={handleCloseDialog.bind(this)}
      />
      <TextField
        variant="outlined"
        label="Username toko"
        helperText="Pisahkan dengan koma"
        className="general-input"
        required
        size="small"
        disabled={loading}
        value={username}
        onChange={handleUsernameChange.bind(this)}
      />
      <div className="group small">
        <FormControlLabel
          disabled={loading}
          control={
            <Checkbox
              checked={freeShipping}
              onChange={handleFreeShippingChange.bind(this)}
            />
          }
          label="Free Shipping"
        />
      </div>
      <TextField
        variant="outlined"
        label="Jumlah halaman"
        size="small"
        type="number"
        required
        disabled={loading}
        value={maxPage}
        onChange={handleMaxPageChange.bind(this)}
      />
      <TextField
        disabled={loading}
        variant="outlined"
        size="small"
        label="Tab"
        type="number"
        required
        helperText="Seimbangkan kecepatan internet dengan performa komputer"
        value={core}
        onChange={handleCoreChange.bind(this)}
      />
      {!loading && (
        <Button
          sx={{
            width: 'fit-content',
            display: 'flex',
            marginLeft: 'auto',
            marginRight: 0,
          }}
          variant="contained"
          onClick={handleTaskStart.bind(this)}
        >
          Scrap
        </Button>
      )}
    </div>
  );
}
