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

export function getRandomSeeker(gender = 0, minAbility = 10, averageSalary) {
  //性别
  if(gender === 0){
    gender = Math.ceil(Math.random() * 2); //1男 2女
  }

  //姓名
  let lastNames = "赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐费廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮卞齐康伍余元卜顾孟平黄和穆萧尹姚邵湛汪祁毛禹狄米贝明臧计伏成戴谈宋茅庞熊纪舒屈项祝董梁杜阮蓝闵席季麻强贾路娄危江童颜郭梅盛林刁钟徐邱骆高夏蔡田樊胡凌霍";
  let boys = "伟刚勇毅俊峰强军平保东文辉力明永健世广志义兴良海山仁波宁贵福生龙元全国胜学祥才发武新利清飞彬富顺信子杰涛昌成康星光天达安岩中茂进林有坚和彪博诚先敬震振壮会思群豪心邦承乐绍功松善厚庆磊民友裕河哲江超浩亮政谦亨奇固之轮翰朗伯宏言若鸣朋斌梁栋维启克伦翔旭鹏泽晨辰士以建家致树炎德行时泰盛雄琛钧冠策腾楠榕风航弘宇";
  let girls = "秀娟英华慧巧美娜静淑惠珠翠雅芝玉萍红娥玲芬芳燕彩春菊兰凤洁梅琳素云莲真环雪荣爱妹霞香月莺媛艳瑞凡佳嘉琼勤珍贞莉桂娣叶璧璐娅琦晶妍茜秋珊莎锦黛青倩婷姣婉娴瑾颖露瑶怡婵雁蓓纨仪荷丹蓉眉君琴蕊薇菁梦岚苑婕馨瑗琰韵融园艺咏卿聪澜纯毓悦昭冰爽琬茗羽希宁欣飘育滢馥筠柔竹霭凝晓欢霄枫芸菲寒伊亚宜可姬舒影荔枝思丽";

  let lastName = lastNames.charAt(Math.floor(Math.random() * lastNames.length));
  let firstName = "";
  let length = Math.random() < 0.33 ? 1 : 2; //33%几率单名 剩下为双名
  for(let i = 0; i < length; i++){
    firstName += gender === 1 ?
      boys.charAt(Math.floor(Math.random() * boys.length)) :
      girls.charAt(Math.floor(Math.random() * girls.length));
  }

  //单名有10%几率变为ABB形式
  if(length === 1 && Math.random() < 0.1){
    firstName += firstName[0];
  }

  //年龄
  let age = Math.floor(Math.random() * 20) + 18;  //18-37

  //能力
  minAbility = Math.min(minAbility, 100);
  let ability = Math.floor(Math.random() * (101 - minAbility)) + minAbility; //10-100

  //期望日薪
  let expectSalary = Math.round(averageSalary *
    (ability/90+1.5-10/9) * //能力因素 10-100 0.5-1.5
    (age*0.7/19+1.5-0.7/19*37) * //年龄因素 18-37 0.8-1.5
    (Math.random() * 0.5 + 0.75)); //随机因素 0.75-1.25

  return {
    name: lastName + firstName,
    gender,
    age,
    ability,
    expectSalary
  }
}
