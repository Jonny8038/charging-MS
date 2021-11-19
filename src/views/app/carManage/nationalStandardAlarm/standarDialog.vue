<template>
  <el-dialog
    :visible="showStandardDialog"
    :before-close="handleClose"
    width="100%"
    fullscreen
    custom-class="checkCarlist"
    center>
    <div class="el-dialog-div">
      <div class="page-carCheck">
        <el-form ref="form"
                 :inline="true"
                 :model="queryParams"
                 size="mini">
          <el-form-item>
            <el-date-picker v-model="queryParams.time"
                            type="datetimerange"
                            value-format=" yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       icon="el-icon-search"
                       size="mini"
                       @click="getTheAlarm">查询
            </el-button>
          </el-form-item>
        </el-form>
        <div class="page-content">
          <div class="page-theAlarm">
            <div class="page-content">
              <el-table :data="theAlarmList"
                        border
                        size="mini"
                        style="width: 100%">
                <el-table-column label="序号"
                                 align="center">
                  <template slot-scope="scope">
                    {{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}
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
                                 width="150"
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
                          @pagination="getTheAlarm"/>
            </div>
          </div>
        </div>
      </div>
    </div>
<!--    <div slot="footer"-->
<!--         class="dialog-footer">-->
<!--      <el-button type="primary"-->
<!--                 @click="cancel">确定-->
<!--      </el-button>-->
<!--      <el-button @click="cancel">取消</el-button>-->
<!--    </div>-->
  </el-dialog>

</template>
<script>
import { theAlarm } from '@/api/app/car'

export default {
  props: {
    vin: [String, Number],
    showStandardDialog: false
  },
  name: 'carCheck',
  data() {
    return {
      queryParams: {
        time: []
      },
      // 总条数
      total: 0,
      theAlarmList: []
    }
  },
  watch: {
    vin(val) {
      if (val) {
        this.getTheAlarm()
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    //查询功能按钮
    getTheAlarm() {
      this.loading = true
      //获取选择的时间范围值
      let query = {
        startTime: this.queryParams.time[0],
        endTime: this.queryParams.time[1],
        vin: this.vin
      }
      this.loading = true
      theAlarm(query).then((response) => {
        this.theAlarmList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    handleClose() {
      this.$emit('update:vin', '')
      this.reset()
      this.$emit('update:showStandardDialog', false)
    },
    reset() {
      this.resetForm('queryParams')
    },
    // 取消按钮
    cancel() {
      this.handleClose();
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
