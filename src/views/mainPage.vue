<template>
  <div class="main-page">
    <div class="main-page-content">
      <div class="data-count-list-box">
        <div class="data-count-content">
          <div class="count-num-box"><span class="count-num">258</span>辆</div>
          <div class="data-count-title">车辆总数</div>
        </div>
        <div class="data-count-content">
          <div class="count-num-box"><span class="count-num">4</span>个</div>
          <div class="data-count-title">站端总数</div>
        </div>
        <div class="data-count-content">
          <div class="count-num-box"><span class="count-num">338</span>块</div>
          <div class="data-count-title">电池数量</div>
        </div>
        <div class="data-count-content">
          <div class="count-num-box"><span class="count-num">5019</span>万公里</div>
          <div class="data-count-title">总里程</div>
        </div>
        <div class="data-count-content">
          <div class="count-num-box"><span class="count-num">101256</span>块</div>
          <div class="data-count-title">更换总数</div>
        </div>
        <div class="data-count-content yellow-bg">
          <div class="count-num-box"><span class="count-num">1</span>个</div>
          <div class="data-count-title">充电告警</div>
        </div>
        <div class="data-count-content">
          <div class="count-num-box"><span class="count-num">0</span>个</div>
          <div class="data-count-title">站场告警</div>
        </div>
        <div class="data-count-content red-bg">
          <div class="count-num-box"><span class="count-num">1</span>个</div>
          <div class="data-count-title">电池告警</div>
        </div>
        <div class="data-count-content">
          <div class="count-num-box"><span class="count-num">0</span>个</div>
          <div class="data-count-title">防盗告警</div>
        </div>
      </div>
      <div class="bottom-chart-box">
        <div class="left-chart-box">
          <div class="left-top-chart-box" id="left-top-chart-box">
            <div class="chart-title-box">月换电趋势</div>
            <div class="pos"><svg-icon class="icon-color" :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="fullScreen('left-top-chart-box')" /></div>
            <div class="common-chart-box" id="month-change-trend"></div>
          </div>
          <div class="left-bottom-chart-box" id="left-bottom-chart-box">
            <div class="pos"><svg-icon class="icon-color" :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="fullScreen('left-bottom-chart-box')" /></div>
            <div class="chart-title-box">今日车辆运营情况</div>
            <div class="common-chart-box" id="day-car-operation"></div>
          </div>
        </div>
        <div class="center-map-box" id="center-map-box">
          <div class="pos"><svg-icon class="icon-color" :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="fullScreen('center-map-box')" /></div>
          <div class="map-title-box">站场分布情况</div>
          <div class="geo-map-title"><span v-for="(item,index) in geoMapName" :key="index" @click="changeGeoMap(item)">{{item}} <span v-if="geoMapName.length==2&&index==0"> -></span></span></div>
          <div class="map-content-box" id="center-map"></div>
        </div>
        <div class="right-chart-box">
          <div class="right-top-chart-box" id="right-chart-box">
            <div class="pos"><svg-icon class="icon-color" :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="fullScreen('right-chart-box')" /></div>
            <div class="chart-title-box">今日能耗</div>
            <div class="common-chart-box" id="day-energy">
              <div class="water-full-chart" id="day-energy1"></div>
              <div class="water-full-chart" id="day-energy2"></div>
            </div>
          </div>
          <div class="right-bottom-chart-box" id="right-bottom-chart-box">
            <div class="pos"><svg-icon class="icon-color" :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="fullScreen('right-bottom-chart-box')" /></div>
            <div class="chart-title-box">月营收分析</div>
            <div class="common-chart-box" id="month-money"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import echarts from 'echarts'
import '@/utils/echartt-liquidfill.js'
import '@/utils/mapJson';
import {province} from '@/utils/mapJson';
import screenfull from 'screenfull'
export default {
  name: 'mainPage',
  data() {
    return {
      monthData:['1','2','3','4','5','6','7','8','9','10','11','12'],
      //月换电趋势折线图
      monthChangeTrendObj:null,
      monthChangeTrendData:[1000,1250,1500,1400,1100,800,1450,1204,500],
      //月营收分析柱状图
      monthIncomeObj:null,
      monthIncomeData:[10,20,50,35,25,40,45,34,14,0,0,0],
      //电能利用率
      energyEfficiencyObj:null,
      energyEfficiencyData:125200,
      energyTotalObj:null,
      energyTotalData:145200,
      //今日车辆运营情况
      todayCarOperationObj:null,

      geoObj:null,
      mapName:'china',
      geoMapName:['中国'],
      mapData: [
        {name:"北京",value:0},
        {name:"天津",value:0},
        {name:"河北",value:0},
        {name:"山西",value:0},
        {name:"内蒙古",value:0},
        {name:"辽宁",value:0},
        {name:"吉林",value:0},
        {name:"黑龙江",value:0},
        {name:"上海",value:0},
        {name:"江苏",value:0},
        {name:"浙江",value:12},
        {name:"安徽",value:20},
        {name:"福建",value:0},
        {name:"江西",value:0},
        {name:"山东",value:0},
        {name:"河南",value:0},
        {name:"湖北",value:0},
        {name:"湖南",value:0},
        {name:"重庆",value:0},
        {name:"四川",value:0},
        {name:"贵州",value:0},
        {name:"云南",value:0},
        {name:"西藏",value:0},
        {name:"陕西",value:0},
        {name:"甘肃",value:0},
        {name:"青海",value:0},
        {name:"宁夏",value:0},
        {name:"新疆",value:0},
        {name:"广东",value:15},
        {name:"广西",value:20},
        {name:"海南",value:0},
      ],
      isFullscreen:false
    }
  },
  computed:{
    ...mapGetters(['sidebar']),
  },
  watch:{
    sidebar:{
      deep: true,
      handler(val) {
        setTimeout(()=>{
          this.monthChangeTrendObj.resize();
          this.monthIncomeObj.resize();
          this.energyEfficiencyObj.resize();
          this.energyTotalObj.resize();
          this.todayCarOperationObj.resize();
          this.geoObj.resize();
        },50)
      }
    }
  },
  methods: {
    //月换电趋势折线图
    monthChangeTrend(id,xData,data){
      if(this.monthChangeTrendObj){
        this.monthChangeTrendObj.dispose();
        this.monthChangeTrendObj = null
      }
      this.monthChangeTrendObj=echarts.init(document.getElementById(id));
      let option = {
        backgroundColor:"#101e44",
        grid: {
          left:10,
          right:30,
          top: 50,
          bottom:20,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(255,255,255,0)' // 0% 处的颜色
                }, {
                  offset: 0.5,
                  color: 'rgba(255,255,255,1)' // 100% 处的颜色
                }, {
                  offset: 1,
                  color: 'rgba(255,255,255,0)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
          },
        },
        xAxis: [{
          type: "category",
          name:'月',
          nameTextStyle: {
            color: "#3B71A1",
            fontSize: 12,
            padding:[10,0,0,-5],
            // lineHeight: 40
          },
          boundaryGap: false,
          axisLabel: {
            formatter: '{value}',
            fontSize:12,
            margin:10,
            textStyle: {
              color: "#3B71A1"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#243753"
            }
          },
          splitLine: {
            show:true,
            lineStyle: {
              color: "#243753"
            }
          },
          axisTick:{
            show:false
          },
          data: xData
        }],
        yAxis: [
          {
            boundaryGap:false,
            type: "value",
            axisLabel: {
              textStyle: {
                color: "#3B71A1"
              }
            },
            name:'辆',
            nameTextStyle: {
              color: "#3B71A1",
              fontSize: 12,
              padding:[0,30,0,0]
              // lineHeight: 40
            },
            splitLine: {
              lineStyle: {
                color: "#243753"
              }
            },
            axisLine: {
              show: true,
              lineStyle:{
                color:"#283352"
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [{
          name: "换电车辆",
          type: "line",
          smooth: true,
          showSymbol: true,
          symbolSize: 4,
          zlevel: 3,
          itemStyle:{
            color:'#0E9CFF',
            borderColor:"#a3c8d8"
          },
          lineStyle: {
            normal: {
              width:1,
              color: "#0E9CFF",
            }
          },
          label:{
            show:true,
            color:'#fff'
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [{
                  offset: 0,
                  color: "rgba(88,255,255,0.2)"
                },
                  {
                    offset: 0.8,
                    color: "rgba(88,255,255,0)"
                  }
                ],
                false
              ),
            }
          },
          data: data
        }]
      };
      this.monthChangeTrendObj.setOption(option);
    },
    //今日能耗 yData总耗电量 yData1总充电量
    todayEnergy1(id,yData,yData1){
      if(this.energyEfficiencyObj){
        this.energyEfficiencyObj.dispose();
        this.energyEfficiencyObj = null
      }
      this.energyEfficiencyObj=echarts.init(document.getElementById(id));
      function _pie2() {
        let dataArr = [];
        for (var i = 0; i < 8; i++) {
          if (i % 2 === 0) {
            dataArr.push({
              name: (i + 1).toString(),
              value: 25,
              itemStyle: {
                normal: {
                  color: '#006BA1',
                },
              },
            });
          } else {
            dataArr.push({
              name: (i + 1).toString(),
              value: 20,
              itemStyle: {
                normal: {
                  color: '#13D7D7',
                },
              },
            });
          }
        }
        return dataArr;
      }
      let percent=0;
      if(yData1==0||yData1==null||yData1==''){
        percent=0;
      }else{
        percent=yData / yData1
      }
      var data = [percent];
      let option = {
        title: [
          {
            text: '总耗电量:'+yData+'Kw/h',
            bottom: '5%',
            left:'center',
            textStyle: {
              fontSize: 16,
              color: '#fff',
              textAlign: 'center',
            },
          },
        ],
        series: [
          {
            type: 'liquidFill',
            radius: '76%',
            center: ['50%', '45%'],
            color: [
              {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: '#13D7D7',
                  },
                  {
                    offset: 0,
                    color: '#09C889',
                  },
                ],
                globalCoord: false,
              },
            ],
            data: data,
            backgroundStyle: {
              borderWidth: 1,
              color: 'RGBA(51, 66, 127, 0.7)',
            },
            label: {
              normal: {
                formatter: (percent * 100).toFixed(2) + '%'+'\n\n'+'电能利用率',
                textStyle: {
                  fontSize: 14,
                  color: '#fff',
                },
              },
            },
            outline: {
              show: true,
              itemStyle: {
                borderWidth: 0,
              },
              borderDistance: 0,
            },
          },
          {
            type: 'pie',
            zlevel: 2,
            silent: true,
            center: ['50%', '45%'],
            radius: ['85%', '86%'],
            color:['#13D7D7'],
            startAngle: 50,
            hoverAnimation: false,
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: _pie2(),
          },
          {
            type: 'pie',
            zlevel: 3,
            silent: true,
            center: ['50%', '45%'],
            radius: ['79%', '79.5%'],
            color:['#006BA1'],
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: [1],
          },
        ],
      };
      let documentWidth=document.documentElement.clientWidth;
      if(documentWidth<1900){
        option.title[0].textStyle.fontSize=12;
      }
      this.energyEfficiencyObj.setOption(option)
    },
    todayEnergy2(id,yData){
      if(this.energyTotalObj){
        this.energyTotalObj.dispose();
        this.energyTotalObj = null
      }
      this.energyTotalObj=echarts.init(document.getElementById(id));
      function _pie2() {
        let dataArr = [];
        for (var i = 0; i < 8; i++) {
          if (i % 2 === 0) {
            dataArr.push({
              name: (i + 1).toString(),
              value: 25,
              itemStyle: {
                normal: {
                  color: '#FF9557',
                },
              },
            });
          } else {
            dataArr.push({
              name: (i + 1).toString(),
              value: 20,
              itemStyle: {
                normal: {
                  color: '#714016',
                },
              },
            });
          }
        }
        return dataArr;
      }
      var value = 1;
      var data = [value];
      let option = {
        title: [
          {
            text: '总充电量:'+yData+'kw/h',
            bottom: '5%',
            left:'center',
            textStyle: {
              fontSize: 16,
              color: '#fff',
              textAlign: 'center',
            },
          },
        ],
        series: [
          {
            type: 'liquidFill',
            radius: '76%',
            center: ['50%', '45%'],
            color: [
              {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: '#FFDE78 ',
                  },
                  {
                    offset: 0,
                    color: '#FF9557',
                  },
                ],
                globalCoord: false,
              },
            ],
            data: data,
            backgroundStyle: {
              borderWidth: 1,
              color: 'RGBA(51, 66, 127, 0.7)',
            },
            label: {
              normal: {
                formatter: yData + 'kw/h'+'\n\n'+'总充电量',
                textStyle: {
                  fontSize: 14,
                  color: '#fff',
                },
              },
            },
            outline: {
              show: true,
              itemStyle: {
                borderWidth: 0,
              },
              borderDistance: 0,
            },
          },
          {
            type: 'pie',
            zlevel: 2,
            silent: true,
            center: ['50%', '45%'],
            radius: ['85%', '86%'],
            color:['#FF9657 '],
            startAngle: 50,
            hoverAnimation: false,
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: _pie2(),
          },
          {
            type: 'pie',
            zlevel: 3,
            silent: true,
            center: ['50%', '45%'],
            radius: ['79%', '79.5%'],
            color:['#FF9557'],
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: [1],
          },
        ],
      };
      let documentWidth=document.documentElement.clientWidth;
      if(documentWidth<1900){
        option.title[0].textStyle.fontSize=12;
      }
      this.energyTotalObj.setOption(option)
    },
    //今日车辆运营情况
    todayCarOperation(id){
      if(this.todayCarOperationObj){
        this.todayCarOperationObj.dispose();
        this.todayCarOperationObj = null
      }
      this.todayCarOperationObj=echarts.init(document.getElementById(id));
      let option = {
        title: {
          text: '车辆总数'+'\n\n'+'1200辆',
          x: 'center',
          y: '35%',
          textStyle: {
            fontSize: 14,
            color:'#fff'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        color:['#FF9156','#45EB45','#30FCCA'],
        legend: {
          bottom: '20',
          left: 'center',
          textStyle:{
            color:'#fff'
          }
        },
        series: [
          {
            name: '车辆运营情况',
            type: 'pie',
            center:['50%','40%'],
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'outside',
              formatter: '{b} \n {d}'+'%',
              edgeDistance: 10,
              lineHeight: 20,
              textStyle:{
                fontSize:12
              }
            },
            labelLine: {
              show: true
            },
            data: [
              {value: 1048, name: '行驶中'},
              {value: 735, name: '换电中'},
              {value: 580, name: '静止状态'},
            ]
          },
        ]
      };
      let documentWidth=document.documentElement.clientWidth;
      if(documentWidth<1900){
        option.series[0].radius=['40%', '55%']
      }
      this.todayCarOperationObj.setOption(option)
    },
    //月营收分析柱状图
    monthIncome(id,xData,data){
      if(this.monthIncomeObj){
        this.monthIncomeObj.dispose();
        this.monthIncomeObj = null
      }
      this.monthIncomeObj=echarts.init(document.getElementById(id));
      let option = {
        backgroundColor:"#111c4e",
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              opacity: 0
            }
          },
          formatter: function(prams) {
            console.log(prams)
            return prams[0].name+'月'+'<br/>'+ '营收：'+prams[0].data + "万元"
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: 10,
          top: 50,
          containLabel: true,
          z: 22
        },
        xAxis: [{
          type: 'category',
          name:'月',
          nameTextStyle: {
            color: "#3B71A1",
            fontSize: 12,
            padding:[10,0,0,-10],
            // lineHeight: 40
          },
          // gridIndex: 0,
          data: xData,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#0c3b71'
            }
          },
          axisLabel: {
            show: true,
            formatter: '{value}',
            fontSize:12,
            margin:10,
            textStyle: {
              color: "#3B71A1"
            },
            interval: 0
          }
        }],
        yAxis: [
          {
            type: 'value',
            name: '万元',
            nameTextStyle: {
              color: '#3B71A1'
            },
            gridIndex: 0,
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            // min: min,
            // max: 100,
            axisLine: {
              lineStyle: {
                color: '#0c3b71'
              }
            },
            axisLabel: {
              color: '#3B71A1',
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            gridIndex: 0,
            // min: min,
            // max: 100,
            // splitNumber: 12,
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },

          }
        ],
        series: [
          {
            name: '月营收',
            type: 'bar',
            barWidth: '30%',
            xAxisIndex: 0,
            yAxisIndex: 0,
            itemStyle: {
              normal: {
                barBorderRadius: 30,
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1, [{
                    offset: 0,
                    color: '#00feff'
                  },
                    {
                      offset: 0.5,
                      color: '#027eff'
                    },
                    {
                      offset: 1,
                      color: '#0286ff'
                    }
                  ]
                )
              }
            },
            data: data,
            zlevel: 11
          },
          {
            name: '背景',
            type: 'bar',
            barWidth: '30%',
            xAxisIndex: 0,
            yAxisIndex: 1,
            barGap: '-100%',
            data: [100, 100, 100, 100, 100, 100, 100,100, 100, 100, 100, 100, 100, 100,100],
            itemStyle: {
              normal: {
                barBorderRadius: 30,
                color: 'rgba(12, 135, 233, 0.1)'
              }
            },
            zlevel: 9
          },

        ]
      };
      this.monthIncomeObj.setOption(option);
    },
    changeGeoMap(item){
      if(item==='中国'){
        this.mapName='china';
        this.geoMapName=['中国']
      }else{
        this.mapName=item;
      }
      this.geoMap('center-map');
    },
    //下钻地图
    geoMap(id){
      // var url=`${this.$mapJsonUrl}/static/mapJson/china.json`
      if(this.geoObj==null){
        this.geoObj=echarts.init(document.getElementById(id));
      }else{
        this.geoObj.clear();
        this.geoObj.off('click')
      }
      var data =[];

      var geoCoordMap = {};

      /*获取地图数据*/
      // console.log(echarts.getMap(mapName))
      var mapFeatures = echarts.getMap(this.mapName).geoJson.features;
      // var mapFeatures=null
      // axios.get(url).then((response)=> {
      //   console.log(response);
      //   mapFeatures = response.data.features;
      //
      // })
      mapFeatures.forEach(function(v) {
        // 地区名称
        var name = v.properties.name;
        // 地区经纬度
        geoCoordMap[name] = v.properties.cp;

        var obj={};
        obj.name=v.properties.name;
        obj.value=parseInt(Math.random()*100);
        data.push(obj);
      });
      var convertData = function(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var geoCoord = geoCoordMap[data[i].name];
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value),
            });
          }
        }
        console.log(res)
        return res;
      };
      var option = {
        tooltip: {
          trigger: 'item',
          formatter(val){
            console.log(val)
            if(val.componentSubType=='effectScatter'){
              return val.data.name+'  :  '+val.data.value[2]
            }else{
              return val.data.name+'  :  '+val.data.value
            }

          }
        },
        // visualMap: {
        //   show: false,
        //   min: 0,
        //   max: 100,
        //   left: 'left',
        //   top: 'bottom',
        //   text: ['高', '低'], // 文本，默认为数值文本
        //   calculable: true,
        //   seriesIndex: [1],
        //   inRange: {
        //     color: ['#4b9cec', '#4099f9','#d94e5d']
        //
        //   }
        // },
        geo: {
          show: true,
          map: this.mapName,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false,
            }
          },
          roam: true,
          itemStyle: {
            normal: {
              areaColor: '#0E2358',
              borderColor: '#02B0F4',
              borderWidth:1
            },
            emphasis: {
              areaColor: '#2B91B7',
            }
          }
        },
        series: [
          {
            name: '散点',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: convertData(data),
            symbolSize: function(val) {
              return 0.1;
            },
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: true
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: '#6DC4FF'
              }
            }
          },
          {
            name: 'Top 5',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: convertData(data.sort(function(a, b) {
              return b.value - a.value;
            }).slice(0, 5)),
            symbolSize: function(val) {
              return val[2] /10;
            },
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
              normal: {
                formatter: '{b}',
                position: 'left',
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: '#E8338F',
                shadowBlur: 10,
                shadowColor: '#E8338F'
              }
            },
            zlevel: 1
          },
          {
            type: 'map',
            mapType: this.mapName,
            geoIndex: 0,
            aspectScale: 0.75, //长宽比
            zoom: 1.5,
            showLegendSymbol: false, // 存在legend时显示
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: false,
                textStyle: {
                  color: '#fff'
                }
              }
            },
            roam: false,
            itemStyle: {
              normal: {
                areaColor: '#031525',
                borderColor: '#3B5077',
              },
              emphasis: {
                areaColor: '#2B91B7'
              }
            },
            animation: false,
            data: data
          },
        ]
      };
      this.geoObj.setOption(option);

      this.geoObj.on('click',(e)=>{
        if(province.includes(e.name)){
          this.mapName=e.name;
          this.geoMapName=['中国'];
          this.geoMapName.push(e.name);
          this.geoMap('center-map');
        }
      })
    },
    fullScreen(id){
      const element = document.getElementById(id)
      if (screenfull.isEnabled) {
        screenfull.request(element)
        screenfull.toggle()
      }
      // this.isFullscreen=true
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen
    },
    init() {
      if (screenfull.isEnabled) {
        screenfull.on('change', this.change)
      }
    },
    destroy() {
      if (screenfull.isEnabled) {
        screenfull.off('change', this.change)
      }
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.monthChangeTrend('month-change-trend',this.monthData,this.monthChangeTrendData)
      this.monthIncome('month-money',this.monthData,this.monthIncomeData)
      this.todayEnergy1('day-energy1',this.energyEfficiencyData,this.energyTotalData)
      this.todayEnergy2('day-energy2',this.energyTotalData)
      this.todayCarOperation('day-car-operation');
      this.geoMap('center-map');

      window.onresize=()=>{
        this.monthChangeTrendObj.resize();
        this.monthIncomeObj.resize();
        this.energyEfficiencyObj.resize();
        this.energyTotalObj.resize();
        this.todayCarOperationObj.resize();
        this.geoObj.resize();
      }

      this.init();
    })
  },
  beforeDestroy() {
    this.destroy()
  },
}
</script>

<style lang="scss" scoped>
  .main-page{
    width:100%;
    height:100%;
    background: url('../assets/images/mainPage/page-bg.png') no-repeat center center;
    background-size: cover;
    .main-page-content{
      width:100%;
      height:100%;
      padding:10px;
      overflow: auto;
      .data-count-list-box{
        width:100%;
        display: flex;
        margin-bottom: 20px;
        .data-count-content{
          flex-shrink:0;
          width:calc(100% / 9 - 80px / 9);
          height: 120px;
          margin-right: 10px;
          background: url('../assets/images/mainPage/list-bg.png') no-repeat center center;
          background-size: 100% 100%;
          font-size: 17px;
          .count-num-box{
            color:#11E4FFFF;
            text-align: center;
            padding:19px 0 10px 0;
            .count-num{
              font-size: 30px;
              font-family: PingFang SC;
              font-weight: bold;
              margin-right: 4px;
            }
          }
          .data-count-title{
            width: 90%;
            height: 30px;
            line-height: 30px;
            margin:0 auto;
            background: #00B9FC;
            opacity: 0.8;
            border-radius: 5px;
            color:#fff;
            text-align: center;
            font-family: PingFang SC;
            font-weight: bold;
          }
        }
        .data-count-content:last-child{
          margin-right: 0;
        }
        .yellow-bg{
          .count-num-box{
            color:#C9A54BFF;
          }
          .data-count-title{
            background: linear-gradient(180deg, #FFCC57 0%, #CEAC02 100%);
            opacity: 0.8;
          }
        }
        .red-bg{
          .count-num-box{
            color:#FF0007FF;
          }
          .data-count-title{
            background: linear-gradient(180deg, #FF0800 0%, #B40700 100%);
            opacity: 0.8;
          }
        }
      }
      .bottom-chart-box{
        width:100%;
        height:835px;
        display: flex;
        .icon-color{
          fill:#fff;
        }
        .pos{
          position: absolute;
          top:17px;
          right:24px;
        }
        .left-chart-box{
          width:30%;
          height:100%;
          .left-top-chart-box{
            width:100%;
            height: calc(100% / 2 - 28px / 2);
            margin-bottom: 28px;
            background: url('../assets/images/mainPage/chart-bg.png') no-repeat center center;
            background-size: 100% 100%;
            padding:10px;
            position: relative;
          }
          .left-bottom-chart-box{
            width:100%;
            height: calc(100% / 2 - 28px / 2);
            background: url('../assets/images/mainPage/chart-bg.png') no-repeat center center;
            background-size: 100% 100%;
            padding:10px;
            position: relative;
          }
        }
        .center-map-box{
          width:calc(40% - 20px);
          height:100%;
          margin:0 10px;
          box-shadow: 0 0 30px #0983BC inset;
          opacity: 1;
          border-radius: 10px;
          position: relative;
          .map-title-box{
            color:#10BDDD;
            font-size: 24px;
            text-align: center;
            font-family: PingFang SC;
            font-weight: bold;
            padding:20px 0;
          }
          .geo-map-title{
            position: absolute;
            top:90px;
            left:10px;
            color:#fff;
            z-index:100;
            span{
              font-size: 14px;
              cursor: pointer;
            }
          }
          .map-content-box{
            width:100%;
            height:calc(100% - 64px);
          }
        }
        .right-chart-box{
          width:30%;
          height:100%;
          .right-top-chart-box{
            width:100%;
            height: calc(100% / 2 - 28px / 2);
            margin-bottom: 28px;
            background: url('../assets/images/mainPage/chart-bg.png') no-repeat center center;
            background-size: 100% 100%;
            padding:10px;
            position: relative;
          }
          .right-bottom-chart-box{
            width:100%;
            height: calc(100% / 2 - 28px / 2);
            background: url('../assets/images/mainPage/chart-bg.png') no-repeat center center;
            background-size: 100% 100%;
            padding:10px;
            position: relative;
          }
        }
        .chart-title-box{
          width: 200px;
          height: 35px;
          background: url('../assets/images/mainPage/title-bg.png') no-repeat center center;
          background-size: 100% 100%;
          font-size: 16px;
          color:#11E4FF;
          display: flex;
          align-items: center;
          text-indent: 12px;
        }
        .common-chart-box{
          width:100%;
          height:calc(100% - 35px);
          display: flex;
          .water-full-chart{
            width:50%;
            height:100%;
          }
        }
      }
    }

    @media screen and (max-width:1620px){
      .data-count-content{
        height: 100px!important;
        font-size: 12px!important;
      }
      .count-num-box{
        .count-num{
          font-size: 20px!important;
        }
      }
    }
  }
</style>
