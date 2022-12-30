import { useEffect, useState } from 'react';
import {
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  Divider,
  ButtonGroup,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MemoryIcon from '@mui/icons-material/Memory';

export default function TaskModal(args) {
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    setTasks(args.tasks);
  }, [args.tasks]);

  useEffect(() => {
    setOpen(args.open);
  }, [args.open]);

  const handleStopTask = () =>
    window.electron.ipcRenderer.sendMessage('task stop');

  return (
    open && (
      <>
        <div className="task-modal-wrapper"></div>
        <IconButton
          className="task-modal-close"
          onClick={args.onClose.bind(this)}
        >
          <CloseIcon />
        </IconButton>
        <Paper className="task-modal">
          <List className="list-container">
            {tasks.map((task, index) => {
              const bg = task.success ? '#4caf50' : '#ff5722';
              return (
                <>
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          backgroundColor: bg,
                        }}
                      >
                        <MemoryIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={task.name}
                      secondary={task.message}
                    />
                  </ListItem>
                  {index != tasks.length - 1 && <Divider />}
                </>
              );
            })}
          </List>
          <ButtonGroup variant="text" className="actions">
            <Button onClick={handleStopTask.bind(this)}>STOP</Button>
            <Button onClick={args.onClose.bind(this)}>MINIMIZE</Button>
          </ButtonGroup>
        </Paper>
      </>
    )
  );
}
