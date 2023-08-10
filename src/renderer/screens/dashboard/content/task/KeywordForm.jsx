import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  FormGroup,
  ListItem,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  Rating,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Dialog from './Dialog';

export default function KeywordForm(args) {
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [min_price, setMinPrice] = useState('');
  const [max_price, setMaxPrice] = useState('');
  const [location, setLocation] = useState(locs[0].val);
  const [filterLocState, setFilterLocState] = useState(false);
  const [rating, setRating] = useState(0);
  const [lazMall, setLazMall] = useState(false)
  const [sortBy, setSortBy] = useState(sorts[0].val)

  const [maxPage, setMaxPage] = useState(1);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleLocationChange = (e) => {
    setLocation(e.target.value)
    setFilterLocState(e.target.value !== 'all')
  };
  const handleFilterLocStateChange = (e) => setFilterLocState(e.target.checked);

  const handleDialogClose = () => setDialogOpen(false);

  const handleSortByChange = (e) => {
    setSortBy(e.target.value)
  }

  // Change handler
  const handleKeywordChange = (event) => setKeyword(event.target.value.split('\n').join(''));
  const handleMaxPriceChange = (event) => setMaxPrice(event.target.value);
  const handleMinPriceChange = (event) => setMinPrice(event.target.value);
  const handleMaxPageChange = (event) => setMaxPage(event.target.value);
  const handleTaskStart = () => {
    const keywords = keyword
      .trim()
      .split(',')
      .map((x) => x.trim());
    if (isNaN(maxPage) || !parseInt(maxPage)) {
      setDialogOpen(true);
      setDialogMessage('Jumlah halaman yang anda masukkan tidak valid');
      return;
    }

    return args.onTaskStart({
      type: 'KEYWORD',
      keywords,
      maxPage: parseInt(maxPage),
      minPrice: min_price,
      maxPrice: max_price,
      filter_location_state: filterLocState,
      location,
      rating,
      lazMall,
      sortBy
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
        multiline={true}
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
          label="Max price (Rp)"
          className="general-input"
          size="small"
          type="number"
          disabled={loading}
          value={max_price}
          onChange={handleMaxPriceChange.bind(this)}
        />
      </div>
      <div className="group" style={{
        width: '100%'
      }}>
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
        <FormGroup
        sx={{
          display: 'inline',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}
        fullWidth
      >
        
        <FormControl sx={{ width: 'calc(100% - 0px)' }}>
          <InputLabel size="small" id="lokasi-label">
            Pilih lokasi
          </InputLabel>
          <Select
            size="small"
            labelId="lokasi-label"
            id="lokasi"
            label="Pilih lokasi"
            value={location}
            onChange={handleLocationChange.bind(this)}
          >
            {locs.map((loc, i) => (
              <MenuItem key={i} value={loc.val}>
                {loc.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* <Checkbox
          checked={filterLocState}
          onChange={handleFilterLocStateChange.bind(this)}
        /> */}
      </FormGroup>
      </div>

      <div className="group">
        <FormControlLabel control={<Checkbox checked={lazMall} onChange={(e) => setLazMall(x => !x)} />} label="LazMall" />
        <FormControl sx={{ width: 'calc(100% - 0px)' }}>
          <InputLabel size="small" id="lokasi-label">
            Urutkan Berdasarkan
          </InputLabel>
          <Select
            size="small"
            labelId="lokasi-label"
            id="lokasi"
            label="Pilih lokasi"
            value={sortBy}
            onChange={handleSortByChange.bind(this)}
          >
            {sorts.map((loc, i) => (
              <MenuItem key={i} value={loc.val}>
                {loc.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      
      <FormGroup>
        <Typography component="legend">Rating</Typography>
        <Rating
          value={rating}
          onChange={(e, r) => {
            setRating(r);
          }}
        />
      </FormGroup>
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

const locs = [
  {
    name: "Semua lokasi",
    val: "all"
  },
  {
    name: 'Dalam negeri',
    val: 'Local',
  },
  {
    name: 'Luar negeri',
    val: 'Overseas',
  },
  {
    name: "Jabodetabek",
    val: 'SHIPPING_REGION:350726'
  },
  {
    "name": "Surabaya",
    "val": "SHIPPING_REGION:350709"
  },
  {
    "name": "Bandung",
    "val": "SHIPPING_REGION:1697060"
  }
];

const sorts = [
  {
    name: "Terkait",
    val: 'default'
  },
  {
    name: "Harga Rendah ke Tinggi",
    val: "priceasc" 
  },
  {
    name: "Harga Tinggi ke Rendah",
    val: 'pricedesc'
  }
]