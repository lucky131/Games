<template>
  <div class="wrap">
    <div id="map" class="block" :style="{height: height+'px'}"></div>
    <div id="gradient1" class="gradient"></div>
    <div id="pie" class="block" :style="{height: height+'px'}"></div>
    <div id="gradient2" class="gradient"></div>
    <div id="table">
      <el-table :data="data" stripe @row-click="rowClick"
                :header-cell-style='{textAlign: "center"}'
                :cell-style='{textAlign: "center"}'>
        <el-table-column label="Who" prop="name"></el-table-column>
        <el-table-column label="Where">
          <template slot-scope="scope">
            <span v-if="scope.row.where">{{scope.row.where}}</span>
            <span v-else class="red">暂无数据</span>
          </template>
        </el-table-column>
        <el-table-column label="What">
          <template slot-scope="scope">
            <span v-if="scope.row.what">{{scope.row.what}}</span>
            <span v-else class="red">暂无数据</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="info">以上个人数据若有变更或者需要补充的，请联系lyh，祝早日团圆♥</div>
    <div class="footer">
      <span @click="showInfo()">— 下面没有了 —</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .wrap{
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-content: center;
    .block{
      width: 100%;
    }
    #table{
      width: 100%;
      padding: 20px 10px 0;
      box-sizing: border-box;
      .red{
        color: red;
      }
    }
    .gradient{
      width: 100%;
      height: 60px;
    }
    #gradient1{
      background: linear-gradient(#555, #aaa);
    }
    #gradient2{
      background: linear-gradient(#aaa, #fff);
    }
    .info{
      margin: 40px 0 10px;
      text-align: center;
      color: #999;
      font-size: 14px;
      font-weight: bold;
    }
    .footer{
      text-align: center;
      font-size: 12px;
      font-weight: bold;
      color: #999;
      margin: 0 auto 10px;
      cursor: pointer;
    }
  }
</style>

<script>
  import allData from "./data.js"
  import "echarts/map/js/china.js"
  export default {
    name: "graduate",
    data(){
      return{
        height: 0,
        egg: 0,
      }
    },
    mixins: [allData],
    created(){
      document.title = "最近更新3/28 17:57";
    },
    mounted(){
      window.vuethis = this;

      this.height = window.innerHeight;

      let echarts = require('echarts');

      this.$nextTick(() => {
        let myChart1 = echarts.init(document.getElementById('map'));
        myChart1.setOption({
          title: {
            text: '地图可缩放 下面还有哦',
            link: 'javascript: vuethis.showInfo();',
            target: 'self',
            textStyle: {
              color: '#888',
              fontSize: 12,
              fontWeight: 'bold',
              textBorderColor: '#555',
              textBorderWidth: 1,
              textShadowColor: '#555',
              textShadowBlur: 5
            },
            bottom: 0,
            left: 'center'
          },
          backgroundColor: '#555',
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              if(params.data.name=='台湾') return '台湾自古以来就是中国不可分割的<br>一部分领土，神圣不可侵犯 `^`';
              if(params.data.name=='新疆') return '大西北扶持了解一下';
              if(params.data.name=='西藏') return '应该没人会去这吧';
              if(params.data.name=='内蒙古') return '这就是你爱上一匹野马的理由？';
              if(params.data.name=='青海') return '你为啥要看这里';
              if(params.data.name=='陕西') return '知道亦哲为什么要离开这里吗？';
              if(params.data.name=='黑龙江') return '看！那有一小块也属于我！';
              if(params.data.name=='香港') return '香港在这呢，接下来你要找澳门对吧';
              if(params.data.name=='澳门') return '为了找个彩蛋你也是蛮拼的';
              var res;
              if(params.data.name=='南海诸岛') res = '海外';
              else res = params.data.name;
              res += ': ' + params.data.value + '人<br>';
              for(let i=0;i<params.data.list.length;i++){
                res += params.data.list[i] + '<br>';
              }
              return res;
            },
            padding: [10],
            confine: true,
            extraCssText: 'box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);'
          },
          visualMap: {
            min: 0,
            max: 8,
            calculable: false,
            inRange: {
              //color: ['#646a7d', '#bbb931', '#ed3d3d']
              color: ['#888', '#d5d11b', '#f49408', '#e93022']
            },
            //text: ['15', '0'],
            textStyle: {
              color: '#fff'
            }
          },
          series: [{
            name: 'namehere',
            type: 'map',
            roam: true,
            map: 'china',
            scaleLimit: {
              min: 1,
              max: 15
            },
            itemStyle:{
              normal:{
                label:{
                  show: false,
                  position: ['50%', '50%'],
                  color: '#333'
                },
                borderColor: 'rgba(0,0,0,.3325)'
              },
              emphasis:{
                label:{show:false}
              }
            },
            data: this.getCityData()
          }]
        });

        let myChart3 = echarts.init(document.getElementById('pie'));
        myChart3.setOption({
          title: {
            text: '读研 vs 就业',
            link: 'javascript: vuethis.showInfo();',
            target: 'self',
            textStyle: {
              color: '#666',
              fontSize: 12,
              fontWeight: 'bold'
            },
            bottom: 0,
            left: 'center'
          },
          backgroundColor: '#aaa',
          tooltip : {
            trigger: 'item',
            formatter: "{b} : {c}人 ({d}%)"
          },
          legend: {
            orient: 'vertical',
            top: 'middle',
            left: 'left',
            data: ['就业','读研','读博','出国','其他'],
            inactiveColor: '#666'
          },
          series : [
            {
              name: '去向分布',
              type: 'pie',
              radius : ['30%', '55%'],
              center: ['60%', '50%'],
              avoidLabelOverlap: false,
              hoverOffset: 13,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              data: this.getPieData(),
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        });
      });
    },
    methods: {
      getCityData(){
        return this.whereMap.map((cityName, index) => {
          let list = [];
          this.data.forEach(n => {
            if(n.whereIndex === index){
              list.push(`${n.name}：${n.what}`);
            }
          });
          return {name: cityName, value: list.length, list: list};
        });
      },
      getPieData(){
        return this.whatMap.map((whatName, index) => {
          return {value: this.data.filter(n => n.whatIndex === index).length, name: whatName};
        });
      },
      rowClick(row){
        if(row.name === "李宇豪"){
          this.egg++;
          switch (this.egg){
            case 1:
              alert("点我干啥？");
              break;
            case 2:
              alert("你还点？");
              break;
            case 3:
              alert("你再点一遍试试？");
              break;
            case 4:
              alert("...");
              break;
            case 5:
              alert("你再点三遍试试？");
              break;
            case 8:
              alert("你再点十遍试试？");
              break;
            case 18:
              alert("好吧彩蛋就这么多，之后没了");
              break;
            case 30:
              alert("你这人怎么不听劝呢？");
              break;
            case 50:
              alert("...真的没了");
              break;
            case 100:
              alert("你都点了100遍了，你是不是喜欢我？");
              break;
            case 200:
              alert("你他娘的还真是个人才");
              break;
            case 500:
              alert("五百年了！");
              break;
            case 1000:
              alert("达成成就：鼠标破坏者");
              break;
            default:
              break;
          }
        }
      },
      showInfo(){
        alert(`一名程序猿的留言：
        1. pc端浏览效果更佳哦ovo
        2. 海外的同学放在了南海诸岛，点不到只能说明你手指粗
        3. 这个页面比当年那个图片版本强多了吧233
        4. 持续更新的哦，所以如果你的信息改变了就联系我吧
        5. 此页面没有彩蛋
        6. 广告位出租`);
      }
    }
  }
</script>
