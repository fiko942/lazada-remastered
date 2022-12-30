import List from './List';
import './index.scss';
import { useEffect, useState } from 'react';
import Nothing from './Nothing';
import Loading from './Loading';
import Data from './Data';
import ExportTemplate from './ExportTemplate';
import { CircularProgress } from '@mui/material';

export default function index() {
  const [selected, setSelected] = useState([]);
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataShow, setDataShow] = useState(false);
  const [data, setData] = useState([]);
  const [showOpt, setShowOpt] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState([]);
  const [exportTemplateOpen, setExportTemplateOpen] = useState(false);

  const [cdnLoading, setCdnLoading] = useState(false);
  const [cdnProgress, setCdnProgress] = useState({ processed: 0, total: 0 });

  // * Listen collection event state
  function ListenCollectionEvenmtState() {
    return window.electron.ipcRenderer.once('collection state', (state) => {
      setCdnLoading(state.cdn_processing);
      setCdnProgress({
        processed: state.cdn_progress.processed,
        total: state.cdn_progress.total,
      });

      return ListenCollectionEvenmtState();
    });
  }
  // ! Listen collection event state

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get collection state');
    ListenCollectionEvenmtState();
    return () => {
      // Destroy data after the page is not used
      setData([]);
    };
  }, []);

  const handleExportTemplateClose = () => setExportTemplateOpen(false);
  const handleExportTemplateOpen = () => setExportTemplateOpen(true);

  useEffect(() => {
    setShowOpt(selected.length > 0);
  }, [selected]);

  const handleExport = (collections) => {
    setSelectedCollection(collections);
    handleExportTemplateOpen();
  };

  const handleCollectionOpen = (col) => {
    setLoading(true);
    setOpened(false);
    setDataShow(false);
    window.electron.ipcRenderer.once('collection data', (d) => {
      setData(d);
      setLoading(false);
      setOpened(true);
      setDataShow(true);
    });
    window.electron.ipcRenderer.sendMessage('get collection data', col.path);
  };
  const handleSelectedChange = (data) => setSelected(data);

  const handleExportTemplatAsli = () => {
    setExportTemplateOpen(false);
    window.electron.ipcRenderer.sendMessage('export collection', {
      custom_template: false,
      collections: selectedCollection,
    });
  };

  const handleExportTemplateCustom = () => {
    setExportTemplateOpen(false);
    window.electron.ipcRenderer.sendMessage('export collection', {
      custom_template: true,
      collections: selectedCollection,
    });
  };

  return (
    <div className="dashboard__collection">
      <List
        onExport={handleExport.bind(this)}
        onCollectionOpen={handleCollectionOpen.bind(this)}
        onSelectedChange={handleSelectedChange.bind(this)}
        showOpt={showOpt}
      />
      <div className="data-container">
        {!opened && <Nothing />}
        {loading && <Loading />}
        {dataShow && <Data data={data} />}
      </div>
      {exportTemplateOpen && (
        <ExportTemplate
          onClose={handleExportTemplateClose}
          onExportTemplatAsli={handleExportTemplatAsli.bind(this)}
          onExportCustomTemplate={handleExportTemplateCustom.bind(this)}
        />
      )}
      {cdnLoading && (
        <div className="cdn-loading">
          <div
            className="bar"
            style={{
              background: '#FF5722',
              width: `${(cdnProgress.processed / cdnProgress.total) * 100}%`,
            }}
          ></div>
          <div className="flex">
            <CircularProgress size="20px" />
            <p>
              Sedang memindahkan ke CDN [{cdnProgress.processed}/
              {cdnProgress.total}]
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
