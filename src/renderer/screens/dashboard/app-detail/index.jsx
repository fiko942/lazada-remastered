import './index.scss';
import Card from '@mui/material/Card';
import global from '../../../../global.json';
import icon from '../../../static/image/icon.png';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MemoryIcon from '@mui/icons-material/Memory';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';

// Action bar icon
import MinimizeIcon from '@mui/icons-material/Minimize';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { SketchPicker } from 'react-color';
import CheckforUpdate from './CheckforUpdate';

const routes = [
  {
    name: 'Dashboard',
    url: '/dashboard/dashboard',
    icon: <DashboardIcon />,
  },
  {
    name: 'Task',
    url: '/dashboard/task',
    icon: <MemoryIcon />,
  },
  {
    name: 'Brankas',
    url: '/dashboard/collection',
    icon: <FeaturedPlayListIcon />,
  },
  {
    name: 'Settings',
    url: '/dashboard/settings',
    icon: <SettingsIcon />,
  },
];

const handleMinimize = () => {
  window.electron.ipcRenderer.sendMessage('minimize app');
};

const handleMaximize = () => {
  window.electron.ipcRenderer.sendMessage('maximize app');
};

const handleClose = () => {
  window.electron.ipcRenderer.sendMessage('close app');
};

export default function Index(args) {
  const [customThemeOpen, setCustomThemeOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [version, setVersion] = useState('_');

  useEffect(() => {
    window.electron.ipcRenderer.once('current color', (color) => {
      setSelectedColor(color);
    });
    window.electron.ipcRenderer.once('version', (v) => setVersion(v));
    window.electron.ipcRenderer.sendMessage('get current color');
    window.electron.ipcRenderer.sendMessage('get version');
  }, []);

  const handleOpenCustomTheme = () => setCustomThemeOpen(true);
  const handleCloseCustomTheme = () => setCustomThemeOpen(false);
  const location = useLocation();
  useEffect(() => {
    const CURRENT_ENDPOINT = location.pathname;
    if (routes.findIndex((x) => x.url == CURRENT_ENDPOINT) >= 0) {
      document
        .querySelectorAll('.dashboard .routes .route')
        .forEach((x) => x.classList.remove('active'));
      document
        .querySelectorAll(
          `.dashboard .routes .route[href="${CURRENT_ENDPOINT}"]`
        )
        .forEach((x) => x.classList.add('active'));
    }
  }, [location]);

  useEffect(() => {
    if (customThemeOpen) {
      document
        .querySelectorAll('.chrome-picker, .chrome-picker *')
        .forEach((x) => {
          x.style['-webkit-app-region'] = 'no-drag';
        });
    }
  }, [customThemeOpen]);
  return (
    <Card
      className="app-detail"
      style={{
        '-webkit-app-region': 'drag',
      }}
      sx={{ backgroundColor: selectedColor + ' !important' }}
    >
      {customThemeOpen && (
        <Paper className="custom-theme" style={{ WebkitAppRegion: 'no-drag' }}>
          <div className="close" onClick={handleCloseCustomTheme.bind(this)}>
            <CloseIcon className="icon" />
          </div>
          <SketchPicker
            color={selectedColor}
            onChange={(e) => {
              setSelectedColor(e.hex);
              window.electron.ipcRenderer.sendMessage(
                'update current color',
                e.hex
              );
            }}
            style={{ WebkitAppRegion: 'no-drag' }}
          />
        </Paper>
      )}

      <img src={icon} className="icon" />
      <div className="name">
        <div className="title">Lazada</div>
        <div className="subtitle">Scrapper v{version}</div>
      </div>
      <div className="routes" style={{ '-webkit-app-region': 'no-drag' }}>
        {routes.map((route, index) => (
          <Link
            to={route.url}
            className="route"
            key={index}
            draggable={false}
            style={{
              outline: 'none !important',
            }}
          >
            <div className="icon">{route.icon}</div>
            <div className="name">{route.name}</div>
          </Link>
        ))}
      </div>
      <div className="action-bar" style={{ '-webkit-app-region': 'no-drag' }}>
        <button className="action" onClick={handleOpenCustomTheme}>
          <ColorLensIcon className="icon" />
        </button>
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
      {/* <CheckforUpdate /> */}
    </Card>
  );
}
