<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             size="mini"
             class="clearfix"
             label-width="82px">
      <el-form-item label="站端" prop="sid">
        <el-select v-model="queryParams.sid" placeholder="请选择站端" style="width: 100%;">
          <el-option label="所有站端" value="1"></el-option>
          <el-option label="龙华站" value="2"></el-option>
          <el-option label="宝安站" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="fr">
        <div class="date-type">
          <div v-for="(item,index) in dateTypeData"
               :class="activeIndex==index?'active':''"
               :key="index"
               @click="changeDate(item,index)">{{item.name}}</div>
        </div>
      </el-form-item>
    </el-form>
    <!-- 图表-->
    <div class="chart-box">
      <div class="lin-chart" id="line-chart"></div>
    </div>
    <!--表格-->
    <el-table class="table-grid-box"
              border
              size="mini"
              stripe
              v-loading="loading"
              :data="tableData">
      <el-table-column label="序号" type="index" align="center" width="60"/>
      <el-table-column label="站场名称" align="center" prop="siteName" />
      <el-table-column label="用户姓名" align="center" prop="driverName" />
      <el-table-column label="用户电话" align="center" prop="driverPhone" />
      <el-table-column label="电池编号" align="center" prop="vin" />
      <el-table-column label="行驶里程" align="center" prop="vin" />
      <el-table-column label="车牌号码" align="center" prop="carNo" />
      <el-table-column label="换电状态" align="center" prop="status">
        <template slot-scope="scope">
          <span>{{filterOrderStatus(scope.row.status)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="换电时间" align="center" prop="createTime" />
      <el-table-column label="订单编号" align="center" prop="orderNo" />
    </el-table>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import echarts from 'echarts'
export default {
  name: 'index',
  data() {
    return {
      queryParams:{
        sid:'',
        dataType:'',
      },
      legend:['注册人数','新用户成交人数'],
      xName:['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月','9月','10月','11月','12月'],
      data: [
        [10, 11, 9, 9, 10, 11, 13, 9, 9, 9, 10, 11],
        [13, 13, 13, 14, 14, 14, 14, 14, 14, 13, 12, 13],
        [18, 19, 18, 18, 19, 15, 13, 12, 20, 30, 20, 25],
        [15, 16, 14, 12, 14, 15, 11, 13, 14, 15, 15, 16]
      ],
      barChartObJ:null,
      lineColors:['#7cb5ec','#434348'],
      seriesData:[],
      dateTypeData:[
        {
          type:'day',
          name:'日'
        },
        {
          type:'month',
          name:'月'
        },
      ],
      activeIndex:0,
      loading:false,
      tableData:[
        {
          siteName:'测试站点',
          driverName:'张明',
          driverPhone:'0710-256589',
          vin:'PLAS5458652',
          carNo:'鄂F2568954',
          status:1,
          createTime:'2021-05-12 12:25:22',
          orderNo:'s25410141',
        },
        {
          siteName:'测试站点',
          driverName:'张明',
          driverPhone:'0710-256589',
          vin:'PLAS5458652',
          carNo:'鄂F2568954',
          status:-2,
          createTime:'2021-05-12 12:25:22',
          orderNo:'s25410141',
        }
      ]
    }
  },
  computed:{
    ...mapGetters(['sidebar']),
  },
  watch:{
    sidebar:{
      deep: true,
      handler(val) {
        console.log(this.barChartObJ)
        setTimeout(()=>{
          this.barChartObJ.resize();
        },50)
      }
    }
  },
  methods: {
    barChart(id){
      if(this.barChartObJ){
        this.barChartObJ.dispose();
        this.barChartObJ = null
      }
      this.barChartObJ=echarts.init(document.getElementById(id));
      this.seriesData=[];
      for (var i = 0; i < this.legend.length; i++) {
        var data = {
          name: this.legend[i],
          type: 'bar',
          smooth: true,
          barGap: 0,
          symbol: 'circle',
          symbolSize: 5,
          data: this.data[i],
        };
        this.seriesData.push(data);
      }
      let option={
        title: {
          text: '用户数据分析',
          left: 'center',
          top:10,
          textStyle: {
            fontSize: 14,
            color: '#484848',
          },
        },
        color:this.lineColors,
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          show:true,
          bottom: 10,
          data: this.legend,
          textStyle: {
            fontSize: 12,
            color: '#484848',
          },
          left: 'center',
        },
        grid: {
          top: 50,
          left: '4%',
          right: '4%',
          bottom: 50,
          containLabel: true,
        },
        xAxis: {
          show: true,
          type: 'category',
          boundaryGap: true,
          data: this.xName,
          axisLabel: {
            textStyle: {
              color: '#484848',
            },
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          show: true,
          name: '(人)',
          nameTextStyle:{
            padding:[0,40,0,0],
          },
          type: 'value',
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              color: '#484848',
            },
          },
          splitLine: {
            lineStyle: {
              color: '#C0C4CC',
            },
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        series: this.seriesData,
      }
      this.barChartObJ.setOption(option)
    },
    chartResize(){
      window.onresize=()=>{
        this.barChartObJ.resize();
      }
    },
    //改变日期
    changeDate(item,index){
      let type=item.type;
      this.activeIndex=index;
    },
    //预约状态字段过滤
    filterOrderStatus(val){
      let obj={
        '-3':'已超时',
        '-2':'已取消',
        '-1':'检测异常',
        0:'进行中',
        1:'已完成'
      }
      return obj[val];
    },
  },
  mounted() {
    this.$nextTick(()=>{
      this.barChart('line-chart');
      this.chartResize();
    });
  },
  beforeDestroy() {
    if (!this.barChartObJ) {
      return
    }
    this.barChartObJ.dispose()
    this.barChartObJ = null
  },
}
</script>

<style lang="scss" scoped>
.chart-box{
  width:100%;
  height: 350px;
  border:1px solid #C0C4CC;
  margin-bottom: 10px;
  .lin-chart{
    width:100%;
    height:100%;
    position: relative;
  }
}
.date-type{
  display: flex;
  align-items: center;
  padding-right: 1px;
  div{
    padding:0 15px;
    border:1px solid #ccc;
    margin-left: -1px;
    cursor: pointer;
  }
  div.active{
    background-color: #1890ff;
    color:#fff;
  }
}
</style>
