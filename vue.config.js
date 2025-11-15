const path = require('path')
const MetaInfoPlugin = require('./build/meta')
const dayjs = require('dayjs')
const webpack = require('webpack')
const fs = require('fs')

const now = dayjs().format('YYYY-MM-DD HH:mm:ss')

function resolve (dir) {
  return path.join(__dirname, dir)
}
const publicPath = '/vue-pc-plugins/'
const PROT = process.env.PROT || 9000
module.exports = {
  publicPath,
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    port: PROT,
    setupMiddlewares (middlewares, { app }) {
      app.get('/users', (req, res) => {
        if (!req.query.keyword) {
          setTimeout(() => {
            res.send([
              { text: '刘洋' },
              { text: '张伟' },
              { text: '王芳' }
            ])
          }, 1000)
          return
        }
        setTimeout(() => {
          res.send([
            { text: '三全鲜食（北新泾店）', address: '长宁区新渔路144号' },
            { text: 'Hot honey 首尔炸鸡（仙霞路）', address: '上海市长宁区淞虹路661号' },
            { text: '新旺角茶餐厅', address: '上海市普陀区真北路988号创邑金沙谷6号楼113' },
            { text: '泷千家(天山西路店)', address: '天山西路438号' },
            { text: '胖仙女纸杯蛋糕（上海凌空店）', address: '上海市长宁区金钟路968号1幢18号楼一层商铺18-101' },
            { text: '贡茶', address: '上海市长宁区金钟路633号' },
            { text: '豪大大香鸡排超级奶爸', address: '上海市嘉定区曹安公路曹安路1685号' },
            { text: '茶芝兰（奶茶，手抓饼）', address: '上海市普陀区同普路1435号' },
            { text: '十二泷町', address: '上海市北翟路1444弄81号B幢-107' },
            { text: '星移浓缩咖啡', address: '上海市嘉定区新郁路817号' },
            { text: '阿姨奶茶/豪大大', address: '嘉定区曹安路1611号' },
            { text: '新麦甜四季甜品炸鸡', address: '嘉定区曹安公路2383弄55号' },
            { text: 'Monica摩托主题咖啡店', address: '嘉定区江桥镇曹安公路2409号1F，2383弄62号1F' },
            { text: '浮生若茶（凌空soho店）', address: '上海长宁区金钟路968号9号楼地下一层' },
            { text: 'NONO JUICE  鲜榨果汁', address: '上海市长宁区天山西路119号' },
            { text: 'CoCo都可(北新泾店）', address: '上海市长宁区仙霞西路' },
            { text: '快乐柠檬（神州智慧店）', address: '上海市长宁区天山西路567号1层R117号店铺' },
            { text: 'Merci Paul cafe', address: '上海市普陀区光复西路丹巴路28弄6号楼819' },
            { text: '猫山王（西郊百联店）', address: '上海市长宁区仙霞西路88号第一层G05-F01-1-306' },
            { text: '枪会山', address: '上海市普陀区棕榈路' },
            { text: '纵食', address: '元丰天山花园(东门) 双流路267号' },
            { text: '钱记', address: '上海市长宁区天山西路' },
            { text: '壹杯加', address: '上海市长宁区通协路' },
            { text: '唦哇嘀咖', address: '上海市长宁区新泾镇金钟路999号2幢（B幢）第01层第1-02A单元' },
            { text: '爱茜茜里(西郊百联)', address: '长宁区仙霞西路88号1305室' },
            { text: '爱茜茜里(近铁广场)', address: '上海市普陀区真北路818号近铁城市广场北区地下二楼N-B2-O2-C商铺' },
            { text: '鲜果榨汁（金沙江路和美广店）', address: '普陀区金沙江路2239号金沙和美广场B1-10-6' },
            { text: '开心丽果（缤谷店）', address: '上海市长宁区威宁路天山路341号' },
            { text: '超级鸡车（丰庄路店）', address: '上海市嘉定区丰庄路240号' },
            { text: '妙生活果园（北新泾店）', address: '长宁区新渔路144号' },
            { text: '香宜度麻辣香锅', address: '长宁区淞虹路148号' },
            { text: '凡仔汉堡（老真北路店）', address: '上海市普陀区老真北路160号' },
            { text: '港式小铺', address: '上海市长宁区金钟路968号15楼15-105室' },
            { text: '蜀香源麻辣香锅（剑河路店）', address: '剑河路443-1' },
            { text: '北京饺子馆', address: '长宁区北新泾街道天山西路490-1号' },
            { text: '饭典*新简餐（凌空SOHO店）', address: '上海市长宁区金钟路968号9号楼地下一层9-83室' },
            { text: '焦耳·川式快餐（金钟路店）', address: '上海市金钟路633号地下一层甲部' },
            { text: '动力鸡车', address: '长宁区仙霞西路299弄3号101B' },
            { text: '浏阳蒸菜', address: '天山西路430号' },
            { text: '四海游龙（天山西路店）', address: '上海市长宁区天山西路' },
            { text: '樱花食堂（凌空店）', address: '上海市长宁区金钟路968号15楼15-105室' },
            { text: '壹分米客家传统调制米粉(天山店)', address: '天山西路428号' },
            { text: '福荣祥烧腊（平溪路店）', address: '上海市长宁区协和路福泉路255弄57-73号' },
            { text: '速记黄焖鸡米饭', address: '上海市长宁区北新泾街道金钟路180号1层01号摊位' },
            { text: '红辣椒麻辣烫', address: '上海市长宁区天山西路492号' },
            { text: '(小杨生煎)西郊百联餐厅', address: '长宁区仙霞西路88号百联2楼' },
            { text: '阳阳麻辣烫', address: '天山西路389号' },
            { text: '南拳妈妈龙虾盖浇饭', address: '普陀区金沙江路1699号鑫乐惠美食广场A13' }
          ])
        }, 1000)
      })
      return middlewares
    },
    proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      '/api/mock': {
        target: 'http://localhost:' + PROT,
        changeOrigin: true,
        pathRewrite: {
          '^/api/mock': '/'
        }
      },
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },
  pluginOptions: {
    // import global scss variables and mixins
    // 'style-resources-loader': {
    //   preProcessor: 'scss',
    //   patterns: [resolve('./src/assets/styles/var.scss')]
    // }
  },
  configureWebpack: () => {
    return {
      resolve: {
        alias: {
          views: '@/views'
        }
      },
      plugins: [
        // new MetaInfoPlugin({ filename: 'dist/meta.json' })
      ]
    }
  },
  chainWebpack (config) {
    config.plugins.delete('prefetch')
    config.plugins.delete('preload')

    config.plugin('meta').use(MetaInfoPlugin, [
      {
        filename: 'dist/meta.json',
        now
      }
    ])

    // 添加插件，在编译阶段替换产物中的占位符，兼容 dev/prod
    // 仅在生产环境注册替换占位符的插件
    if (process.env.NODE_ENV === 'production') {
      config.plugin('hash-plugin').use(class {
        apply (compiler) {
          const RawSource = (compiler.webpack && compiler.webpack.sources && compiler.webpack.sources.RawSource)
            ? compiler.webpack.sources.RawSource
            : require('webpack-sources').RawSource

          compiler.hooks.thisCompilation.tap('HashPlugin', (compilation) => {
            const replaceInAssets = () => {
              const assets = compilation.assets
              Object.keys(assets).forEach((filename) => {
                if (!filename.endsWith('.js')) return
                const source = assets[filename].source().toString()
                if (!source.includes('__webpack_hash__')) return
                const newSource = source.replace(/__webpack_hash__/g, compilation.hash)

                if (compilation.updateAsset) {
                  // webpack 5
                  compilation.updateAsset(filename, new RawSource(newSource))
                } else {
                  // webpack 4
                  compilation.assets[filename] = new RawSource(newSource)
                }
              })
            }

            if (compilation.hooks.processAssets) {
              // webpack 5
              const stage = compiler.webpack && compiler.webpack.Compilation
                ? compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
                : undefined
              compilation.hooks.processAssets.tap({ name: 'HashPlugin', stage }, replaceInAssets)
            } else {
              // webpack 4
              compilation.hooks.optimizeAssets.tap('HashPlugin', replaceInAssets)
            }
          })
        }
      })
    }

    config.plugin('define').tap((args) => {
      // DefinePlugin 设置值 必须 JSON 序列化 或者 使用 双引号 包起来
      args[0]['process.env'].LOCAL_VERSION = process.env.NODE_ENV === 'production'
        ? '"__webpack_hash__"'
        : JSON.stringify(now)
      args[0].NODE_ENV = JSON.stringify(process.env.NODE_ENV)
      args[0].AMAP_JS_CODE = JSON.stringify(process.env.AMAP_JS_CODE)
      return args
    })

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: '@use "@/assets/styles/var.scss" as *;'
        // sassOptions: {
        //   additionalData: `@use "@/assets/styles/var.scss" as *;`
        // }
      }
    }
  }
}
