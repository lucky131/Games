export default {
  data(){
    return{
      data_city: [
        {name: '北京', value: 5, list:
            [
              '秦江丹：读研',
              '严曦冉：读研',
              '刘勇：读研',
              'C+P：读研',
              'lyh：不读研的我表示很紧张'
            ]
        },
        {name: '天津', value: 0, list: []},
        {name: '上海', value: 4, list:
            [
              '杨乐：卖车',
              '刘伟棠：读研',
              '一凡：搬砖',
              '汤海贝：就业'
            ]
        },
        {name: '重庆', value: 0, list: []},
        {name: '河北', value: 0, list: []},
        {name: '河南', value: 0, list: []},
        {name: '云南', value: 0, list: []},
        {name: '辽宁', value: 0, list: []},
        {name: '黑龙江', value: 0, list: []},
        {name: '湖南', value: 0, list: []},
        {name: '安徽', value: 0, list: []},
        {name: '山东', value: 1, list:
            [
              '吕豪剑：读研'
            ]
        },
        {name: '新疆', value: 0, list: []},
        {name: '江苏', value: 1, list:
            [
              '李云：读研'
            ]
        },
        {name: '浙江', value: 17, list:
            [
              '亦哲：进化中...',
              'cx：读研',
              '宇城：读研',
              '夏琦琦：就业',
              '何菲：就业',
              '阿花：读研',
              '张婷：就业',
              '叶绿：就业',
              '柳卫英：建筑狗',
              '杨佳：就业',
              '煎饼：读研',
              '徐欣韵：读研',
              '钟冰玲：造假药',
              '叶庆龙：程序猿',
              '方惠玲：就业',
              '叶余晔：读研',
              '一哥：就业'
            ]
        },
        {name: '江西', value: 0, list: []},
        {name: '湖北', value: 1, list:
            [
              '国昌：读研'
            ]
        },
        {name: '广西', value: 0, list: []},
        {name: '甘肃', value: 0, list: []},
        {name: '山西', value: 0, list: []},
        {name: '内蒙古', value: 0, list: []},
        {name: '陕西', value: 0, list: []},
        {name: '吉林', value: 1, list:
            [
              '教皇：硕博！'
            ]
        },
        {name: '福建', value: 0, list: []},
        {name: '贵州', value: 0, list: []},
        {name: '广东', value: 1, list:
            [
              '虞诗雅：读博！'
            ]
        },
        {name: '青海', value: 0, list: []},
        {name: '西藏', value: 0, list: []},
        {name: '四川', value: 0, list: []},
        {name: '宁夏', value: 0, list: []},
        {name: '海南', value: 0, list: []},
        {name: '台湾', value: 0, list: []},
        {name: '香港', value: 0, list: []},
        {name: '澳门', value: 0, list: []},
        {name: '南海诸岛', value: 3, list:
            [
              '黄璐雅：法国',
              '邱雅琴：日本',
              '陈铭：英国'
            ]
        }
      ],
      data_pie: [
        {value: 14, name: '就业'},
        {value: 14, name: '读研'},
        {value: 2, name: '读博'},
        {value: 3, name: '出国'},
        {value: 1, name: '其他'}
      ],
      data_person: [
        {name: '徐亦哲', where: '陕西西安', what: '转型中'},
        {name: '秦江丹', where: '北京', what: '读研'},
        {name: '陈鑫', where: '浙江杭州', what: '读研'},
        {name: '杨乐', where: '上海', what: '就业'},
        {name: '叶宇城', where: '浙江金华', what: '读研'},
        {name: '刘伟棠', where: '上海', what: '读研'},
        {name: '蓝珍', where: '', what: ''},
        {name: '夏一凡', where: '上海', what: '就业'},
        {name: '夏琦琦', where: '浙江杭州', what: '就业'},
        {name: '蓝轶轲', where: '浙江杭州', what: '读研'},
        {name: '何菲', where: '浙江嘉兴', what: '就业'},
        {name: '林子傲', where: '', what: ''},
        {name: '陈宏', where: '', what: ''},
        {name: '张婷', where: '浙江丽水', what: '就业'},
        {name: '黄杰涛', where: '吉林长春', what: '硕博！'},
        {name: '严曦冉', where: '北京', what: '读研'},
        {name: '黄璐雅', where: '法国', what: '留学'},
        {name: '李云', where: '江苏南京', what: '读研'},
        {name: '绿叶', where: '浙江杭州', what: '就业'},
        {name: '邱雅琴', where: '日本', what: '留学'},
        {name: '汤海贝', where: '上海', what: '就业'},
        {name: '柳卫英', where: '浙江杭州', what: '建筑狗'},
        {name: '杨佳', where: '浙江杭州', what: '就业'},
        {name: '刘勇', where: '北京', what: '读研'},
        {name: '王建斌', where: '浙江杭州', what: '读研'},
        {name: '林宇飞', where: '', what: ''},
        {name: '陈铭', where: '英国', what: '留学'},
        {name: '徐欣韵', where: '浙江杭州', what: '读研'},
        {name: '钟冰玲', where: '浙江杭州', what: '就业'},
        {name: '虞诗雅', where: '广东深圳', what: '读博！'},
        {name: '梅子康', where: '', what: ''},
        {name: '陈加棚', where: '北京', what: '读研'},
        {name: '李宇豪', where: '北京', what: '写代码'},
        {name: '赖俊宇', where: '', what: ''},
        {name: '叶庆龙', where: '浙江杭州', what: '和上上条一样'},
        {name: '方惠玲', where: '浙江杭州', what: '就业'},
        {name: '何国昌', where: '湖北武汉', what: '读研'},
        {name: '叶余桦', where: '浙江杭州', what: '读研'},
        {name: '徐铭远', where: '浙江丽水', what: '就业'},
        {name: '程琼莹', where: '', what: ''},
        {name: '吕豪剑', where: '山东济南', what: '读研'}
      ],
    }
  }
};
