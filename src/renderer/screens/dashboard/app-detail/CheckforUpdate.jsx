/* eslint-disable import/no-unresolved */
import { useEffect, useState } from 'react';
import { IconButton, Button, CircularProgress } from '@mui/material';
import DownloadingIcon from '@mui/icons-material/Downloading';
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import ConfirmDialog from 'renderer/element/ConfirmDialog';

export default function CheckforUpdate() {
  const [state, setState] = useState(0); // ! 0 = loading, 1 = downloading, 2 = downloaded, 3 = latest
  const [cdOpen, setCdOpen] = useState(false);
  const [log, setLog] = useState('');

  const handleCdClose = () => setCdOpen(false);

  function listenStateRecoursion() {
    window.electron.ipcRenderer.on('update state', (s) => {
      setState(s);
    });
  }

  function listenLog() {
    window.electron.ipcRenderer.on('update-log', (d) => {
      setLog(JSON.stringify(d));
    });
  }

  useEffect(() => {
    setCdOpen(state == 2);
  }, [state]);

  useEffect(() => {
    listenStateRecoursion();
    listenLog();
    window.electron.ipcRenderer.sendMessage('check for update');
  }, []);
  return (
    <div className="check4update">
      <div className="log">{log}</div>
      <ConfirmDialog
        open={cdOpen}
        title="Konfirmasi"
        message="Anda yakin ingin menginstall update? jika anda mengetuk iya maka aplikasi akan tertutup dan melakukan installasi versi terbaru"
        onClose={handleCdClose.bind(this)}
        onConfirm={() => {
          window.electron.ipcRenderer.sendMessage('install update');
        }}
      />
      <IconButton
        size="30px"
        onClick={() => {
          setCdOpen(true);
        }}
        sx={{ WebkitAppRegion: 'no-drag' }}
      >
        <Icon state={state} />
      </IconButton>
    </div>
  );
}

function Icon({ state }) {
  if (state == 0) {
    return (
      <CircularProgress sx={{ color: '#fff', fontSize: '20px' }} size="20px" />
    );
  } else if (state == 1) {
    return <DownloadingIcon sx={{ color: '#fff' }} />;
  } else if (state == 2) {
    return <InstallDesktopIcon sx={{ color: '#fff' }} />;
  } else if (state == 3) {
    return <FileDownloadDoneIcon sx={{ color: '#fff' }} />;
  }
}
