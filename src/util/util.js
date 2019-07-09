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
      let s1 = Math.floor(n/10000000000000000);
      let s2 = Math.floor(n%10000000000000000/1000000000000);
      let s3 = Math.floor(n%1000000000000/100000000);
      let s4 = Math.floor(n%100000000/10000);
      let s5 = n%10000;
      return (flag ? "" : "负")
        + (s1 !== 0 ? s1 + "亿亿" : "")
        + (s2 !== 0 ? s2 + "万亿" : "")
        + (s3 !== 0 ? s3 + "亿" : "")
        + (s4 !== 0 ? s4 + "万" : "")
        + (s5 !== 0 ? s5 : "");
    case 3:
      let ss, unit;
      if(n < 10000){
        ss = n;
        unit = "";
      } else if(n < 100000000){
        ss = Math.round(n/10000*100)/100;
        unit = "万";
      } else if (n < 1000000000000) {
        ss = Math.round(n/100000000*100)/100;
        unit = "亿";
      } else if (n < 10000000000000000) {
        ss = Math.round(n/1000000000000*100)/100;
        unit = "万亿";
      } else {
        ss = Math.round(n/10000000000000000*100)/100;
        unit = "亿亿";
      }
      return (flag ? "" : "-") + ss + unit;
  }
  return "";
}
