import './index.scss';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import PriceIcon from '@mui/icons-material/PriceCheck';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Rumus from './Rumus';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Shuffle from './Shuffle';
import KataMelanggar from './KataMelanggar';
import IOSSwitch from './IOSSwitch';
import FormControlLabel from '@mui/material/FormControlLabel';
import OutputIcon from '@mui/icons-material/Output';
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';

const settings = [
  {
    name: 'Rumus',
    route: 'RUMUS',
    icon: <PriceIcon />,
    content: <Rumus />,
  },
  {
    name: 'Shuffle',
    route: 'SHUFFLE',
    icon: <ShuffleIcon />,
    content: <Shuffle />,
  },
  {
    name: 'Kata Melanggar',
    route: 'KATA_MELANGGAR',
    icon: <WarningAmberIcon />,
    content: <KataMelanggar />,
  },
];

const locParams = 'set_name';
var splitFile = false;
var randomImage = false;

const getLocationSearchParam = (searchString) => {
  var res = searchString.split('?').pop();
  var data = res.split('&').map((x) => {
    var g = {};
    g[x.split('=')[0]] = x.split('=')[1] || '';
    return g;
  });
  return data[0][locParams] || '';
};

const handleExportProfile = () => {
  window.electron.ipcRenderer.sendMessage('export profile');
};

const handleImportProfile = () => {
  window.electron.ipcRenderer.sendMessage('import profile');
};

export default function index() {
  const navigate = useNavigate();
  const location = useLocation();

  const [CURRENT_MENU, SET_CURRENT_MENU] = useState('GENERAL');
  const [CURRENT_ROUTE_INDEX, SET_CURRENT_ROUTE_INDEX] = useState(0);
  const [SPLIT_FILE, SET_SPLIT_FILE] = useState(false);
  const [RANDOM_IMAGE, SET_RANDOM_IMAGE] = useState(false);

  const handleChangeSplitFile = (e) => {
    SET_SPLIT_FILE(e.target.checked);
  };
  const handleChangeRandomImage = (e) => {
    SET_RANDOM_IMAGE(e.target.checked);
  };

  useEffect(() => {
    window.electron.ipcRenderer.once('general settings', (data) => {
      SET_SPLIT_FILE(data.split_file);
      SET_RANDOM_IMAGE(data.random_image);
    });
    window.electron.ipcRenderer.sendMessage('get general settings');
    navigate(`/dashboard/settings?${locParams}=${settings[0].route}`);
  }, []);

  useEffect(() => {
    const i = settings.findIndex((x) => x.route == CURRENT_MENU);
    SET_CURRENT_ROUTE_INDEX(i < 0 ? 0 : i);
  }, [CURRENT_MENU]);

  useEffect(() => {
    const searchs = getLocationSearchParam(location.search);
    if (typeof searchs == 'string') {
      SET_CURRENT_MENU(searchs);
    }
  }, [location]);

  const handleChangeSettingRoute = (route) =>
    navigate(`/dashboard/settings?${locParams}=${route}`);

  return (
    <div className="dashboard__settings">
      <div className="menu-container">
        <List disablePadding={true} className="list">
          {settings.map((setting, index) => (
            <ListItem
              className={`menu${
                CURRENT_MENU == setting.route ? ' active' : ''
              }`}
              disablePadding={true}
              key={index}
            >
              <ListItemButton
                onClick={handleChangeSettingRoute.bind(this, setting.route)}
              >
                <ListItemAvatar>{setting.icon}</ListItemAvatar>
                <ListItemText>{setting.name}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
          <div className="bottom-options">
            <ListItem disablePadding>
              <ListItemButton onClick={handleExportProfile.bind(this)}>
                <ListItemAvatar>
                  <OutputIcon />
                </ListItemAvatar>
                <ListItemText>Export profile</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleImportProfile.bind(this)}>
                <ListItemAvatar>
                  <InstallDesktopIcon />
                </ListItemAvatar>
                <ListItemText>Import profile</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ ml: 2 }}>
              <FormControlLabel
                sx={{ p: 1, fontSize: '5px' }}
                control={
                  <IOSSwitch
                    sx={{ mr: 1 }}
                    checked={RANDOM_IMAGE}
                    onChange={handleChangeRandomImage.bind(this)}
                    onClick={() => {
                      randomImage = !randomImage;
                      window.electron.ipcRenderer.sendMessage(
                        'toggle random image'
                      );
                    }}
                  />
                }
                label="Acak Gambar"
              />
            </ListItem>
            <ListItem disablePadding sx={{ ml: 2 }}>
              <FormControlLabel
                sx={{ p: 1, fontSize: '5px' }}
                control={
                  <IOSSwitch
                    sx={{ mr: 1 }}
                    checked={SPLIT_FILE}
                    onChange={handleChangeSplitFile.bind(this)}
                    onClick={() => {
                      splitFile = !splitFile;
                      window.electron.ipcRenderer.sendMessage(
                        'toggle split file'
                      );
                    }}
                  />
                }
                label="Split File"
              />
            </ListItem>
          </div>
        </List>
      </div>
      <div className="content">{settings[CURRENT_ROUTE_INDEX].content}</div>
    </div>
  );
}
