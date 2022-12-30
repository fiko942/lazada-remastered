import './index.scss';
import AppDetail from '../app-detail';
import DeviceWarning from '../../../static/image/ilustration/device_warning.png';
import {
  InputBase,
  IconButton,
  Paper,
  Divider,
  CircularProgress,
  Snackbar,
  Button,
  Tooltip,
} from '@mui/material';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';

export default function Unregistered() {
  const location = useLocation();
  const navigate = useNavigate();

  const [MACHINE_ID, SET_MACHINE_ID] = useState('');
  const [searchs, setSearchs] = useState([]);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackPack, setSnackPack] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState(undefined);
  const [RES_ERROR, SET_RES_ERROR] = useState(true);

  React.useEffect(() => {
    if (snackPack.length && !messageInfo) {
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const handleChangeToken = (event) => setToken(event.target.value);

  const handleRestartApp = () => navigate('/');

  useEffect(() => {
    window.electron.ipcRenderer.once('activate token result', (res) => {
      setLoading(false);
      setOpen(true);
      handleClick(res.message);
      SET_RES_ERROR(res.error);
      setMessageInfo({
        message: res.error
          ? res.message
          : 'Aktivasi berhasil, Tekan tombol "RESTART" untuk menerapkan perubahan.',
      });
    });
  }, []);

  const handleClick = (message) => () => {
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  const activateToken = async () => {
    setLoading(true);
    window.electron.ipcRenderer.sendMessage('activate token', token);
  };

  useEffect(() => {
    const search_string = location.search.split('?').pop();
    const search_without_keyval = search_string
      .split('&')
      .map((x) => x.split('='));
    var res = [];
    search_without_keyval.map((x) => {
      res.push({
        key: x[0],
        val: x[1],
      });
    });

    setSearchs(res);
  }, [location]);

  useEffect(() => {
    if (searchs.indexOf((x) => x.key == 'MACHINE_ID' >= 0)) {
      const item = searchs.find((x) => x.key == 'MACHINE_ID');
      SET_MACHINE_ID(typeof item != 'undefined' ? item.val : '');
    }
  }, [searchs]);

  const handleContact = (TYPE) => {
    window.electron.ipcRenderer.sendMessage('get contact', TYPE);
  };

  return (
    <div className="auth__unregistered">
      <AppDetail />
      <img src={DeviceWarning} className="device-warning" draggable={false} />
      <Paper
        sx={{
          padding: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: 400,
          maxWidth: '100%',
          background: '#FE2B24',
        }}
        className="input-container"
      >
        <InputBase
          sx={{
            ml: 1,
            flex: 1,
            color: '#fff',
          }}
          value={token}
          onChange={handleChangeToken.bind(this)}
          placeholder="Activate Token"
        ></InputBase>
        <Divider
          orientation="vertical"
          sx={{ borderColor: '#fff', padding: 1 }}
        />
        {loading && (
          <CircularProgress sx={{ color: '#fff', p: '12px' }} size={20} />
        )}
        {!loading && (
          <IconButton
            type="button"
            sx={{ p: '10px', cursor: loading ? 'none !important' : 'pointer' }}
            disabled={loading}
            onClick={activateToken.bind(this)}
          >
            <ToggleOnIcon
              sx={{
                color: loading ? 'silver' : '#fff',
              }}
            />
          </IconButton>
        )}
      </Paper>
      <div className="machine-id">{MACHINE_ID}</div>

      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        open={open}
        autoHideDuration={60000}
        onClose={handleClose.bind(this)}
        TransitionProps={{ onExited: handleExited }}
        message={messageInfo ? messageInfo.message : undefined}
        action={
          <React.Fragment>
            {!RES_ERROR && (
              <Button
                color="warning"
                size="small"
                onClick={handleRestartApp.bind(this)}
              >
                RESTART
              </Button>
            )}
            <IconButton
              aria-label="close"
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={handleClose.bind(this)}
            >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      />
      <Tooltip
        title="Klik untuk mengajukan pertanyaan atau meminta bantuan"
        className="helper-container"
      >
        <div>
          <IconButton>
            <WhatsAppIcon
              sx={{ color: '#10D34F' }}
              onClick={handleContact.bind(this, 'WHATSAPP')}
            />
          </IconButton>
          <IconButton>
            <MarkEmailUnreadIcon
              sx={{ color: '#EDB30B' }}
              onClick={handleContact.bind(this, 'EMAIL')}
            />
          </IconButton>
        </div>
      </Tooltip>
    </div>
  );
}
