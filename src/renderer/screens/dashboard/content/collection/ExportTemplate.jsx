import {
  Paper,
  Button,
  TextField,
  FormGroup,
  Box,
  Typography,
  Tab,
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useEffect, useState } from 'react';

export default function ExportTemplate({
  open,
  onClose,
  onExportTemplatAsli,
  onExportCustomTemplate,
}) {
  const [value, setValue] = useState(0);
  const handleChangeTab = (v) => setValue(v);

  return (
    <>
      <div className="export-template-wrapper" onClick={onClose}></div>
      <Paper className="export-template">
        {/* <div className="custom">
          <p>Template asli tokopedia</p>
          <Button onClick={onExportTemplatAsli.bind(this)}>Export</Button>
        </div> */}
        <div className="ori">
          <p>1 Template untuk multi store</p>
          <Button onClick={onExportCustomTemplate.bind(this)}>Export</Button>
        </div>
      </Paper>
    </>
  );
}
