import RandomNumberofRange from './RandomNumberofRange';

export default function MarkupHarga(collection, profile) {
  var data = collection;
  for (let r = 0; r < data.length; r++) {
    // * Row data looping
    for (var rumus of profile.rumus) {
      if (data[r].price <= rumus.to && data[r].price >= rumus.from) {
        const rangeVal = RandomNumberofRange(
          rumus.increase.range.from,
          rumus.increase.range.to
        );
        const newPrice =
          rumus.type == '%'
            ? getValueOfPercentage(data[r].price, rangeVal)
            : data[r].price + rangeVal;
        data[r].price = newPrice;
      }
    }

    // * Penerapan harga tambahan
    data[r].price += profile.additional_price;
    // * Penerapan pembulatan
    data[r].price = data[r].price.roundTo(profile.pembulatan);
  }
  return data;
}

function getValueOfPercentage(price, increase) {
  return (price * increase) / 100;
}

Number.prototype.roundTo = function (num) {
  var resto = this % num;
  if (resto <= num / 2) {
    return this - resto;
  } else {
    return this + num - resto;
  }
};
