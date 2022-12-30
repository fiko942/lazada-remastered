import {
  List,
  Checkbox,
  ListItem,
  Avatar,
  ListItemText,
  Divider,
  Typography,
  ListItemAvatar,
  ListItemButton,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import 'moment/locale/id';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ConfirmDialog from 'renderer/element/ConfirmDialog';
import DeleteCollections from 'main/Func/DeleteCollections';
import DnsIcon from '@mui/icons-material/Dns';
import LaunchIcon from '@mui/icons-material/Launch';
import ExportTemplate from './ExportTemplate';
import TrashIcon from '@mui/icons-material/Delete';

export default function (args) {
  const [collectionList, setCollectionList] = useState([]);
  const [checked, setChecked] = useState([]);
  const [openedCollection, setOpenedCollection] = useState(-1);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState([]);
  const [exportTemplateOpen, setexportTemplateOpen] = useState(false);
  const [singleExportSelected, setSingleExportSelected] = useState(undefined);
  const [selectedDeleteSingleCollection, setselectedDeleteSingleCollection] =
    useState(undefined);
  const [singleDeleteOpen, setSingleDeleteOpen] = useState(false);

  const handleExportTemplateClose = () => setexportTemplateOpen(false);

  const handleExport = (col) => {
    args.onExport(col ? col : [...selectedCollection]);
  };

  const handleMenuOpen = (e) => setMenuAnchorEl(e.currentTarget);
  const handleMenuClose = () => setMenuAnchorEl(null);
  const menuOpen = Boolean(menuAnchorEl);

  function handleFilterKataMelanggar() {
    // console.log(selectedCollection);
    window.electron.ipcRenderer.sendMessage(
      'filter kata melanggar',
      selectedCollection
    );
  }

  useEffect(() => {
    let d = [...checked];
    let c = [...Array.from(collectionList).reverse()];

    var r = [];
    for (let i = 0; i < d.length; i++) {
      if (typeof d[i] == 'boolean' && d[i] === true) {
        r.push(c[i]);
      }
    }

    setSelectedCollection(r);
    args.onSelectedChange(r);
  }, [checked, collectionList]);

  const handleCheckChange = (index) => {
    const c = [...checked];
    c[index] = !c[index];
    setChecked(c);
  };

  const listenMainEventRecoursion = () => {
    window.electron.ipcRenderer.once('collection list', (COLLECTION_LIST) => {
      setCollectionList(COLLECTION_LIST);
      let arr = [];
      for (let i = 0; i < COLLECTION_LIST.length; i++) {
        arr.push(false);
      }
      setChecked(arr);
      listenMainEventRecoursion();
    });
  };
  useEffect(() => {
    listenMainEventRecoursion();
    window.electron.ipcRenderer.sendMessage('get collection list');
  }, []);

  const handleCheckAllCollectionList = (event) => {
    var c = [...checked];
    c = c.map((x) => (x = event.target.checked));
    setChecked(c);
  };

  const handleOpenCollection = (col, i) => {
    setOpenedCollection(i);
    args.onCollectionOpen(col);
  };

  function handleCdn() {
    window.electron.ipcRenderer.sendMessage(
      'move collections to cdn',
      selectedCollection
    );
  }

  const handleConfirmDeleteDialogOpen = () => setConfirmDeleteDialogOpen(true);
  const handleConfirmDeleteDialogClose = () =>
    setConfirmDeleteDialogOpen(false);

  const handleSingleExport = (i) => {
    setexportTemplateOpen(true);
    setSingleExportSelected([i]);
  };

  const handleExportTemplatAsli = () => {
    setexportTemplateOpen(false);
    window.electron.ipcRenderer.sendMessage('export collection', {
      custom_template: false,
      collections: singleExportSelected,
    });
  };

  const handleExportTemplateCustom = () => {
    setexportTemplateOpen(false);
    window.electron.ipcRenderer.sendMessage('export collection', {
      custom_template: true,
      collections: singleExportSelected,
    });
  };

  const handleSingleDelete = (i) => {
    setselectedDeleteSingleCollection(i);
    setSingleDeleteOpen(true);
  };

  const handleSingleDeleteClose = () => setSingleDeleteOpen(false);

  return (
    <>
      <List className="list">
        <ConfirmDialog
          open={confirmDeleteDialogOpen}
          title="Konfirmasi"
          message={`Anda yakin ingin menghapus ${selectedCollection.length} collection ?`}
          onClose={handleConfirmDeleteDialogClose.bind(this)}
          onConfirm={() => {
            window.electron.ipcRenderer.sendMessage(
              'delete collections',
              selectedCollection
            );
          }}
        />

        <ConfirmDialog
          open={singleDeleteOpen}
          title="Konfirmasi"
          message={`Anda yakin ingin menghapus ${
            selectedDeleteSingleCollection
              ? selectedDeleteSingleCollection.name
              : ''
          } ?`}
          onClose={handleSingleDeleteClose.bind(this)}
          onConfirm={() => {
            window.electron.ipcRenderer.sendMessage('delete collections', [
              selectedDeleteSingleCollection,
            ]);
          }}
        />

        {collectionList.length <= 0 && (
          <Typography
            sx={{ display: 'inline', padding: 5 }}
            component="span"
            variant="body2"
            color="text.primary"
          >
            Anda belum mempunyai collection
          </Typography>
        )}
        {collectionList.length > 0 && (
          <div className="flex">
            <FormControlLabel
              label="Check all"
              sx={{ marginLeft: '0px' }}
              control={
                <Checkbox onChange={handleCheckAllCollectionList.bind(this)} />
              }
            />
            {args.showOpt && (
              <div className="right">
                <IconButton onClick={handleMenuOpen.bind(this)}>
                  <MoreVertIcon />
                </IconButton>

                <Menu
                  anchorEl={menuAnchorEl}
                  open={menuOpen}
                  onClose={handleMenuClose.bind(this)}
                >
                  <MenuItem
                    onClick={() => {
                      handleConfirmDeleteDialogOpen();
                      handleMenuClose();
                    }}
                  >
                    Delete
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleFilterKataMelanggar();
                      handleMenuClose();
                    }}
                  >
                    Filter kata melanggar
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      window.electron.ipcRenderer.sendMessage(
                        'export collection',
                        {
                          custom_template: true,
                          collections: selectedCollection,
                        }
                      );
                      handleMenuClose();
                    }}
                  >
                    Export
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleCdn();
                      handleMenuClose();
                    }}
                  >
                    CDN
                  </MenuItem>
                </Menu>
              </div>
            )}
          </div>
        )}
        {collectionList.length > 0 &&
          Array.from(collectionList)
            .reverse()
            .map((col, index) => (
              <>
                <ListItem
                  disablePadding={true}
                  alignItems="flex-start"
                  key={index}
                  sx={{ position: 'relative' }}
                  className={`item collection-item ${
                    openedCollection == index ? 'active' : ''
                  }`}
                >
                  <ListItemAvatar disablePadding>
                    <Checkbox
                      onChange={handleCheckChange.bind(this, index)}
                      checked={checked[index]}
                      className="item-check"
                    />
                  </ListItemAvatar>
                  <ListItemButton
                    onClick={handleOpenCollection.bind(this, col, index)}
                  >
                    <ListItemText
                      primary={col.name}
                      sx={{ display: 'inline', maxWidth: '150px' }}
                      secondary={
                        <div style={{ fontSize: '10px', display: 'flex' }}>
                          {`${col.len} — ${moment(col.created * 1000)
                            .tz('Asia/Jakarta')
                            .format('dddd, DD/MM/YYYY hh:mm')}`}
                        </div>
                      }
                    />
                    <Tooltip title="Export">
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: '5px',
                          right: '10px',
                        }}
                        onClick={() => {
                          window.electron.ipcRenderer.sendMessage(
                            'export collection',
                            {
                              custom_template: true,
                              collections: [col],
                            }
                          );
                        }}
                      >
                        <LaunchIcon sx={{ fontSize: '18px' }} />
                      </IconButton>
                    </Tooltip>
                    {openedCollection == index && (
                      <Tooltip title="Hapus">
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: '5px',
                            right: '30px',
                          }}
                          onClick={handleSingleDelete.bind(this, col)}
                        >
                          <TrashIcon
                            sx={{ fontSize: '18px', color: 'rgba(0,0,0,0.2)' }}
                          />
                        </IconButton>
                      </Tooltip>
                    )}
                  </ListItemButton>
                  {col.cdn && (
                    <Tooltip
                      sx={{ marginTop: 'auto', marginBottom: 'auto' }}
                      title="Collection ini berada di server CDN Indonesia (rencangdahar.com)"
                    >
                      <DnsIcon color="primary" />
                    </Tooltip>
                  )}
                </ListItem>
                {index != collectionList.length - 1 && <Divider />}
              </>
            ))}
      </List>
      {exportTemplateOpen && (
        <ExportTemplate
          onClose={handleExportTemplateClose}
          onExportTemplatAsli={handleExportTemplatAsli.bind(this)}
          onExportCustomTemplate={handleExportTemplateCustom.bind(this)}
        />
      )}
    </>
  );
}
