import RandomNumberofRange from './RandomNumberofRange';

export function SingleMarkupHarga(row, profile) {
  return singleRowMarkup(row, profile);
}

const singleRowMarkup = (rowData, profile) => {
  rowData.price = parseInt(rowData.price);
  rowData.original_price = rowData.price;
  var perkiraan_minimal = undefined;
  var perkiraan_maksimal = undefined;

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
      perkiraan_minimal =
        rowData.original_price +
        parseInt(
          rumus.type == '%'
            ? getValueOfPercentage(
                parseInt(rowData.original_price),
                parseInt(rumus.increase.range.from)
              )
            : parseInt(rumus.increase.range.from)
        );

      perkiraan_maksimal =
        rowData.original_price +
        parseInt(
          rumus.type == '%'
            ? getValueOfPercentage(
                parseInt(rowData.original_price),
                parseInt(rumus.increase.range.to)
              )
            : parseInt(rumus.increase.range.to)
        );

      break;
    }
  }

  // * Penerapan harga tambahan
  rowData.price += parseInt(profile.additional_price);
  // * Penerapan pembulatan
  rowData.price = round(rowData.price, profile.pembulatan);
  rowData.perkiraan_minimal = round(
    perkiraan_minimal + parseInt(profile.additional_price),
    profile.pembulatan
  );
  rowData.perkiraan_maksimal = round(
    perkiraan_maksimal + parseInt(profile.additional_price),
    profile.pembulatan
  );
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
  return parseInt((parseInt(price) * parseInt(increase)) / 100);
}

function round(from, num) {
  var resto = from % num;
  if (resto <= num / 2) {
    return from - resto;
  } else {
    return from + num - resto;
  }
}
