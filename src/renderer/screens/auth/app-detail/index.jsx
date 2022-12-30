import './index.scss';
import Card from '@mui/material/Card';
import global from '../../../../global.json';
import icon from '../../../static/image/icon.png';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MemoryIcon from '@mui/icons-material/Memory';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';

// Action bar icon
import MinimizeIcon from '@mui/icons-material/Minimize';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';

const handleMinimize = () => {
  window.electron.ipcRenderer.sendMessage('minimize app');
};

const handleMaximize = () => {
  window.electron.ipcRenderer.sendMessage('maximize app');
};

const handleClose = () => {
  window.electron.ipcRenderer.sendMessage('close app');
};

export default function Index() {
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    window.electron.ipcRenderer.once('current color', (color) => {
      setSelectedColor(color);
    });
    window.electron.ipcRenderer.sendMessage('get current color');
  }, []);

  return (
    <Card
      className="app-detail"
      style={{ '-webkit-app-region': 'drag', background: selectedColor }}
    >
      <img src={icon} className="icon" />
      <div className="name">
        <div className="title">Lazada</div>
        <div className="subtitle"> Scrapper v{global.appVersion.code}</div>
      </div>
      <div className="action-bar" style={{ '-webkit-app-region': 'no-drag' }}>
        <button className="action" onClick={handleMinimize.bind(this)}>
          <MinimizeIcon className="icon" />
        </button>
        <button className="action" onClick={handleMaximize.bind(this)}>
          <FullscreenIcon className="icon" />
        </button>
        <button className="action close" onClick={handleClose.bind(this)}>
          <CloseIcon className="icon" />
        </button>
      </div>
    </Card>
  );
}
