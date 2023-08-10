import './error.scss';
import ErrorStill from '../../../static/image/ilustration/error_still.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AppDetail from '../app-detail';
import Button from '@mui/material/Button';

function parseQuery(search) {
  var args = search.substring(1).split('&');
  var argsParsed = {};
  var i, arg, kvp, key, value;
  for (i = 0; i < args.length; i++) {
    arg = args[i];
    if (-1 === arg.indexOf('=')) {
      argsParsed[decodeURIComponent(arg).trim()] = true;
    } else {
      kvp = arg.split('=');
      key = decodeURIComponent(kvp[0]).trim();
      value = decodeURIComponent(kvp[1]).trim();
      argsParsed[key] = value;
    }
  }
  return argsParsed;
}

export default function Index() {
  const location = useLocation();
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  useEffect(() => {
    const parsed = parseQuery(location.search);
    if (typeof parsed.MESSAGE == 'string') setMessage(parsed.MESSAGE);
  }, [location]);

  const handleCobaLagi = () => navigate('/');

  return (
    <div className="auth__error">
      <AppDetail />
      <div className="wrapper">
        <div className="title">Whoops</div>
        <div className="subtitle">Gagal menghubungkan ke server, silahkan cek koneksi anda.</div>
        <img
          src={ErrorStill}
          className="error-image-ilustration"
          draggable={false}
        />
        <Button
          variant="outlined"
          color="warning"
          className="btn__coba-lagi"
          onClick={handleCobaLagi.bind(this)}
        >
          Coba Lagi
        </Button>
      </div>
    </div>
  );
}
