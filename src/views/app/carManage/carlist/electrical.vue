<template>
  <div class="page-allCar">
    <div class="page-content">
      <el-table :data="electricalList"
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
                         prop="status"
                         label="状态"
                         width="180">
        </el-table-column>
        <el-table-column align="center"
                         prop="rotatingSpeed"
                         label="转速">
        </el-table-column>
        <el-table-column align="center"
                         prop="torque"
                         label="转矩">
        </el-table-column>
        <el-table-column align="center"
                         prop="temper"
                         label="温度">
        </el-table-column>
        <el-table-column align="center"
                         prop="controlTemper"
                         label="控制器温度">
        </el-table-column>
        <el-table-column align="center"
                         prop="controlVolt"
                         label="控制器输入电压">
        </el-table-column>
        <el-table-column align="center"
                         prop="current"
                         label="控制器直线母线电流">
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0"
                  :total="total"
                  :page.sync="queryParams.pageNum"
                  :limit.sync="queryParams.pageSize"
                  @pagination="getDriver" />
    </div>
  </div>

</template>
<script>
import { Driver } from '@/api/app/car'
export default {
  name: 'electrical',
  data() {
    return {
      // 总条数
      total: 100,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        vin: '',
        time:[]
      },
      electricalList: [],
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
      this.getDriver()
    },
    clear() {
      this.electricalList = []
    },
    getDriver(index, row) {
      this.loading = true
      Driver(this.queryParams).then((response) => {
        this.electricalList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
  },
}
</script>
<style lang='scss' scoped>
</style>
