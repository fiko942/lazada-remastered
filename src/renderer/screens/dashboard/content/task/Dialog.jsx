import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import { useEffect, useState } from 'react';

export default function DG(args) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMessage(args.message);
  }, [args.message]);

  useEffect(() => {
    setTitle(args.title);
  }, [args.title]);

  useEffect(() => {
    setOpen(args.open);
  }, [args.open]);

  return (
    <Dialog open={open} onClose={args.onClose.bind(this)}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={args.onClose.bind(this)} autoFocus>
          OKE
        </Button>
      </DialogActions>
    </Dialog>
  );
}
