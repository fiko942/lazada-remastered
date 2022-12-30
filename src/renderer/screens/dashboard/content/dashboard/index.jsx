import './index.scss';
import { useEffect, useState } from 'react';
import { Card, Divider } from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import moment from 'moment-timezone';
import 'moment/locale/id';

export default function Index() {
  const [session, setSession] = useState({});
  const handleChangeSession = (CURRENT_SESSION) => setSession(CURRENT_SESSION);

  useEffect(() => {
    window.electron.ipcRenderer.once('current session', handleChangeSession);
    window.electron.ipcRenderer.sendMessage('get current session');
  }, []);

  useEffect(() => {
    console.log(session);
  }, [session]);

  return (
    <div className="dashboard__dashboard">
      <div className="wrapper">
        <Card className="profile">
          <div className="title">
            SESI ANDA
            <AssignmentIndIcon className="icon" />
          </div>
          <Divider className="separator" />
          <table>
            <tr>
              <td>Nama</td>
              <td>
                {Object.keys(session).length < 1
                  ? '...'
                  : session.tobelsoft.data.user.name}
              </td>
            </tr>
            <tr>
              <td>Email</td>
              <td>
                {Object.keys(session).length < 1
                  ? '...'
                  : session.tobelsoft.data.user.email}
              </td>
            </tr>
            <tr>
              <td>Terdaftar sejak</td>
              <td>
                {moment(
                  Object.keys(session).length < 1
                    ? 0
                    : session.tobelsoft.data.user.created * 1000
                )
                  .tz('Asia/Jakarta')
                  .format('dddd, DD MMM YYYY')}
              </td>
            </tr>
            <tr>
              <td>IP</td>
              <td>
                {Object.keys(session).length < 1
                  ? '...'
                  : session.tobelsoft.data.user.ip}
              </td>
            </tr>
          </table>
          <Divider className="separator" />
          <table>
            <tr>
              <td>Mesin</td>
              <td>
                {Object.keys(session).length < 1 ? '...' : session.MACHINE_ID}
              </td>
            </tr>
            <tr>
              <td>Sisa waktu</td>
              <td>
                {Object.keys(session).length < 1
                  ? '...'
                  : session.tobelsoft.data.remaining}
              </td>
            </tr>
            <tr>
              <td>Terdaftar</td>
              <td>
                {moment(
                  Object.keys(session).length < 1
                    ? 0
                    : session.tobelsoft.data.created * 1000
                )
                  .tz('Asia/Jakarta')
                  .format('dddd, DD MMM YYYY')}
              </td>
            </tr>
            <tr>
              <td>Kadaluarsa</td>
              <td>
                {moment(
                  Object.keys(session).length < 1
                    ? 0
                    : session.tobelsoft.data.expired * 1000
                )
                  .tz('Asia/Jakarta')
                  .format('dddd, DD MMM YYYY')}
              </td>
            </tr>
          </table>
        </Card>
      </div>
    </div>
  );
}
