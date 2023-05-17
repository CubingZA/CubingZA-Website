export default function getProvinceCode(province) {
  let provinceNames = {
      GT:'Gauteng',
      MP:'Mpumalanga',
      LM:'Limpopo',
      NW:'North West',
      FS:'Free State',
      KZ:'KwaZulu Natal',
      EC:'Eastern Cape',
      WC:'Western Cape',
      NC:'Northern Cape'
    };

  for (let p in provinceNames) {
    if (provinceNames[p] === province) {
      return p;
    }
  }
  return null;
}
