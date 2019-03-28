export default {
  data(){
    return{
      whereMap: [
        "北京", "天津", "上海", "重庆", "河北",    // 0  1  2  3  4
        "河南", "云南", "辽宁", "黑龙江", "湖南",  // 5  6  7  8  9
        "安徽", "山东", "新疆", "江苏", "浙江",    //10 11 12 13 14
        "江西", "湖北", "广西", "甘肃", "山西",    //15 16 17 18 19
        "内蒙古", "陕西", "吉林", "福建", "贵州",  //20 21 22 23 24
        "广东", "青海", "西藏", "四川", "宁夏",    //25 26 27 28 29
        "海南", "台湾", "香港", "澳门", "南海诸岛" //30 31 32 33 34
      ],
      whatMap: [
        "就业",  //0
        "读研",  //1
        "读博",  //2
        "出国",  //3
        "其他"   //4
      ],
      data: [
        {name: '徐亦哲', where: '浙江杭州', what: '读研', whereIndex: 14, whatIndex: 1},
        {name: '秦江丹', where: '北京', what: '读研', whereIndex: 0, whatIndex: 1},
        {name: '陈鑫', where: '浙江杭州', what: '读研', whereIndex: 14, whatIndex: 1},
        {name: '杨乐', where: '上海', what: '就业', whereIndex: 2, whatIndex: 0},
        {name: '叶宇城', where: '浙江金华', what: '读研', whereIndex: 14, whatIndex: 0},
        {name: '刘伟棠', where: '上海', what: '读研', whereIndex: 2, whatIndex: 1},
        {name: '蓝珍', where: '', what: '', whereIndex: -1, whatIndex: -1},
        {name: '夏一凡', where: '浙江丽水', what: '转型中', whereIndex: 14, whatIndex: 4},
        {name: '夏琦琦', where: '浙江杭州', what: '就业', whereIndex: 14, whatIndex: 0},
        {name: '蓝轶轲', where: '浙江杭州', what: '读研', whereIndex: 14, whatIndex: 1},
        {name: '何菲', where: '浙江嘉兴', what: '就业', whereIndex: 14, whatIndex: 0},
        {name: '林子傲', where: '', what: '', whereIndex: -1, whatIndex: -1},
        {name: '陈宏', where: '', what: '', whereIndex: -1, whatIndex: -1},
        {name: '张婷', where: '浙江丽水', what: '就业', whereIndex: 14, whatIndex: 0},
        {name: '黄杰涛', where: '吉林长春', what: '硕博！', whereIndex: 22, whatIndex: 2},
        {name: '严曦冉', where: '北京', what: '读研', whereIndex: 0, whatIndex: 1},
        {name: '黄璐雅', where: '法国', what: '留学', whereIndex: 34, whatIndex: 3},
        {name: '李云', where: '江苏南京', what: '读研', whereIndex: 13, whatIndex: 1},
        {name: '绿叶', where: '浙江杭州', what: '就业', whereIndex: 14, whatIndex: 0},
        {name: '邱雅琴', where: '日本', what: '留学', whereIndex: 34, whatIndex: 3},
        {name: '汤海贝', where: '上海', what: '就业', whereIndex: 2, whatIndex: 0},
        {name: '柳卫英', where: '浙江杭州', what: '建筑狗', whereIndex: 14, whatIndex: 0},
        {name: '杨佳', where: '浙江杭州', what: '就业', whereIndex: 14, whatIndex: 0},
        {name: '刘勇', where: '北京', what: '读研', whereIndex: 0, whatIndex: 1},
        {name: '王建斌', where: '浙江杭州', what: '读研', whereIndex: 14, whatIndex: 1},
        {name: '林宇飞', where: '', what: '', whereIndex: -1, whatIndex: -1},
        {name: '陈铭', where: '英国', what: '留学', whereIndex: 34, whatIndex: 3},
        {name: '徐欣韵', where: '浙江杭州', what: '读研', whereIndex: 14, whatIndex: 1},
        {name: '钟冰玲', where: '浙江杭州', what: '就业', whereIndex: 14, whatIndex: 0},
        {name: '虞诗雅', where: '广东深圳', what: '读博！', whereIndex: 25, whatIndex: 2},
        {name: '梅子康', where: '', what: '', whereIndex: -1, whatIndex: -1},
        {name: '陈加棚', where: '北京', what: '读研', whereIndex: 0, whatIndex: 1},
        {name: '李宇豪', where: '浙江杭州', what: '写代码', whereIndex: 14, whatIndex: 0},
        {name: '赖俊宇', where: '广东', what: '就业', whereIndex: 25, whatIndex: 0},
        {name: '叶庆龙', where: '浙江杭州', what: '写代码', whereIndex: 14, whatIndex: 0},
        {name: '方惠玲', where: '浙江杭州', what: '就业', whereIndex: 14, whatIndex: 0},
        {name: '何国昌', where: '湖北武汉', what: '读研', whereIndex: 16, whatIndex: 1},
        {name: '叶余桦', where: '浙江杭州', what: '读研', whereIndex: 14, whatIndex: 1},
        {name: '徐铭远', where: '浙江丽水', what: '就业', whereIndex: 14, whatIndex: 0},
        {name: '程琼莹', where: '', what: '', whereIndex: -1, whatIndex: -1},
        {name: '吕豪剑', where: '山东济南', what: '读研', whereIndex: 11, whatIndex: 1}
      ],
    }
  }
};
