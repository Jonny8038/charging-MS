<template>
  <el-dialog title="历史轨迹" :visible="showCarLine"  :before-close="handleClose" width="60%" append-to-body>
    <el-form :inline="true" size='mini' ref="form">
      <el-form-item>
        <el-date-picker
          v-model="time"
          type="datetimerange"
          range-separator="至"
          :picker-options="pickerOptions"
          value-format='yyyy-MM-dd hh:mm:ss'
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
      <el-form-item>
        <i class="el-icon-video-play play-icon" title="开始播放" v-show="!play" @click="playLine"></i>
        <i class="el-icon-video-pause play-icon"  title="暂停播放" v-show="play" @click="stop"></i>
      </el-form-item>
    </el-form>
    <div class="line-map">
      <baidu-map
        class="bm-view"
        :zoom="12"
        :scroll-wheel-zoom="true"
        @ready="handler"
        :mapClick="false">
        <bm-polyline :path="lineData" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="3" :editing="false" :massClear="true"></bm-polyline>
        <bm-marker :icon="{url:startIcon,size: {width: 29, height: 35}}" :position="startPosition"></bm-marker>
        <bm-marker :icon="{url:endIcon,size: {width: 29, height: 35}}" :position="endPosition"></bm-marker>
      </baidu-map>
    </div>
  </el-dialog>
</template>

<script>
import {getAngle} from '@/utils/bDMap.js'
import { getCarLine } from '@/api/app/car'
let _minTime = null
let _maxTime = null
export default {
  name: 'carLineDialog',
  components:{
    // BmlLushu
  },
  props:{
    showCarLine:Boolean,
    vin:[Number,String]
  },
  data() {
    return {
      time:[],
      map:null,
      BMap:null,
      startIcon:require('@/assets/images/map/map-start.png'),
      endIcon:require('@/assets/images/map/map-end.png'),
      carIcon:require('@/assets/images/map/car1.png'),
      startPosition:{ lng: '', lat: '' },
      endPosition:{ lng:'', lat: '' },
      lineData:[],
      lineData1:[
        {
          lng: 116.380746,
          lat: 39.913335,
        },
        {
          lng: 116.380667,
          lat: 39.913334,

        },
        {
          lng: 116.380667,
          lat: 39.913334,

        },
        {
          lng: 116.380677,
          lat: 39.913584,

        },
        {
          lng: 116.380666,
          lat: 39.914004,

        },
        {
          lng: 116.380606,
          lat: 39.914722,

        },
        {
          lng: 116.380586,
          lat: 39.914882,

        },
        {
          lng: 116.380576,
          lat: 39.915252,

        },
        {
          lng: 116.380576,
          lat: 39.915252,

        },
        {
          lng: 116.380566,
          lat: 39.915401,

        },
        {
          lng: 116.380556,
          lat: 39.915521,

        },
        {
          lng: 116.380546,
          lat: 39.915631,

        },
        {
          lng: 116.380525,
          lat: 39.915831,

        },
        {
          lng: 116.380475,
          lat: 39.917029,

        },
        {
          lng: 116.380444,
          lat: 39.917709,

        },
        {
          lng: 116.380434,
          lat: 39.918078,

        },
        {
          lng: 116.380424,
          lat: 39.918168,

        },
        {
          lng: 116.380424,
          lat: 39.918318,

        },
        {
          lng: 116.380414,
          lat: 39.918408,

        },
        {
          lng: 116.380404,
          lat: 39.918618,

        },
        {
          lng: 116.380404,
          lat: 39.918788,

        },
        {
          lng: 116.380384,
          lat: 39.919147,

        },
        {
          lng: 116.380373,
          lat: 39.919427,

        },
        {
          lng: 116.380363,
          lat: 39.919727,

        },
        {
          lng: 116.380363,
          lat: 39.919807,

        },
        {
          lng: 116.380353,
          lat: 39.919896,

        },
        {
          lng: 116.380343,
          lat: 39.920086,

        },
        {
          lng: 116.380343,
          lat: 39.920126,

        },
        {
          lng: 116.380343,
          lat: 39.920126,

        },
        {
          lng: 116.380313,
          lat: 39.920765,

        },
        {
          lng: 116.380303,
          lat: 39.920845,

        },
        {
          lng: 116.380263,
          lat: 39.921374,

        },
        {
          lng: 116.380223,
          lat: 39.921544,

        },
        {
          lng: 116.380223,
          lat: 39.921584,

        },
        {
          lng: 116.380223,
          lat: 39.921614,

        },
        {
          lng: 116.380213,
          lat: 39.921913,

        },
        {
          lng: 116.380192,
          lat: 39.922283,

        },
        {
          lng: 116.380182,
          lat: 39.922603,

        },
        {
          lng: 116.380182,
          lat: 39.922663,

        },
        {
          lng: 116.380172,
          lat: 39.922732,

        },
        {
          lng: 116.380172,
          lat: 39.922792,

        },
        {
          lng: 116.380152,
          lat: 39.923352,

        },
        {
          lng: 116.380132,
          lat: 39.924101,

        },
        {
          lng: 116.380171,
          lat: 39.924212,

        },
        {
          lng: 116.380151,
          lat: 39.924742,

        },
        {
          lng: 116.380151,
          lat: 39.924742,

        },
        {
          lng: 116.380111,
          lat: 39.925351,

        },
        {
          lng: 116.380071,
          lat: 39.92547,

        },
        {
          lng: 116.380051,
          lat: 39.92591,

        },
        {
          lng: 116.380051,
          lat: 39.92612,

        },
        {
          lng: 116.380021,
          lat: 39.926819,

        },
        {
          lng: 116.380011,
          lat: 39.926969,

        },
        {
          lng: 116.379991,
          lat: 39.927548,

        },
        {
          lng: 116.379991,
          lat: 39.927748,

        },
        {
          lng: 116.379971,
          lat: 39.928018,

        },
        {
          lng: 116.379971,
          lat: 39.928318,

        },
        {
          lng: 116.379961,
          lat: 39.928508,

        },
        {
          lng: 116.38,
          lat: 39.928558,

        },
        {
          lng: 116.37998,
          lat: 39.928988,

        },
        {
          lng: 116.37996,
          lat: 39.930027,

        },
        {
          lng: 116.37996,
          lat: 39.930088,

        },
        {
          lng: 116.37996,
          lat: 39.930088,

        },
        {
          lng: 116.37993,
          lat: 39.930607,

        },
        {
          lng: 116.37991,
          lat: 39.930887,

        },
        {
          lng: 116.3799,
          lat: 39.931046,

        },
        {
          lng: 116.3799,
          lat: 39.931126,

        },
        {
          lng: 116.37989,
          lat: 39.931486,

        },
        {
          lng: 116.37987,
          lat: 39.931796,

        },
        {
          lng: 116.37986,
          lat: 39.932245,

        },
        {
          lng: 116.37984,
          lat: 39.932495,

        },
        {
          lng: 116.37984,
          lat: 39.932645,

        },
        {
          lng: 116.37983,
          lat: 39.932945,

        },
        {
          lng: 116.3798,
          lat: 39.933584,

        },
        {
          lng: 116.379751,
          lat: 39.934463,

        },
        {
          lng: 116.379741,
          lat: 39.934623,

        },
        {
          lng: 116.379731,
          lat: 39.935013,

        },
        {
          lng: 116.379721,
          lat: 39.935313,

        },
        {
          lng: 116.379681,
          lat: 39.935882,

        },
        {
          lng: 116.379681,
          lat: 39.936002,

        },
        {
          lng: 116.379611,
          lat: 39.937411,

        },
        {
          lng: 116.379552,
          lat: 39.93841,

        },
        {
          lng: 116.379542,
          lat: 39.93869,

        },
        {
          lng: 116.379542,
          lat: 39.93869,

        },
        {
          lng: 116.379691,
          lat: 39.938692,

        },
        {
          lng: 116.3798,
          lat: 39.938694,

        },
        {
          lng: 116.380387,
          lat: 39.938715,

        },
        {
          lng: 116.381023,
          lat: 39.938746,

        },
        {
          lng: 116.38145,
          lat: 39.938774,

        },
        {
          lng: 116.382315,
          lat: 39.938819,

        },
        {
          lng: 116.38308,
          lat: 39.938873,

        },
        {
          lng: 116.383399,
          lat: 39.938898,

        },
        {
          lng: 116.383568,
          lat: 39.938901,

        },
        {
          lng: 116.385308,
          lat: 39.93903,

        },
        {
          lng: 116.385894,
          lat: 39.93908,

        },
        {
          lng: 116.386252,
          lat: 39.939096,

        },
        {
          lng: 116.386461,
          lat: 39.939099,

        },
        {
          lng: 116.38662,
          lat: 39.939111,

        },
        {
          lng: 116.386819,
          lat: 39.939124,

        },
        {
          lng: 116.387446,
          lat: 39.939164,

        },
        {
          lng: 116.388401,
          lat: 39.939209,

        },
        {
          lng: 116.390282,
          lat: 39.939316,

        },
        {
          lng: 116.39055,
          lat: 39.939329,

        },
        {
          lng: 116.390799,
          lat: 39.939343,

        },
        {
          lng: 116.391078,
          lat: 39.939346,

        },
        {
          lng: 116.392442,
          lat: 39.939414,

        },
        {
          lng: 116.392442,
          lat: 39.939414,

        },
        {
          lng: 116.393498,
          lat: 39.939456,

        },
        {
          lng: 116.394683,
          lat: 39.939529,

        },
        {
          lng: 116.395809,
          lat: 39.939591,

        },
        {
          lng: 116.396049,
          lat: 39.939613,

        },
        {
          lng: 116.396079,
          lat: 39.939613,

        },
        {
          lng: 116.396348,
          lat: 39.939626,

        },
        {
          lng: 116.396746,
          lat: 39.939659,

        },
        {
          lng: 116.397524,
          lat: 39.939706,

        },
        {
          lng: 116.397783,
          lat: 39.939718,

        },
        {
          lng: 116.397943,
          lat: 39.939729,

        },
        {
          lng: 116.398332,
          lat: 39.939742,

        },
        {
          lng: 116.398591,
          lat: 39.939754,

        },
        {
          lng: 116.39917,
          lat: 39.939768,

        },
        {
          lng: 116.399459,
          lat: 39.93975,

        },
        {
          lng: 116.399589,
          lat: 39.939751,

        },
        {
          lng: 116.399719,
          lat: 39.939752,

        },
        {
          lng: 116.400148,
          lat: 39.939755,

        },
        {
          lng: 116.401755,
          lat: 39.939753,

        },
        {
          lng: 116.402164,
          lat: 39.939754,

        },
        {
          lng: 116.402384,
          lat: 39.939745,

        },
        {
          lng: 116.402624,
          lat: 39.939746,

        },
        {
          lng: 116.402724,
          lat: 39.939746,

        },
        {
          lng: 116.402724,
          lat: 39.939746,

        },
        {
          lng: 116.402993,
          lat: 39.939737,

        },
        {
          lng: 116.404262,
          lat: 39.939731,

        },
        {
          lng: 116.406512,
          lat: 39.939743,

        },
        {
          lng: 116.406622,
          lat: 39.939743,

        },
        {
          lng: 116.406882,
          lat: 39.939743,

        },
        {
          lng: 116.407762,
          lat: 39.939752,

        },
        {
          lng: 116.409303,
          lat: 39.939749,

        },
        {
          lng: 116.409503,
          lat: 39.939758,

        },
        {
          lng: 116.409533,
          lat: 39.939758,

        },
        {
          lng: 116.409623,
          lat: 39.939758,

        },
        {
          lng: 116.409773,
          lat: 39.939757,

        },
        {
          lng: 116.410274,
          lat: 39.939756,

        },
        {
          lng: 116.410805,
          lat: 39.939764,

        },
        {
          lng: 116.411526,
          lat: 39.93978,

        },
        {
          lng: 116.412137,
          lat: 39.939767,

        },
        {
          lng: 116.412217,
          lat: 39.939757,

        },
        {
          lng: 116.412458,
          lat: 39.939745,

        },
        {
          lng: 116.412738,
          lat: 39.939734,

        },
        {
          lng: 116.414963,
          lat: 39.939658,

        },
        {
          lng: 116.415004,
          lat: 39.939658,

        },
        {
          lng: 116.415174,
          lat: 39.939656,

        },
        {
          lng: 116.415274,
          lat: 39.939656,

        },
        {
          lng: 116.415274,
          lat: 39.939656,

        },
        {
          lng: 116.415545,
          lat: 39.939643,

        },
        {
          lng: 116.415856,
          lat: 39.939631,

        },
        {
          lng: 116.416448,
          lat: 39.939645,

        },
        {
          lng: 116.418093,
          lat: 39.939659,

        },
        {
          lng: 116.418354,
          lat: 39.939657,

        },
        {
          lng: 116.421246,
          lat: 39.939673,

        },
        {
          lng: 116.421356,
          lat: 39.939671,

        },
        {
          lng: 116.421477,
          lat: 39.93968,

        },
        {
          lng: 116.423275,
          lat: 39.939805,

        },
        {
          lng: 116.423506,
          lat: 39.939812,

        },
        {
          lng: 116.423617,
          lat: 39.93982,

        },
        {
          lng: 116.423617,
          lat: 39.93982,

        },
        {
          lng: 116.423868,
          lat: 39.939807,

        },
        {
          lng: 116.42414,
          lat: 39.939803,

        },
        {
          lng: 116.425818,
          lat: 39.939808,

        },
        {
          lng: 116.426241,
          lat: 39.939801,

        },
        {
          lng: 116.427467,
          lat: 39.939782,

        },
        {
          lng: 116.428302,
          lat: 39.939778,

        },
        {
          lng: 116.428382,
          lat: 39.939777,

        },
        {
          lng: 116.429941,
          lat: 39.93975,

        },
        {
          lng: 116.430112,
          lat: 39.939747,

        },
        {
          lng: 116.430746,
          lat: 39.939736,

        },
        {
          lng: 116.432064,
          lat: 39.939723,

        },
        {
          lng: 116.432255,
          lat: 39.93972,

        },
        {
          lng: 116.432255,
          lat: 39.93972,

        },
        {
          lng: 116.432225,
          lat: 39.93913,

        },
        {
          lng: 116.432215,
          lat: 39.938371,

        },
        {
          lng: 116.432235,
          lat: 39.9376,

        },
        {
          lng: 116.432245,
          lat: 39.93747,

        },
        {
          lng: 116.432295,
          lat: 39.936709,

        },
        {
          lng: 116.432305,
          lat: 39.936219,

        },
        {
          lng: 116.432376,
          lat: 39.935318,

        },
        {
          lng: 116.432496,
          lat: 39.934436,

        },
        {
          lng: 116.432507,
          lat: 39.934375,

        },
        {
          lng: 116.432527,
          lat: 39.934185,

        },
        {
          lng: 116.432567,
          lat: 39.933534,

        },
        {
          lng: 116.432577,
          lat: 39.933444,

        },
        {
          lng: 116.432607,
          lat: 39.932714,

        },
        {
          lng: 116.432607,
          lat: 39.932624,

        },
        {
          lng: 116.432668,
          lat: 39.931363,

        },
        {
          lng: 116.432698,
          lat: 39.930832,

        },
        {
          lng: 116.432668,
          lat: 39.930623,

        },
        {
          lng: 116.432648,
          lat: 39.930533,

        },
        {
          lng: 116.432638,
          lat: 39.930413,

        },
        {
          lng: 116.432638,
          lat: 39.930413,

        },
        {
          lng: 116.432598,
          lat: 39.930114,

        },
        {
          lng: 116.432648,
          lat: 39.929313,

        },
        {
          lng: 116.432669,
          lat: 39.929063,

        },
        {
          lng: 116.432689,
          lat: 39.928783,

        },
        {
          lng: 116.432729,
          lat: 39.928242,

        },
        {
          lng: 116.432739,
          lat: 39.928032,

        },
        {
          lng: 116.43275,
          lat: 39.927892,

        },
        {
          lng: 116.43278,
          lat: 39.927371,

        },
        {
          lng: 116.43281,
          lat: 39.926851,

        },
        {
          lng: 116.432821,
          lat: 39.92676,

        },
        {
          lng: 116.432841,
          lat: 39.92629,

        },
        {
          lng: 116.432881,
          lat: 39.92565,

        },
        {
          lng: 116.432892,
          lat: 39.925359,

        },
        {
          lng: 116.432892,
          lat: 39.925329,

        },
        {
          lng: 116.432902,
          lat: 39.925249,

        },
        {
          lng: 116.432942,
          lat: 39.924549,

        },
        {
          lng: 116.432993,
          lat: 39.923298,

        },
        {
          lng: 116.432994,
          lat: 39.923158,

        },
        {
          lng: 116.433014,
          lat: 39.922728,

        },
        {
          lng: 116.433014,
          lat: 39.922318,

        },
        {
          lng: 116.433025,
          lat: 39.921898,

        },
        {
          lng: 116.433035,
          lat: 39.921698,

        },
        {
          lng: 116.433045,
          lat: 39.921618,

        },
        {
          lng: 116.433055,
          lat: 39.921527,

        },
        {
          lng: 116.433065,
          lat: 39.921437,

        },
        {
          lng: 116.433106,
          lat: 39.920977,

        },
        {
          lng: 116.433146,
          lat: 39.920496,

        },
        {
          lng: 116.433156,
          lat: 39.920286,

        },
        {
          lng: 116.433228,
          lat: 39.918915,

        },
        {
          lng: 116.433259,
          lat: 39.918285,

        },
        {
          lng: 116.433269,
          lat: 39.918174,

        },
        {
          lng: 116.433289,
          lat: 39.918054,

        },
        {
          lng: 116.433309,
          lat: 39.917854,

        },
        {
          lng: 116.433329,
          lat: 39.917693,

        },
        {
          lng: 116.43334,
          lat: 39.917443,

        },
        {
          lng: 116.43336,
          lat: 39.917063,

        },
        {
          lng: 116.433381,
          lat: 39.916673,

        },
        {
          lng: 116.433401,
          lat: 39.916263,

        },
        {
          lng: 116.433401,
          lat: 39.916263,

        },
        {
          lng: 116.432526,
          lat: 39.916258,

        },
        {
          lng: 116.432415,
          lat: 39.91623,

        },
        {
          lng: 116.432274,
          lat: 39.916223,

        },
        {
          lng: 116.432174,
          lat: 39.916225,

        },
        {
          lng: 116.432073,
          lat: 39.916206,

        },
        {
          lng: 116.431771,
          lat: 39.916112,

        },
        {
          lng: 116.43157,
          lat: 39.916055,

        },
        {
          lng: 116.430846,
          lat: 39.916068,

        },
        {
          lng: 116.430846,
          lat: 39.916068,

        },
        {
          lng: 116.430806,
          lat: 39.916069,

        },
        {
          lng: 116.430806,
          lat: 39.916069,

        },
        {
          lng: 116.430584,
          lat: 39.916063,

        },
        {
          lng: 116.429065,
          lat: 39.916048,

        },
        {
          lng: 116.429065,
          lat: 39.916048,

        },
        {
          lng: 116.429076,
          lat: 39.915938,

        },
        {
          lng: 116.428945,
          lat: 39.915571,

        },
        {
          lng: 116.428845,
          lat: 39.915442,

        },
        {
          lng: 116.428805,
          lat: 39.915243,

        },
        {
          lng: 116.428815,
          lat: 39.915063,

        },
        {
          lng: 116.428825,
          lat: 39.914573,

        },
        {
          lng: 116.428825,
          lat: 39.914573,

        },
        {
          lng: 116.428071,
          lat: 39.914576,

        },
        {
          lng: 116.427679,
          lat: 39.914562,

        },
        {
          lng: 116.427307,
          lat: 39.914568,

        },
        {
          lng: 116.427307,
          lat: 39.914568,

        },
        {
          lng: 116.427256,
          lat: 39.915598,

        },
        {
          lng: 116.427235,
          lat: 39.915829,

        },
        {
          lng: 116.427195,
          lat: 39.915929,

        },
        {
          lng: 116.427195,
          lat: 39.915929,

        },
        {
          lng: 116.427034,
          lat: 39.915932,

        },
        {
          lng: 116.426582,
          lat: 39.915929,

        },
        {
          lng: 116.426511,
          lat: 39.91593,

        },
        {
          lng: 116.4262,
          lat: 39.915925,

        },
        {
          lng: 116.425576,
          lat: 39.915925,

        },
        {
          lng: 116.425506,
          lat: 39.915926,

        },
        {
          lng: 116.424481,
          lat: 39.915851,

        },
        {
          lng: 116.424481,
          lat: 39.915851,

        },
        {
          lng: 116.42445,
          lat: 39.916302,

        },
        {
          lng: 116.424249,
          lat: 39.916305,

        },
        {
          lng: 116.424249,
          lat: 39.916305,

        },
        {
          lng: 116.42428,
          lat: 39.915754,

        },
        {
          lng: 116.42429,
          lat: 39.915484,

        },
        {
          lng: 116.424311,
          lat: 39.914934,

        },
        {
          lng: 116.424331,
          lat: 39.914714,

        },
        {
          lng: 116.424331,
          lat: 39.914654,

        }
      ],
      isEnd:false,
      play:false,
      carObj:null,
      step:0,
      pois:[],
      timer:null,
      _minTime:'',
      _maxTime:'',
      pickerMinDate:'',//获取开始选择时间
      pickerMaxDate:'',//获取结束选择时间
      pickerOptions: { //时间范围选择控制
        onPick: ({ maxDate, minDate }) => {
          if(minDate){
            this.pickerMinDate = minDate.getTime()
          }
          if (maxDate) {
            this.pickerMinDate = ''
            this.pickerMaxDate =  maxDate.getTime()
          }
        },
        disabledDate: (time) => {
          const day30 = (30 - 1) * 24 * 3600 * 1000
          if (this.pickerMinDate !== '') {
            let maxTime = this.pickerMinDate + day30
            if (maxTime > new Date()) {
              maxTime = new Date()
            }
            return time.getTime() > maxTime || time.getTime() > Date.now()
          }
          if (this.pickerMaxDate !== '' && !this.pickerMinDate) {
            let minTime = this.pickerMaxDate - day30
            return time.getTime() < minTime || time.getTime() > Date.now()
          }
          return time.getTime() > Date.now()
        }
      },
    }
  },
  methods: {
    //查询轨迹
    handleQuery(){
      let query={};
      this.lineData=[];
      this.startPosition={ lng: '', lat: '' };
      this.endPosition={ lng: '', lat: '' };
      if(this.time.length){
        query={
          startTime:this.time[0],
          endTime:this.time[1],
          vin:this.vin
        }
      }else{
        query={
          startTime:'',
          endTime:'',
          vin:this.vin
        }
      }
      getCarLine(query).then((response)=>{
        let lineArr=response.rows;
        if(lineArr.length){
          lineArr.forEach((item)=>{
            let obj={};
            obj.lng=Number(item.positionX);
            obj.lat=Number(item.positionY);
            this.lineData.push(obj);
          });
          this.startPosition={lng: this.lineData[0].lng, lat: this.lineData[0].lat}
          this.endPosition={lng: this.lineData[this.lineData.length-1].lng, lat: this.lineData[this.lineData.length-1].lat}
          this.$nextTick(()=>{
            this.map.setViewport(this.lineData);
          })
        }else{
          this.msgError('暂无轨迹！');
        }

      })
    },
    handleClose(){
      this.$emit('update:vin','');
      this.$emit('update:showCarLine',false);
    },
    //获取当前定位
    location(BMap,map){
      var point = new BMap.Point(116.331398,39.897445);
      map.centerAndZoom(point,12);
      // var geolocation = new BMap.Geolocation();
      // geolocation.getCurrentPosition(function(r){
      //   if(this.getStatus() == BMAP_STATUS_SUCCESS){
      //     // var mk = new BMap.Marker(r.point);
      //     // map.addOverlay(mk);
      //     map.panTo(r.point);
      //   }
      //   else {
      //     alert('failed'+this.getStatus());
      //   }
      // });
    },
    //地图加载完成
    handler({ BMap, map }){
      this.map=map;
      this.BMap=BMap;
      this.location(this.BMap,this.map);
      // map.setViewport(this.lineData);
      // this.lushuLine();
      this.handleQuery();
    },
    //车辆行驶
    run(map){
      this.isEnd=true;
      this.pois=[];
      if(this.lineData.length){
        this.lineData.forEach((item)=>{
          var point=new BMap.Point(item.lng,item.lat);
          this.pois.push(point)
        })
      }else{
        return false;
      }
      var myIcon = new BMap.Icon(this.carIcon, new BMap.Size(52,26), {
        anchor : new BMap.Size(27, 13),
        imageSize:new BMap.Size(52,26)
      });

      map.setViewport(this.lineData);// 根据提供的地理区域或坐标设置地图视野

      var paths = this.pois.length;    //获得有几个点
      if(!this.carObj){
        this.carObj = new BMap.Marker(this.pois[0],{icon:myIcon});
        map.addOverlay(this.carObj);
      }
      this.stepMax=paths;
      this.clearTimer();
      this.timer=setInterval(()=>{
        this.resetMkPoint(map,this.carObj,this.step,this.pois);
      },300)

    },
    resetMkPoint(map,carMk,index,pois){
      map.setViewport(this.lineData);// 根据提供的地理区域或坐标设置地图视野
      carMk.setPosition(pois[index]);
      if(index < pois.length-1){
        carMk.setRotation(pois[index+1]);//trackUnit.route
      }
      //getAngle(point,prePoint);// js求解两点之间的角度
      if(index>0&&index < pois.length-1){
        carMk.setRotation(getAngle(pois[index],pois[index-1])-90);// 旋转的角度
      }
      index++;
      this.step=index;
      if(index < pois.length&&this.isEnd){
        if(index == pois.length-1){
          this.isEnd=false;
          this.step=0;
          this.play = false;
          map.removeOverlay(this.carObj);
          this.carObj=null;
          this.clearTimer();
        }else{
          // this.resetMkPoint(map,carMk,index,pois);
        }
      }
    },
    playLine(){
      this.play = true;
      this.run(this.map)
    },
    //暂停
    stop(){
      this.play = false;
      this.isEnd=false;
      this.clearTimer()
    },
    clearTimer(){
      if(this.timer){
        clearInterval(this.timer);
        this.timer=null;
      }
    }
  },
  mounted() {

  },
  beforeDestroy() {
    this.clearTimer();
  }
}
</script>

<style lang="scss" scoped>
  .play-icon{
    font-size: 30px;
    cursor: pointer;
    color:#1989fa;
  }
  .line-map{
    width:100%;
    height: 400px;
    .bm-view{
      width:100%;
      height:100%;
    }
  }
</style>
