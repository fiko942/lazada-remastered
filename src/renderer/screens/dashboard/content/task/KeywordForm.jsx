import { Button, TextField, FormControlLabel, Checkbox } from '@mui/material';
import { useEffect, useState } from 'react';
import Dialog from './Dialog';

export default function KeywordForm(args) {
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [min_price, setMinPrice] = useState('');
  const [max_price, setMaxPrice] = useState('');
  const [freeOngkir, setFreeOngkir] = useState(false);
  const [fourStar, setFourStar] = useState(false);
  const [core, setCore] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogClose = () => setDialogOpen(false);

  // Change handler
  const handleKeywordChange = (event) => setKeyword(event.target.value);
  const handleMaxPriceChange = (event) => setMaxPrice(event.target.value);
  const handleMinPriceChange = (event) => setMinPrice(event.target.value);
  const handleFreeOngkirChange = (event) => setFreeOngkir(event.target.checked);
  const handleFourStarChange = (event) => setFourStar(event.target.checked);
  const handleMaxPageChange = (event) => setMaxPage(event.target.value);
  const handleCoreChange = (event) => setCore(event.target.value);
  const handleTaskStart = () => {
    const keywords = keyword
      .trim()
      .split(',')
      .map((x) => x.trim());
    if (isNaN(core) || !parseInt(core)) {
      setDialogOpen(true);
      setDialogMessage('Jumlah tab yang anda masukkan tidak valid!');
      return;
    }
    if (isNaN(maxPage) || !parseInt(maxPage)) {
      setDialogOpen(true);
      setDialogMessage('Jumlah halaman yang anda masukkan tidak valid');
      return;
    }

    return args.onTaskStart({
      type: 'KEYWORD',
      keywords,
      core: parseInt(core),
      maxPage: parseInt(maxPage),
      minPrice: min_price,
      maxPrice: max_price,
      freeOngkir,
      fourStar,
    });
  };
  // End of change handler

  useEffect(() => {
    setLoading(args.loading);
  }, [args.loading]);

  return (
    <div className="keyword-form">
      <Dialog
        title={dialogTitle}
        message={dialogMessage}
        onClose={handleDialogClose.bind(this)}
        open={dialogOpen}
      />
      <TextField
        variant="outlined"
        label="Keyword"
        helperText="Pisahkan dengan koma"
        className="general-input"
        required
        size="small"
        disabled={loading}
        value={keyword}
        onChange={handleKeywordChange.bind(this)}
      />
      <div className="group">
        <TextField
          variant="outlined"
          label="Min price (Rp)"
          className="general-input"
          size="small"
          type="number"
          disabled={loading}
          value={min_price}
          onChange={handleMinPriceChange.bind(this)}
        />
        <TextField
          variant="outlined"
          label="Min price (Rp)"
          className="general-input"
          size="small"
          type="number"
          disabled={loading}
          value={max_price}
          onChange={handleMaxPriceChange.bind(this)}
        />
      </div>
      <div className="group small">
        <FormControlLabel
          disabled={loading}
          control={
            <Checkbox
              checked={freeOngkir}
              onChange={handleFreeOngkirChange.bind(this)}
            />
          }
          label="Free Ongkir"
        />
        <FormControlLabel
          disabled={loading}
          control={
            <Checkbox
              checked={fourStar}
              onChange={handleFourStarChange.bind(this)}
            />
          }
          label="4 Star++"
          className="right"
        />
      </div>
      <TextField
        variant="outlined"
        label="Jumlah halaman"
        size="small"
        type="number"
        required
        disabled={loading}
        value={maxPage}
        onChange={handleMaxPageChange.bind(this)}
      />
      <TextField
        variant="outlined"
        size="small"
        label="Tab"
        type="number"
        required
        disabled={loading}
        helperText="Seimbangkan kecepatan internet dengan performa komputer"
        value={core}
        onChange={handleCoreChange.bind(this)}
      />
      {!loading && (
        <Button
          sx={{
            width: 'fit-content',
            display: 'flex',
            marginLeft: 'auto',
            marginRight: 0,
          }}
          variant="contained"
          onClick={handleTaskStart.bind(this)}
        >
          Scrap
        </Button>
      )}
    </div>
  );
}
