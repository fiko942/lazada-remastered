import RandomNumberofRange from './RandomNumberofRange';

export function SingleMarkupHarga(row, profile) {
  return singleRowMarkup(row, profile);
}

const singleRowMarkup = (rowData, profile) => {
  rowData.price = parseInt(rowData.price);
  console.log('Harga lama: ', rowData.price);
  for (var rumus of profile.rumus) {
    if (rowData.price <= rumus.to && rowData.price >= rumus.from) {
      const rangeVal = parseInt(
        RandomNumberofRange(
          parseInt(rumus.increase.range.from),
          parseInt(rumus.increase.range.to)
        )
      );
      const newPrice = parseInt(
        rumus.type == '%'
          ? getValueOfPercentage(parseInt(rowData.price), parseInt(rangeVal))
          : rangeVal
      );

      rowData.price += parseInt(newPrice);
    }
  }

  // * Penerapan harga tambahan
  rowData.price += parseInt(profile.additional_price);
  // * Penerapan pembulatan
  rowData.price = round(rowData.price, profile.pembulatan);
  console.log('Harga baru: ', rowData.price);
  return rowData;
};

export default function MarkupHarga(collection, profile) {
  var data = collection;
  for (let r = 0; r < data.length; r++) {
    // * Row data looping
    data[r] = singleRowMarkup(data[r], profile);
  }
  return data;
}

function getValueOfPercentage(price, increase) {
  return (parseInt(price) * parseInt(increase)) / 100;
}

function round(from, num) {
  var resto = from % num;
  if (resto <= num / 2) {
    return from - resto;
  } else {
    return from + num - resto;
  }
}
