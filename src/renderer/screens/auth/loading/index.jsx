import './index.scss';
import AppDetail from '../app-detail';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Loading() {
  const navigate = useNavigate();
  const gotoUnregistered = (MACHINE_ID) => {
    navigate('/auth/unregistered?MACHINE_ID=' + MACHINE_ID);
  };

  useEffect(() => {
    window.electron.ipcRenderer.once('login device registered', () => {
      navigate('/dashboard/dashboard');
    });
    window.electron.ipcRenderer.once(
      'login device unregistered',
      (MACHINE_ID) => gotoUnregistered(MACHINE_ID)
    );
    window.electron.ipcRenderer.once('login device error', (data) => {
      navigate('/auth/error?MESSAGE=' + data.message);
    });
    window.electron.ipcRenderer.sendMessage('login device');
  }, []);

  return (
    <div className="auth--loading">
      {/* Loading animation */}
      <div id="totalbase">
        <div id="animbase">
          <div id="base">
            <div id="baseshadow"></div>
            <div className="helitop">
              <div className="wingbase">
                <div className="col1"></div>
                <div className="col2"></div>
                <div className="col3"></div>
                <div className="col4"></div>
                <div className="wing1"></div>
                <div className="wing2"></div>
              </div>
            </div>
            <div className="helifront">
              <div className="tailbase">
                <div className="tail1">
                  <div className="tail21"></div>
                  <div className="tail22"></div>
                  <div className="tail23"></div>
                  <div className="tail24">
                    <div className="tailwingbase">
                      <div className="tail221"></div>
                      <div className="tail222"></div>
                      <div className="tail223"></div>
                      <div className="tail224"></div>
                      <div className="tailwing1"></div>
                      <div className="tailwing2"></div>
                    </div>
                  </div>
                </div>
                <div className="tail25"></div>
                <div className="tail26"></div>
              </div>
            </div>
            <div className="heliback">
              <div className="front1"></div>
              <div className="front2"></div>
              <div className="front3"></div>
              <div className="front4"></div>
              <div className="front5"></div>
            </div>
            <div className="helileft"></div>
            <div className="heliright"></div>
            <div className="helibottom"></div>
          </div>
        </div>
        <div id="towerbase">
          <div id="talkbubble" align="center">
            Silahkan tunggu beberapa saat lagi, kami sedang mengautentikasi
            perangkat anda.
          </div>
          <div className="tower1left"></div>
          <div className="tower1right"></div>
          <div className="tower2right">
            <div className="tower1window"></div>
          </div>
          <div className="tower1top">
            <div className="front1">
              <div className="col1"></div>
              <div className="col2"></div>
              <div className="col3"></div>
              <div className="col4"></div>
            </div>
            <div className="front2"></div>
            <div className="front3"></div>
          </div>
          <div className="tower2top"></div>
          <div className="tower2left">
            <div className="tower2window"></div>
          </div>
        </div>
      </div>
      {/* End of loading animation */}
      <AppDetail />
    </div>
  );
}
