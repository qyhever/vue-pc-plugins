<template>
  <div class="map-page">
    <div id="mapContainer" class="map-container" />
  </div>
</template>

<script>
import { random, subtract, add, divide, flattenDeep, max, min } from 'lodash'
import asyncLoadScript from '@/utils/async-script'
// import songziJsonData from '@/data/songzi/data.json'
// import gonganJsonData from '@/data/gongan/data.json'
// import lixianJsonData from '@/data/lixian/data.json'
// import anxiangJsonData from '@/data/anxiang/data.json'
import baoanJsonData from '@/data/baoan/data.json'
import nanshanJsonData from '@/data/nanshan/data.json'
import longhuaJsonData from '@/data/longhua/data.json'
import {
  transformWgs84ToGcj02
} from '@/utils/pos'

const mapPlugins = [
  'CitySearch',
  'Scale',
  'ToolBar',
  'PlaceSearch'
]
const mapPluginsStr = mapPlugins.map(item => 'AMap.' + item).join(',')
const url = 'https://webapi.amap.com/maps?v=2.0&key=9ace730e33248ef1f462160f85445847&plugin=' + mapPluginsStr

let polygons = []
let texts = []
let infoWindow = null

function generateInfoWindow (content) {
  infoWindow = new window.AMap.InfoWindow({
    content: '<div style="font-size: 12px">' + content + '</div>',
    isCustom: true,
    autoMove: false
  })
}

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
      // map.setZoomAndCenter(9, [
      //   111.60851085684304,
      //   30.17389903190419
      // ])
      function generatePolygon (jsonData, fillColor, strokeColor) {
        jsonData.forEach(item => {
          const fillOpacity = Number(String(random(0.1, 0.8)).slice(0, 3))
          item.coordinates.forEach(path => {
            const flattenedCoordinates = flattenDeep(path) // [lng1, lat1, lng2, lat2, ...]
            const lngs = []
            const lats = []
            flattenedCoordinates.forEach((v, i) => {
              if (i % 2 === 0) {
                lngs.push(v)
              } else {
                lats.push(v)
              }
            })
            const centerLng = divide(
              max(lngs) + min(lngs),
              2
            )
            const centerLat = divide(
              max(lats) + min(lats),
              2
            )
            const posList = lngs.map((lng, i) => {
              return transformWgs84ToGcj02(lng, lats[i])
              // return [
              //   lng,
              //   lats[i]
              // ]
            })
            const polygon = new AMap.Polygon({
              strokeWeight: 1,
              path: posList,
              fillOpacity,
              fillColor: fillColor || '#80d8ff',
              strokeColor: strokeColor || '#0091ea',
              extData: {
                name: item.name.replace('.json', ''),
                fillOpacity,
                centerPosition: [centerLng, centerLat]
              }
            })
            const text = new AMap.Text({
              text: item.name.replace('.json', ''),
              anchor: 'center',
              style: {
                'font-size': '10px',
                background: 'transparent',
                border: 0
              },
              position: [centerLng, centerLat]
            })
            polygon.on('mouseover', () => {
              const options = polygon.getOptions()
              // const extData = polygon.getExtData()
              polygon.setOptions({
                fillOpacity: add(options.fillOpacity, 0.05)
              })
              console.log('generateInfoWindow: ', generateInfoWindow)
              console.log('infoWindow: ', infoWindow)
              // if (!infoWindow) {
              //   generateInfoWindow(extData.name)
              //   infoWindow && infoWindow.open(map, extData.centerPosition)
              // }
            })
            polygon.on('mouseout', () => {
              const options = polygon.getOptions()
              polygon.setOptions({
                fillOpacity: subtract(options.fillOpacity, 0.05)
              })
              // infoWindow && infoWindow.close()
              // infoWindow = null
            })
            polygons.push(polygon)
            texts.push(text)
            text.setMap(map)
          })
        })
      }
      // 找配色 https://colors.ichuantong.cn/
      // generatePolygon(gonganJsonData)
      // generatePolygon(songziJsonData, '#ccebc5', '#2b8cbe')
      // generatePolygon(lixianJsonData, '#ffb3a7', '#ed5736')
      // generatePolygon(anxiangJsonData, '#eacd76', '#a78e44')
      generatePolygon(baoanJsonData, '#44cef6', '#177cb0')
      generatePolygon(nanshanJsonData, '#ffb3a7', '#ed5736')
      generatePolygon(longhuaJsonData, '#eacd76', '#a78e44')
      map.add(polygons)
      map.setFitView(polygons)
    },
    onClear () {
      const map = this.map
      map.remove(polygons)
      texts.forEach(text => {
        text.remove()
      })
      polygons = []
      texts = []
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
.amap-info {
  pointer-events: none !important;
}
</style>
