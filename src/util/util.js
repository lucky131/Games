export function formatHardDiskSize(size) {
  //size单位为M
  if(size < 1024) return size + "M";
  if(size < 1024*1024) return Math.round(size / 1024 * 100) / 100 + "G";
  return Math.round(size / 1024 / 1024 * 100) / 100 + "T";
}

export function formatIntegerNumber(number, mode = 0) {
  //0: -1233884466
  //1: -1,233,884,466
  //2: 负12亿3388万4466
  //3: -12.34亿
  let n = parseInt(number);
  if(n === 0) return "0";
  let s = n + "";
  let flag = n >= 0;
  n = Math.abs(n);
  switch (mode) {
    case 0:
      return s;
    case 1:
      return s.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    case 2:
      let s1 = Math.floor(n/100000000);
      let s2 = Math.floor(n%100000000/10000);
      let s3 = n%10000;
      return (flag ? "" : "负") + (s1 !== 0 ? s1 + "亿" : "") + (s2 !== 0 ? s2 + "万" : "") + (s3 !== 0 ? s3 : "");
    case 3:
      let s4, unit;
      if(n < 10000){
        s4 = n;
        unit = "";
      } else if(n < 100000000){
        s4 = Math.round(n/10000*100)/100;
        unit = "万";
      } else {
        s4 = Math.round(n/100000000*100)/100;
        unit = "亿";
      }
      return (flag ? "" : "-") + s4 + unit;
  }
  return "";
}
