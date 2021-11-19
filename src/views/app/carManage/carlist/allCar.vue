<template>
  <div class="page-allCar">
    <div class="page-content">
      <el-table :data="allCarList"
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
                         width="150">
        </el-table-column>
        <el-table-column align="center"
                         prop="carStatus"
                         label="车辆状态"
                         width="100">
        </el-table-column>
        <el-table-column align="center"
                         prop="runningMode"
                         width="90"
                         label="运行模式">
        </el-table-column>
        <el-table-column align="center"
                         prop="mileage"
                         width="90"
                         label="累计里程">
        </el-table-column>
        <el-table-column align="center"
                         prop="speed"
                         width="90"
                         label="车速">
        </el-table-column>
        <el-table-column align="center"
                         prop="voltage"
                         width="100"
                         label="总电压">
        </el-table-column>
        <el-table-column align="center"
                         prop="current"
                         width="100"
                         label="总电流">
        </el-table-column>
        <el-table-column align="center"
                         prop="soc"
                         width="100"
                         label="SOC">
        </el-table-column>
        <el-table-column align="center"
                         prop="dc"
                         width="100"
                         label="DC/DC状态">
        </el-table-column>
        <el-table-column align="center"
                         prop="gear"
                         width="100"
                         label="档位">
        </el-table-column>
        <el-table-column align="center"
                         prop="resistance"
                         width="100"
                         label="绝缘电阻值">
        </el-table-column>
        <el-table-column align="center"
                         prop="gasPedalValue"
                         width="120"
                         label="加速踏板行程值">
        </el-table-column>
        <el-table-column align="center"
                         prop="brakePedalValue"
                         width="120"
                         label="制动踏板状态">
        </el-table-column>
        <el-table-column align="center"
                         prop="posX"
                         width="100"
                         label="当前经度">
        </el-table-column>
        <el-table-column align="center"
                         prop="posY"
                         label="当前纬度">
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0"
                  :total="total"
                  :page.sync="queryParams.pageNum"
                  :limit.sync="queryParams.pageSize"
                  @pagination="getAllCar" />
    </div>
  </div>

</template>
<script>
import { AllCar } from '@/api/app/car'
export default {
  name: 'allCar',
  props: {
    dialogCarData: Object,
  },
  data() {
    return {
      // 总条数
      total: 100,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        time: [],
        startTime:'',
        endTime:'',
        vin: '',
      },
      allCarList: [],
    }
  },
  created() {},
  methods: {
    // 父组件调用子组件的入口
    query(param) {
      this.queryParams.startTime = param.startTime
      this.queryParams.endTime = param.endTime
      this.queryParams.vin = param.vin  
      this.queryParams.pageNum = 1     
      this.getAllCar()
    },
    clear() {
      this.allCarList = []
    },
    getAllCar() {
      this.loading = true     
      AllCar(this.queryParams).then((response) => {
        this.allCarList = response.rows
        this.total = response.total
        this.loading = false          
      })
    },
  },
}
</script>
<style lang='scss' scoped>
</style>
