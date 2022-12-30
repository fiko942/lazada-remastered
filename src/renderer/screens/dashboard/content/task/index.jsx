import {
  Tabs,
  Tab,
  Card,
  IconButton,
  Tooltip,
  Typography,
  Button,
} from '@mui/material';
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';
import { createTheme } from '@mui/material/styles';
import KeywordForm from './KeywordForm';
import ShopUsernameForm from './ShopUsernameForm';
import { ThemeProvider } from '@mui/material/styles';
import MemoryIcon from '@mui/icons-material/Memory';
import TaskModal from './TaskModal';
import { deepOrange } from '@mui/material/colors';
import InfoIcon from '@mui/icons-material/Info';
import './index.scss';

var ipcRenderer = undefined;

const theme = createTheme({
  palette: {
    primary: {
      main: deepOrange[500],
    },
  },
});
export default function index() {
  const [tasks, setTasks] = useState([]);
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalProgressOpen, setModalProgressOpen] = useState(false);
  const handleChangeValue = (e, nv) => setValue(nv);

  const listenAllEventFromMain = () => {
    return window.electron.ipcRenderer.once('task state', (state) => {
      console.log(state);
      setTasks(state.tasks);
      setLoading(state.loading);
      listenAllEventFromMain();
    });
  };

  useEffect(() => {
    listenAllEventFromMain();
    window.electron.ipcRenderer.once('task scrap complete', () =>
      setModalProgressOpen(false)
    );
    window.electron.ipcRenderer.sendMessage('get task state');
  }, []);

  const handleCloseTaskModal = () => setModalProgressOpen(false);
  const handleOpenTaskModal = () => setModalProgressOpen(true);

  const handleTaskStart = (state) => {
    window.electron.ipcRenderer.sendMessage('task start', state);
    setLoading(true);
    setModalProgressOpen(true);
  };

  const handleLogin = () => {
    window.electron.ipcRenderer.sendMessage('login main account');
  };

  return (
    <>
      {loading && (
        <Tooltip title="Lihat proses yang berjalan">
          <IconButton onClick={handleOpenTaskModal.bind(this)}>
            <MemoryIcon sx={{ fontSize: '30px' }} color="primary" />
          </IconButton>
        </Tooltip>
      )}
      <div className="dashboard__task">
        <TaskModal
          open={modalProgressOpen}
          tasks={tasks}
          onClose={handleCloseTaskModal.bind(this)}
        />
        <Card className="main-form">
          <Tabs
            value={value}
            onChange={handleChangeValue}
            className="tabs"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Keyword" icon={<SearchIcon />} />
            <Tab label="Shop username" icon={<StoreMallDirectoryIcon />} />
          </Tabs>
          {value == 0 && (
            <KeywordForm
              loading={loading}
              onTaskStart={handleTaskStart.bind(this)}
            />
          )}
          {value == 1 && (
            <ShopUsernameForm
              loading={loading}
              onTaskStart={handleTaskStart.bind(this)}
            />
          )}
        </Card>
        <div className="task__login">
          <InfoIcon className="info-icon" />
          <Typography
            className="login-info-text"
            variant="h6"
            component="textlogin"
          >
            Filter harga tidak berfungsi jika anda belum login, anda dapat login{' '}
            <Button onClick={handleLogin.bind(this)} size="small">
              Disini
            </Button>
          </Typography>
        </div>
      </div>
    </>
  );
}
