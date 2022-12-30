import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  DialogTitle,
  Slide,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { deepOrange } from '@mui/material/colors';
import React from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: deepOrange[500],
    },
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MessageDialog({ open, title, message, onClose }) {
  return (
    <ThemeProvider theme={theme}>
      <Dialog
        sx={{ zIndex: 999999999 }}
        open={open}
        className="message__dialog"
        TransitionComponent={Transition}
        keepMounted
        onClose={() => {
          onClose();
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose()}>OK</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
