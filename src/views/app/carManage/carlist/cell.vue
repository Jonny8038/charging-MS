<template>
  <div class="page-allCar">
    <div class="page-content">
      <el-table :data="cellList"               
                border
                align='center'
                size='mini'
                style="width: 100%">
        <el-table-column label="序号"
                         align='center'>
          <template slot-scope="scope">
            {{(queryParams.pageNum-1)*queryParams.pageSize+scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column align="center"
                         prop="obdTime"
                         label="时间"
                         width="180">
        </el-table-column>
        <el-table-column align="center"
                         prop="maxTemper"
                         label="最高温度值"
                         width="100">
        </el-table-column>
        <el-table-column align="center"
                         prop="minTemper"
                         width="100"
                         label="最低温
                         度值">
        </el-table-column>
        <el-table-column align="center"
                         prop="maxTemperSysNo"
                         width="130"
                         label="最高温度子系统号">
        </el-table-column>
        <el-table-column align="center"
                         prop="maxTemperProbeNo"
                         width="130"
                         label="最高温度探针序号">
        </el-table-column>
        <el-table-column align="center"
                         prop="minTemperSysNo"
                         width="130"
                         label="最低温度子系统号">
        </el-table-column>
        <el-table-column align="center"
                         prop="minTemperProbeNo"
                         width="130"
                         label="最低温度探针序号">
        </el-table-column>
        <el-table-column align="center"
                         prop="batteryMinVolt"
                         width="140"
                         label="电池单体电压最低值">
        </el-table-column>
        <el-table-column align="center"
                         prop="batteryMaxVolt"
                         width="140"
                         label="电池单体电压最高值">
        </el-table-column>
        <el-table-column align="center"
                         prop="maxVoltBatterySysNo"
                         width="160"
                         label="最高电压电池子系统号">
        </el-table-column>
        <el-table-column align="center"
                         prop="maxVoltBatteryNo"
                         width="160"
                         label="最高电压电池单体代号">
        </el-table-column>
        <el-table-column align="center"
                         prop="minVoltBatterySysNo"
                         width="160"
                         label="最低电压电池子系统号">
        </el-table-column>
        <el-table-column align="center"
                         prop="minVoltBatteryNo"
                         width="160"
                         label="最低电压电池单体代号">
        </el-table-column>
        <el-table-column align="center"
                         prop="batteryVolt"
                         width="120"
                         label="燃料电池电压">
        </el-table-column>
        <el-table-column align="center"
                         prop="batteryCurrent"
                         width="100"
                         label="燃料电池电流">
        </el-table-column>
        <el-table-column align="center"
                         prop="consumeRate"
                         width="100"
                         label="消耗率">
        </el-table-column>
        <el-table-column align="center"
                         prop="hyMaxDensity"
                         width="100"
                         label="氢气最高浓度">
        </el-table-column>
        <el-table-column align="center"
                         prop="hyMaxPressure"
                         width="100"
                         label="氢气最高压力">
        </el-table-column>
        <el-table-column align="center"
                         prop="probeNum"
                         width="100"
                         label="温度探针总数">
        </el-table-column>
        <el-table-column align="center"
                         prop="pressureDc"
                         width="120"
                         label="高压DC/DC状态">
        </el-table-column>
        <el-table-column align="center"
                         prop="hyMaxTemper"
                         width="130"
                         label="氢系统中最高温度">
        </el-table-column>
        <el-table-column align="center"
                         prop="hyMaxDensitySensorCode"
                         width="180"
                         label="氢气最高浓度传感器代号">
        </el-table-column>
        <el-table-column align="center"
                         prop="hyMaxPressureSensorCode"
                         width="180"
                         label="氢气最高压力传感器代号">
        </el-table-column>
        <el-table-column align="center"
                         prop="hyMaxTemperProbe"
                         width="180"
                         label="氢系统中最高温度探针代号">
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0"
                  :total="total"
                  :page.sync="queryParams.pageNum"
                  :limit.sync="queryParams.pageSize"
                  @pagination="getBattery" />
    </div>
  </div>

</template>
<script>
import {
  Battery
} from '@/api/app/car'
export default {
  name: 'cell',
  data() {
    return {
      // 总条数
      total: 100,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        time:[],
        vin: ''
      },
      cellList: [],
    }
  },
  created() {},
  methods: {
     // 父组件调用子组件的入口
    query(param){
      this.queryParams.startTime = param.startTime
      this.queryParams.endTime = param.endTime
      this.queryParams.vin = param.vin
       this.queryParams.pageNum =1;
       this.getBattery();
    },
    clear(){
      this.cellList=[];
    },
    getBattery(index, row) {
      this.loading = true
      Battery(this.queryParams).then((response) => {
        this.cellList = response.rows
        this.total = response.total
        this.loading = false        
      })
    }
  },
}
</script>

<style lang='scss' scoped>
</style>
