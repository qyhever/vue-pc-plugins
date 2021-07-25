module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true
  },
  extends: [
    'standard',
    'plugin:vue/recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    // 最佳实践
    'no-else-return': 1, // 禁止 if 语句中 return 语句之后有 else 块
    'radix': 1, // 强制在parseInt()使用基数参数

    // 变量声明
    'init-declarations': ['error', 'always'], // 声明变量必须赋值

    // ECMAScript6
    'no-var': 2, // 禁止使用 var 声明变量
    'object-shorthand': 2, // 要求使用对象方法名和属性名简写
    'prefer-arrow-callback': 2, // 要求回调函数使用箭头函数
    'prefer-rest-params': 2, // 要求使用剩余参数而不是 arguments

    // vue
    'vue/max-attributes-per-line': ['error', {
      'singleline': 3,
      'multiline': {
        'max': 1,
        'allowFirstLine': false
      }
    }]
  }
}