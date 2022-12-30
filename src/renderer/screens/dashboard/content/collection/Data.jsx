import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

function formatRupiah(angka, prefix) {
  var number_string = angka.replace(/[^,\d]/g, '').toString(),
    split = number_string.split(','),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/gi),
    separator = '';

  // tambahkan titik jika yang di input sudah menjadi angka ribuan
  if (ribuan) {
    separator = sisa ? '.' : '';
    rupiah += separator + ribuan.join('.');
  }

  rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
  return prefix == undefined ? rupiah : rupiah ? 'Rp. ' + rupiah : '';
}

export default function Data(args) {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = React.useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    var d = [...data];
    d = d.filter(
      (x) =>
        typeof x.title != 'undefined' &&
        x.title.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredData(d);
  }, [filterText, data]);

  const subHeaderComponentMemo = React.useMemo(() => {
    return (
      <TextField
        variant="outlined"
        label="Cari"
        size="small"
        onChange={(e) => setFilterText(e.target.value)}
        sx={{ marginTop: 2, marginBottom: 0 }}
      />
    );
  }, [filterText]);
  useEffect(() => {
    setData(args.data);
  }, [args.data]);

  const columns = [
    {
      name: 'Barang',
      selector: (row) => row.title,
      format: (row) =>
        (row.title.length > 30
          ? row.title.slice(0, 30) + ' ...'
          : row.title
        ).trim(),
    },
    {
      name: 'Deskripsi',
      selector: (row) => row.description,
      format: (row) =>
        (row.description.length > 30
          ? row.description.slice(0, 30) + ' ...'
          : row.description
        ).trim(),
    },
    {
      name: 'Harga',
      selector: (row) => row.price,
      format: (row) => formatRupiah(row.price.toString(), 'Rp. '),
      sortable: true,
    },
  ];

  useEffect(() => {
    return () => {
      setData([]);
    };
  }, []);

  return (
    <div className="data">
      <DataTable
        className="table-container"
        data={filteredData}
        columns={columns}
        pagination
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        expandableRows
        expandableRowsComponent={ExpandedComponent}
      />
    </div>
  );
}

function ExpandedComponent({ data }) {
  return (
    <div className="expanded-element">
      <div className="title">{data.title}</div>
      <p className="description">{data.description}</p>
      <div className="images">
        {data.images.map((image, index) => (
          <img src={image} draggable={false} className="image" />
        ))}
      </div>
    </div>
  );
}
