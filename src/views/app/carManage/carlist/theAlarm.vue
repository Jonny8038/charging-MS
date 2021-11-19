<template>
  <div class="page-theAlarm">
    <div class="page-content">
      <el-table :data="theAlarmList"
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
                         prop="startTime"
                         label="开始时间"
                         width="180">
        </el-table-column>
        <el-table-column align="center"
                         prop="endTime"
                         label="解除时间"
                         width="180">
        </el-table-column>
        <el-table-column align="center"
                         prop="lastTime"
                          width="180"
                         label="最新报警时间">
        </el-table-column>
        <el-table-column align="center"
                         prop="alarmName"                         
                         label="名称">
        </el-table-column>
        <el-table-column align="center"
                         prop="maxAlarmLevel"
                         label="级别">
        </el-table-column>
        <el-table-column align="center"
                         prop="vin"
                         width='150'
                         label="VIN码">
        </el-table-column>
        <el-table-column align="center"
                         prop="deviceNo"
                         label="车载终端编号">
        </el-table-column>
        <el-table-column align="center"
                         prop="carNo"
                         label="车牌号">
        </el-table-column>
         <el-table-column align="center"
                         prop="count"
                         label="报警次数">
        </el-table-column>
         <el-table-column align="center"
                         prop="posX"
                         label="报警经度">
        </el-table-column>
         <el-table-column align="center"
                         prop="posY"
                         label="报警纬度">
        </el-table-column>        
      </el-table>
      <pagination v-show="total > 0"
                  :total="total"
                  :page.sync="queryParams.pageNum"
                  :limit.sync="queryParams.pageSize"
                  @pagination="getTheAlarm" />
    </div>
  </div>

</template>
<script>
import { theAlarm } from '@/api/app/car'
export default {
  name: 'theAlarm',
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
      theAlarmList: [],
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
      this.getTheAlarm()
    },
    clear() {
      this.theAlarmList = []
    },
    getTheAlarm(index, row) {
      this.loading = true
     theAlarm(this.queryParams).then((response) => {
        this.theAlarmList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
  },
}
</script>
<style lang='scss' scoped>
</style>
