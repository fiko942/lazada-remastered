import './Dashboard.scss';
import AppDetail from './app-detail';
import { deepOrange } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: deepOrange[500],
    },
  },
});

export default function Dashboard({ Content }) {
  return (
    <ThemeProvider theme={theme}>
      <div className="dashboard">
        <AppDetail />
        <div className="content">{Content}</div>
      </div>
    </ThemeProvider>
  );
}
