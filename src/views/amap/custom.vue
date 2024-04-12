<template>
  <div class="map-page">
    <div id="mapContainer" class="map-container" />
  </div>
</template>

<script>
import { random } from 'lodash'
import asyncLoadScript from '@/utils/async-script'
import jsonData from '@/data/songzi/data.json'

const mapPlugins = [
  'CitySearch',
  'Scale',
  'ToolBar',
  'PlaceSearch',
  'InfoWindow',
  'DistrictSearch'
]
const mapPluginsStr = mapPlugins.map(item => 'AMap.' + item).join(',')
const url = 'https://webapi.amap.com/maps?v=2.0&key=6a169cffad64fb2322801c076ae7d3ec&plugin=' + mapPluginsStr

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
      this.onInputEnter()
    },
    onInputEnter () {
      const AMap = window.AMap
      const map = this.map
      // map.setZoomAndCenter(9, result.districtList[0].center)
      map.setZoomAndCenter(9, [
        111.60851085684304,
        30.17389903190419
      ])
      const fillOpacity = Number(String(random(0.2, 0.9)).slice(0, 3))
      console.log('jsonData', jsonData)
      jsonData.forEach(item => {
        console.log('name', item.name)
        const polygon = new AMap.Polygon({
          strokeWeight: 1,
          path: item.coordinates,
          fillOpacity,
          fillColor: '#80d8ff',
          strokeColor: '#0091ea'
        })
        polygons.push(polygon)
      })
      map.add(polygons)
      map.setFitView(polygons)
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
