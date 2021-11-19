<template >
  <div class="page-carCheck">
    <el-form ref="form"
             :inline="true"
             :model="queryParams"
             size='mini'>
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
                   @click="handleQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="page-content">
      <el-tabs v-model="activeName"
               stretch
               @tab-click="handleClick">
        <el-tab-pane label="整车数据"
                     name="first">
          <all-car ref="tabCar"></all-car>
        </el-tab-pane>
        <el-tab-pane label="电池数据"
                     name="second">
          <cell ref="tabCell"></cell>
        </el-tab-pane>
        <el-tab-pane label="电机数据"
                     name="third">
          <electrical ref="tabCelectrical"></electrical>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>

</template>
<script>
import allCar from '@/views/app/carManage/carlist/allCar.vue'
import cell from '@/views/app/carManage/carlist/cell.vue'
import electrical from '@/views/app/carManage/carlist/electrical.vue'
export default {
  components: { allCar, cell, electrical },
  props: {
    rowOption: Object,
  },
  name: 'carCheck',
  data() {
    return {
      queryParams: {
        time: [],
        startTime: '',
        endTime: '',
      },
      activeName: 'first',
      dialogTab: 'first',
      queryOne: false,
      queryTwo: false,
      queryThree: false,
      queryFourth: false,
    }
  },
  watch: {
    rowOption(val) {
      this.handleQuery()
    },
  },
  created() {
    this.activeName = 'first'
    this.dialogTab = 'first'
  },
  mounted() {
    this.handleQuery()
  },
  methods: {
    //查询功能按钮
    handleQuery() {
      this.loading = true
      //console.log(this.queryParams.time)
      //获取选择的时间范围值
      this.queryParams.startTime = this.queryParams.time[0]
      this.queryParams.endTime = this.queryParams.time[1]
      this.queryParams.vin = this.rowOption.vin

      if (this.dialogTab == 'first') {
        this.queryOne = true
        this.$refs.tabCar.clear()
        this.$refs.tabCar.query(this.queryParams)
        this.queryParams.time = []
      } else if (this.dialogTab == 'second') {
        this.queryTwo = true
        this.$refs.tabCell.clear()
        this.$refs.tabCell.query(this.queryParams)
        this.queryParams.time = []
      } else if (this.dialogTab == 'third') {
        this.queryThree = true
        this.$refs.tabCelectrical.clear()
        this.$refs.tabCelectrical.query(this.queryParams)
        this.queryParams.time = []
      }
    },
    handleClick(tab, event) {
      this.dialogTab = tab.name
      // 如果对应tab页面没有第一次查询，需要默认查询
      if (this.dialogTab == 'first' && !this.queryOne) {
        this.queryParams.time = []
        this.$refs.tabCar.clear()
        this.$refs.tabCar.query(this.queryParams)
      } else if (this.dialogTab == 'second' && !this.queryTwo) {
        this.queryParams.time = []
        this.queryTwo = true
        this.$refs.tabCell.clear()
        this.$refs.tabCell.query(this.queryParams)
      } else if (this.dialogTab == 'third' && !this.queryThree) {
        this.queryParams.time = []
        this.queryThree = true
        this.$refs.tabCelectrical.clear()
        this.$refs.tabCelectrical.query(this.queryParams)
      }
    },
    handleClose() {
      this.$emit('update:showCarLine', false)
    },
  },
}
</script>
<style lang='scss' scoped>
</style>
