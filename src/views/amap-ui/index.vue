<template>
  <div class="map-page">
    <!-- <div class="city-input">
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
    </div> -->
    <div id="mapContainer" class="map-container" />
  </div>
</template>

<script>
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
const mapURL = 'https://webapi.amap.com/maps?v=2.0&key=6a169cffad64fb2322801c076ae7d3ec&plugin=' + mapPluginsStr
const mapUIURL = 'https://webapi.amap.com/ui/1.1/main.js?v=1.1.1'

const colors = [
  '#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6', '#dd4477', '#66aa00',
  '#b82e2e', '#316395', '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300', '#8b0707',
  '#651067', '#329262', '#5574a6', '#3b3eac'
]

function asyncLoadScriptPro (mapURL, varible) {
  return new Promise((resolve, reject) => {
    asyncLoadScript(mapURL, varible, err => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}

let polygons = []
export default {
  name: 'AMapUIPage',
  data () {
    return {
      city: ''
    }
  },
  async mounted () {
    try {
      await asyncLoadScriptPro(mapURL, window.AMap)
      await asyncLoadScriptPro(mapUIURL, window.AMapUI)
      this.init()
    } catch (err) {
      console.log('err: ', err)
      this.$message.closeAll()
      this.$message.error('加载失败')
    }
  },
  beforeDestroy () {
    this.map && this.map.destroy()
  },
  methods: {
    init () {
      const AMap = window.AMap
      const AMapUI = window.AMapUI
      const map = new AMap.Map('mapContainer', {
        zoom: 11
      })
      this.map = map
      AMapUI.load(['ui/geo/DistrictExplorer'], (DistrictExplorer) => {
        // 创建一个实例
        const districtExplorer = window.districtExplorer = new DistrictExplorer({
          eventSupport: true, // 打开事件支持
          map
        })

        // 当前聚焦的区域
        let currentAreaNode = null

        // 鼠标hover提示内容
        const tipMarker = new AMap.Marker({
          content: '<div class="tipMarker top"></div>',
          offset: new AMap.Pixel(0, 0),
          bubble: true
        })

        // 根据Hover状态设置相关样式
        function toggleHoverFeature (feature, isHover, position) {
          tipMarker.setMap(isHover ? map : null)

          if (!feature) {
            return
          }

          const props = feature.properties

          if (isHover) {
            // 更新提示内容
            tipMarker.setContent(`<div class="tipMarker top">${props.adcode + ': ' + props.name}</div>`)
            // 更新位置
            tipMarker.setPosition(position || props.center)
          }

          // 更新相关多边形的样式
          const polys = districtExplorer.findFeaturePolygonsByAdcode(props.adcode)
          for (let i = 0, len = polys.length; i < len; i++) {
            polys[i].setOptions({
              fillOpacity: isHover ? 0.3 : 0.2
            })
          }
        }

        // 监听feature的hover事件
        districtExplorer.on('featureMouseout featureMouseover', (e, feature) => {
          toggleHoverFeature(feature, e.type === 'featureMouseover',
            e.originalEvent ? e.originalEvent.lnglat : null)
        })

        // 监听鼠标在feature上滑动
        districtExplorer.on('featureMousemove', (e, feature) => {
          // 更新提示位置
          tipMarker.setPosition(e.originalEvent.lnglat)
        })

        // feature被点击
        districtExplorer.on('featureClick', (e, feature) => {
          const props = feature.properties
          // 如果存在子节点
          // if (props.childrenNum > 0) {
          // 切换聚焦区域
          switch2AreaNode(props.adcode)
          // }
        })

        // 外部区域被点击
        districtExplorer.on('outsideClick', (e) => {
          districtExplorer.locatePosition(e.originalEvent.lnglat, (error, routeFeatures) => {
            console.log('error: ', error)
            if (routeFeatures && routeFeatures.length > 1) {
              // 切换到省级区域
              switch2AreaNode(routeFeatures[1].properties.adcode)
            } else {
              // 切换到全国
              switch2AreaNode(100000)
            }
          }, {
            levelLimit: 2
          })
        })

        // 绘制某个区域的边界
        function renderAreaPolygons (areaNode) {
          // 更新地图视野
          map.setBounds(areaNode.getBounds(), null, null, true)

          // 清除已有的绘制内容
          districtExplorer.clearFeaturePolygons()

          // 绘制子区域
          districtExplorer.renderSubFeatures(areaNode, (feature, i) => {
            const fillColor = colors[i % colors.length]
            const strokeColor = colors[colors.length - 1 - i % colors.length]

            return {
              cursor: 'default',
              bubble: true,
              strokeColor, // 线颜色
              strokeOpacity: 1, // 线透明度
              strokeWeight: 1, // 线宽
              fillColor, // 填充色
              fillOpacity: 0.35 // 填充透明度
            }
          })

          // 绘制父区域
          districtExplorer.renderParentFeature(areaNode, {
            cursor: 'default',
            bubble: true,
            strokeColor: 'black', // 线颜色
            strokeOpacity: 1, // 线透明度
            strokeWeight: 1, // 线宽
            fillColor: areaNode.getSubFeatures().length ? null : colors[0], // 填充色
            fillOpacity: 0.35 // 填充透明度
          })
        }

        // 切换区域后刷新显示内容
        function refreshAreaNode (areaNode) {
          districtExplorer.setHoverFeature(null)

          renderAreaPolygons(areaNode)
        }

        // 切换区域
        function switch2AreaNode (adcode, callback) {
          if (currentAreaNode && ('' + currentAreaNode.getAdcode() === '' + adcode)) {
            return
          }

          loadAreaNode(adcode, (error, areaNode) => {
            if (error) {
              if (callback) {
                callback(error)
              }

              return
            }

            currentAreaNode = window.currentAreaNode = areaNode

            // 设置当前使用的定位用节点
            districtExplorer.setAreaNodesForLocating([currentAreaNode])

            refreshAreaNode(areaNode)

            if (callback) {
              callback(null, areaNode)
            }
          })
        }

        // 加载区域
        function loadAreaNode (adcode, callback) {
          districtExplorer.loadAreaNode(adcode, (error, areaNode) => {
            if (error) {
              if (callback) {
                callback(error)
              }

              console.error(error)

              return
            }

            if (callback) {
              callback(null, areaNode)
            }
          })
        }

        // 全国
        switch2AreaNode(100000)
      })
    },
    onInputEnter () {
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
.tipMarker{
  color:#555;
  background-color:rgba(255,254,239,0.8);
  border:1px solid #7E7E7E;
  padding:2px 6px;
  font-size:12px;
  white-space:nowrap;
  display:inline-block;
}
.tipMarker:before,
.tipMarker:after{
  content:'';
  display:block;
  position:absolute;
  margin:auto;
  width:0;
  height:0;
  border:solid transparent;
  border-width:5px 5px;
}
.tipMarker.top{
  transform:translate(-50%,-110%);
}
.tipMarker.top:before,
.tipMarker.top:after{
  bottom:-9px;
  left:0;
  right:0;
  border-top-color:rgba(255,254,239,0.8);
}
.tipMarker.top:before{
  bottom:-10px;
  border-top-color:#7E7E7E;
}
</style>
