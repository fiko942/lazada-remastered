import {
  Card,
  Paper,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Label,
  Checkbox,
  FormControlLabel,
  ListItem,
  List,
  Divider,
  IconButton,
  FormGroup,
} from '@mui/material';
import { useEffect, useState } from 'react';
import MultipleStopIcon from '@mui/icons-material/MultipleStop';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import TrashIcon from '@mui/icons-material/DeleteForever';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import ConfirmDialog from 'renderer/element/ConfirmDialog';
import AddIcon from '@mui/icons-material/Add';

function formatRupiah(angka, prefix) {
  var number_string = angka.replace(/[^,\d]/g, '').toString(),
    split = number_string.split(','),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    const separator = sisa ? '.' : '';
    rupiah += separator + ribuan.join('.');
  }

  rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
  return prefix == undefined ? rupiah : rupiah ? 'Rp. ' + rupiah : '';
}

function onlyNumber(str) {
  return str.replace(/[^0-9]/g, '');
}

export default function Rumus() {
  const [selected_profile, set_selected_profile] = useState('Profil baru');
  const [confirm_delete_open, set_confirm_delete_open] = useState(false);

  const [list, setList] = useState([]);
  const [namaProfil, setNamaProfil] = useState('');
  const [defaultProfil, setDefaultProfil] = useState(false);
  const [kodeKategori, setKodeKategori] = useState('');
  const [berat, setBerat] = useState('');
  const [preorder, setPreorder] = useState('');
  const [asuransi, setAsuransi] = useState('');
  const [addRumusHargaMinimal, setAddRumusHargaMinimal] = useState('');
  const [addRumusHargaMaximal, setAddRumusHargaMaximal] = useState('');
  const [addRumusTypePenambahan, setAddRumusTypePenambahan] = useState('%');
  const [addRumusNilaiPenambahanMinimal, setAddRumusNilaiPenambahanMinimal] =
    useState('');
  const [addRumusNilaiPenambahanMaksimal, setAddRumusNilaiPenambahanMaksimal] =
    useState('');
  const [hargaTambahan, setHargaTambahan] = useState('');
  const [pembulatan, setPembulatan] = useState('');
  const [splitperfile, setSplitperfile] = useState('');
  const [minstock, setMinstock] = useState('');
  const [rumus, setRumus] = useState([]);
  const [profileData, setProfileData] = useState(undefined);

  // * Listen profile data change
  useEffect(() => {
    setNamaProfil(profileData ? profileData.profileName : '');
    setDefaultProfil(profileData ? profileData.default : false);
    setRumus(profileData ? profileData.rumus : []);
    setKodeKategori(profileData ? profileData.defaultValue.categoryCode : '');
    setBerat(profileData ? profileData.defaultValue.heavy : '');
    setPreorder(profileData ? profileData.defaultValue.preorder : '');
    setAsuransi(profileData ? profileData.defaultValue.asurance : '');
    setHargaTambahan(
      profileData
        ? formatRupiah(profileData.additional_price.toString(), '')
        : ''
    );
    setPembulatan(profileData ? profileData.pembulatan : '');
    setSplitperfile(profileData ? profileData.split_perfile : '');
    setMinstock(profileData ? profileData.minstock : '');
  }, [profileData]);

  const [saveRumusOpen, setSaveRumusOpen] = useState(false);
  const handleSaveRumusConfirmClose = () => setSaveRumusOpen(false);

  // * Save logic
  const handleSaveRumus = () => setSaveRumusOpen(true);
  const handleSaveProfile = () => {
    const d = {
      selectedProfile: selected_profile,
      profileName: namaProfil,
      default: defaultProfil,
      defaultValue: {
        categoryCode: kodeKategori,
        heavy: berat,
        preorder: preorder,
        asurance: asuransi,
      },
      rumus: [...rumus],
      additional_price: onlyNumber(hargaTambahan),
      pembulatan: pembulatan,
      split_perfile: splitperfile,
      minstock: minstock,
    };
    window.electron.ipcRenderer.sendMessage('setting rumus add profile', d);
  };
  // ! Save logic

  // * Handler event
  const handleDeleteListRumus = (i) => {
    const r = [...rumus];
    r.splice(i, 1);
    setRumus(r);
  };
  const handleAddRumus = () => {
    var r = [...rumus];
    r.push({
      from: parseInt(onlyNumber(addRumusHargaMinimal)),
      to: parseInt(onlyNumber(addRumusHargaMaximal)),
      type: addRumusTypePenambahan,
      increase: {
        range: {
          from: parseInt(onlyNumber(addRumusNilaiPenambahanMinimal)),
          to: parseInt(onlyNumber(addRumusNilaiPenambahanMaksimal)),
        },
      },
    });
    setRumus(r);
  };

  const handleChangeHargaTambahan = (e) =>
    setHargaTambahan(formatRupiah(onlyNumber(e.target.value), ''));
  const handleChangePembulatan = (e) =>
    setPembulatan(onlyNumber(e.target.value));
  const handleChangeSplitperfile = (e) =>
    setSplitperfile(onlyNumber(e.target.value));
  const handleChangeMinStock = (e) => setMinstock(onlyNumber(e.target.value));
  const handleChangeProfilName = (e) => setNamaProfil(e.target.value);
  const handleChangeDefaultProfil = (e) => setDefaultProfil(e.target.checked);
  const handleChangeKodeKategori = (e) => setKodeKategori(e.target.value);
  const handleChangeBerat = (e) => setBerat(e.target.value);
  const handleChangePreorder = (e) => setPreorder(e.target.value);
  const handleChangeAsuransi = (e) => setAsuransi(e.target.value);
  const handleChangeAddRumusHargaMinimal = (e) =>
    setAddRumusHargaMinimal(
      formatRupiah(e.target.value.replace(/^\D+/g, ''), '')
    );
  const handleChangeAddRumusHargaMaksimal = (e) =>
    setAddRumusHargaMaksimal(
      formatRupiah(e.target.value.replace(/^\D+/g, ''), '')
    );
  const handleChangeAddRumusHargaMaximal = (e) =>
    setAddRumusHargaMaximal(
      formatRupiah(e.target.value.replace(/^\D+/g, ''), '')
    );
  const handleChangeAddRumusTypePenambahan = (e) =>
    setAddRumusTypePenambahan(e.target.value);
  const handleChangeAddRumusNilaiPenambahanMinimal = (e) =>
    setAddRumusNilaiPenambahanMinimal(e.target.value);
  const handleChangeAddRumusNilaiPenambahanMaksimal = (e) =>
    setAddRumusNilaiPenambahanMaksimal(e.target.value);
  // ! Handler event

  const handleSelectedProfileChange = (e) =>
    set_selected_profile(e.target.value);
  // * Confirm Delete
  const handleConfirmDeleteOpen = () => set_confirm_delete_open(true);
  const handleConfirmDeleteClose = () => set_confirm_delete_open(false);
  const handleDeleteProfile = () => {
    window.electron.ipcRenderer.sendMessage(
      'delete profile rumus',
      selected_profile
    );
    set_selected_profile('Profil baru');
  };
  // ! Confirm Delete

  // ! Get settings rumus list
  function listenALlEventFromMain() {
    return window.electron.ipcRenderer.once('rumus profile list', (list) => {
      setList(list);
      set_selected_profile('Profil baru');
      return listenALlEventFromMain();
    });
  }

  function listenProfileData() {
    window.electron.ipcRenderer.once('profile data', (data) => {
      setProfileData(data);
      listenProfileData();
    });
  }

  useEffect(() => {
    listenALlEventFromMain();
    listenProfileData();
    window.electron.ipcRenderer.sendMessage('get rumus profile list');
  }, []);

  useEffect(() => {
    if (selected_profile != 'Profil baru') {
      window.electron.ipcRenderer.sendMessage(
        'get profile data',
        selected_profile
      );
    } else {
      setProfileData(undefined);
    }
  }, [selected_profile]);

  useEffect(() => {
    if (addRumusTypePenambahan == '%') {
      setAddRumusNilaiPenambahanMinimal(
        onlyNumber(addRumusNilaiPenambahanMinimal)
      );
      setAddRumusNilaiPenambahanMaksimal(
        onlyNumber(addRumusNilaiPenambahanMaksimal)
      );
    } else {
      setAddRumusNilaiPenambahanMinimal(
        formatRupiah(onlyNumber(addRumusNilaiPenambahanMinimal), '')
      );
      setAddRumusNilaiPenambahanMaksimal(
        formatRupiah(onlyNumber(addRumusNilaiPenambahanMaksimal), '')
      );
    }
  }, [
    addRumusTypePenambahan,
    addRumusNilaiPenambahanMinimal,
    addRumusNilaiPenambahanMaksimal,
  ]);

  useEffect(() => {}, [selected_profile]);

  return (
    <>
      <ConfirmDialog
        open={confirm_delete_open}
        title="Konfirmasi"
        message="Anda yakin ingin menghapus profile ini secara permanen ? hal yang anda lakukan tidak dapat dikembalikan!"
        onClose={handleConfirmDeleteClose.bind(this)}
        onConfirm={handleDeleteProfile.bind(this)}
      />
      <ConfirmDialog
        open={saveRumusOpen}
        title="Konfirmasi"
        message="Anda yakin ingin menyimpan profil ?"
        onClose={handleSaveRumusConfirmClose.bind(this)}
        onConfirm={handleSaveProfile.bind(this)}
      />
      <Card className="rumus-container">
        <FormControl>
          <InputLabel id="profile-label">Pilih profil</InputLabel>
          <Select
            sx={{ background: '#fff !important' }}
            variant="filled"
            labelId="profile-label"
            value={selected_profile}
            onChange={handleSelectedProfileChange.bind(this)}
          >
            {list.map((l, i) => (
              <MenuItem key={i} value={l}>
                {l}
              </MenuItem>
            ))}
            <MenuItem value="Profil baru">Profil baru</MenuItem>
          </Select>
        </FormControl>

        <div className="profile-option">
          <TextField
            size="small"
            sx={{ width: 'fit-content' }}
            variant="outlined"
            label="Nama profil"
            onChange={handleChangeProfilName.bind(this)}
            value={namaProfil}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={defaultProfil}
                onChange={handleChangeDefaultProfil.bind(this)}
              />
            }
            label="Default profil"
          />
        </div>
      </Card>
      <Card className="rumus-container default-value">
        <TextField
          variant="filled"
          label="Kode kategori"
          type="number"
          className="val"
          size="small"
          value={kodeKategori}
          onChange={handleChangeKodeKategori.bind(this)}
        />
        <TextField
          variant="filled"
          label="Berat"
          type="number"
          className="val"
          size="small"
          value={berat}
          onChange={handleChangeBerat.bind(this)}
        />
        <TextField
          variant="filled"
          label="Pre order"
          className="val"
          size="small"
          type="number"
          value={preorder}
          onChange={handleChangePreorder.bind(this)}
        />
        <TextField
          variant="filled"
          size="small"
          label="Asuransi"
          className="val"
          helperText="ya | tidak"
          value={asuransi}
          onChange={handleChangeAsuransi.bind(this)}
        />
      </Card>
      <Card className="rumus-container rumus">
        <div className="add">
          <TextField
            variant="outlined"
            label="Harga minimal"
            size="small"
            className="fit-content"
            value={addRumusHargaMinimal}
            onChange={handleChangeAddRumusHargaMinimal}
          />
          <MultipleStopIcon color="primary" className="range" sx={{ mt: 1 }} />
          <TextField
            variant="outlined"
            label="Harga maksimal"
            size="small"
            className="fit-content"
            value={addRumusHargaMaximal}
            onChange={handleChangeAddRumusHargaMaximal.bind(this)}
          />
          <KeyboardDoubleArrowRightIcon
            color="primary"
            className="then"
            sx={{ mt: 1 }}
          />
          <Select
            sx={{ height: 'fit-content' }}
            size="small"
            labelId="tipe-penambahan"
            onChange={handleChangeAddRumusTypePenambahan.bind(this)}
            value={addRumusTypePenambahan}
          >
            <MenuItem value="%">%</MenuItem>
            <MenuItem value="Rp">Rp</MenuItem>
          </Select>
          <TextField
            variant="outlined"
            label="Nilai penambahan"
            size="small"
            sx={{ width: 150 }}
            value={addRumusNilaiPenambahanMinimal}
            onChange={handleChangeAddRumusNilaiPenambahanMinimal.bind(this)}
            helperText="Minimal"
          />
          <MultipleStopIcon color="primary" className="range" sx={{ mt: 1 }} />
          <TextField
            variant="outlined"
            label="Nilai penambahan"
            size="small"
            sx={{ width: 150 }}
            value={addRumusNilaiPenambahanMaksimal}
            onChange={handleChangeAddRumusNilaiPenambahanMaksimal.bind(this)}
            helperText="Maksimal"
          />
          <IconButton
            onClick={handleAddRumus.bind(this)}
            sx={{ height: 'fit-content' }}
          >
            <AddIcon />
          </IconButton>
        </div>

        <List className="list">
          {rumus.map((r, i) => (
            <>
              <ListItem className="item">
                <div className="num-list">{i + 1}</div>
                <div className="from">
                  {formatRupiah(r.from.toString(), '')}
                </div>
                <MultipleStopIcon color="primary" className="range" />
                <div className="to">{formatRupiah(r.to.toString(), '')}</div>
                <KeyboardDoubleArrowRightIcon
                  color="primary"
                  className="then"
                />
                <div className={r.type == '%' ? 'add percent' : 'add idr'}>
                  {r.type == '%'
                    ? `${r.increase.range.from}% - ${r.increase.range.to}%`
                    : formatRupiah(r.increase.range.from.toString(), '') +
                      ' - ' +
                      formatRupiah(r.increase.range.to.toString(), '')}
                </div>
                <IconButton
                  className="delete"
                  size="small"
                  sx={{ width: '25px', height: '25px' }}
                  onClick={handleDeleteListRumus.bind(this, i)}
                >
                  <CloseIcon fontSize="13px" />
                </IconButton>
              </ListItem>
              {i != rumus.length - 1 && <Divider color="#FF5722" />}
            </>
          ))}
        </List>
      </Card>
      <Card className="rumus-container price">
        <TextField
          label="Harga tambahan"
          size="small"
          variant="standard"
          value={hargaTambahan}
          onChange={handleChangeHargaTambahan.bind(this)}
        />
        <TextField
          label="Pembulatan"
          size="small"
          variant="standard"
          value={pembulatan}
          onChange={handleChangePembulatan.bind(this)}
        />
        <TextField
          label="Split per file"
          size="small"
          variant="standard"
          value={splitperfile}
          onChange={handleChangeSplitperfile.bind(this)}
        />
        <TextField
          label="Minimal stock"
          size="small"
          variant="standard"
          value={minstock}
          onChange={handleChangeMinStock.bind(this)}
        />
        <div className="actions">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveRumus.bind(this)}
          >
            Simpan
          </Button>
          <Button
            variant="contained"
            startIcon={<TrashIcon />}
            onClick={handleConfirmDeleteOpen.bind(this)}
          >
            Hapus
          </Button>
        </div>
      </Card>
    </>
  );
}
