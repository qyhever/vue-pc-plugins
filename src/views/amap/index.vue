<template>
  <div class="map-page">
    <div class="city-input">
      <el-input
        v-model="city"
        placeholder="请输入城市名字按回车确定"
        style="width: 240px"
        clearable
        @keyup.enter.native="onInputEnter"
      />
      <el-button class="clear-button" @click="onClear">
        清空
      </el-button>
    </div>
    <div id="mapContainer" class="map-container" />
  </div>
</template>

<script>
import { random } from 'lodash'
import asyncLoadScript from '@/utils/async-script'

const mapPlugins = [
  'CitySearch',
  'Scale',
  'ToolBar',
  'PlaceSearch',
  'InfoWindow',
  'DistrictSearch'
]
const mapPluginsStr = mapPlugins.map(item => 'AMap.' + item).join(',')
const url = 'https://webapi.amap.com/maps?v=2.0&key=9ace730e33248ef1f462160f85445847&plugin=' + mapPluginsStr

function districtSearchFn (value) {
  if (!districtSearchFn.ins) {
    const opts = {
      extensions: 'all',
      subdistrict: 1
    }
    districtSearchFn.ins = new window.AMap.DistrictSearch(opts)
  }
  return new Promise((resolve, reject) => {
    districtSearchFn.ins.search(value, (status, result) => {
      if (status === 'complete' && result.info === 'OK') {
        resolve(result)
      } else {
        reject(new Error(status))
      }
    })
  })
}

let polygons = []
export default {
  name: 'AMapPage',
  data () {
    return {
      city: ''
    }
  },
  mounted () {
    asyncLoadScript(url, window.AMap, err => {
      if (err) {
        this.$message.closeAll()
        this.$message.error('加载失败')
        return
      }
      this.init()
    })
  },
  beforeDestroy () {
    this.map && this.map.destroy()
  },
  methods: {
    init () {
      const AMap = window.AMap
      const map = new AMap.Map('mapContainer', {
        viewMode: '2D', // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 viewMode: '3D',
        zoom: 11
        // center: [116.397428, 39.90923] // 初始化地图中心点
      })
      this.map = map
      map.addControl(new AMap.Scale())
      map.addControl(new AMap.ToolBar())
      const placeSearch = new AMap.PlaceSearch()
      map.on('click', event => {
        console.log('event', event)
        // console.log(event.lnglat.getLng() + ',' + event.lnglat.getLat())
      })
      map.on('hotspotclick', event => {
        placeSearch.getDetails(event.id, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            console.log('result', result)
          }
        })
      })
    },
    onInputEnter () {
      const AMap = window.AMap
      const map = this.map
      districtSearchFn(this.city)
        .then(result => {
          if (result.districtList[0].level !== 'city') {
            this.$message.closeAll()
            this.$message.warning('请输入地级市名称!')
            return
          }
          console.log('result: ', result)
          map.setZoomAndCenter(9, result.districtList[0].center)
          const districtList = result.districtList[0].districtList
          const fillOpacity = Number(String(random(0.2, 0.9)).slice(0, 3))
          const pros = districtList.map(item => {
            return districtSearchFn(item.name).then(result => {
              const bounds = result.districtList[0].boundaries
              if (bounds) {
                for (let i = 0, l = bounds.length; i < l; i++) {
                  const polygon = new AMap.Polygon({
                    strokeWeight: 1,
                    path: bounds[i],
                    fillOpacity,
                    fillColor: '#80d8ff',
                    strokeColor: '#0091ea'
                  })
                  polygons.push(polygon)
                }
              }
            })
          })
          Promise.all(pros).then(() => {
            map.add(polygons)
            map.setFitView(polygons)
          })
        })
        .catch(err => {
          const message = err.message === 'no_data' ? '未查询到数据' : '查询失败'
          this.$message.closeAll()
          this.$message.warning(message)
        })
    },
    onClear () {
      const map = this.map
      polygons = []
      map.remove(polygons)
    }
  }
}
</script>

<style>
.map-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.city-input {
  z-index: 1;
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}
.clear-button {
  margin-left: 20px;
}
</style>
