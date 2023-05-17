export default function getProvinceCode(province) {
  let provinceNameMap = {
      GT:'Gauteng',
      MP:'Mpumalanga',
      LM:'Limpopo',
      NW:'North West',
      FS:'Free State',
      KZ:'KwaZulu Natal',
      EC:'Eastern Cape',
      WC:'Western Cape',
      NC:'Northern Cape',
      other:'Other country',
      none:'No province'
    };

  for (let p in provinceNameMap) {
    if (provinceNameMap[p] === province) {
      return p;
    }
  }
  return null;
}
