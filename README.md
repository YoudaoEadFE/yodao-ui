# yodao-ui

前端业务组件库项目

框架：react + vite + storybook

[项目线上地址](https://youdaoeadfe.github.io/yodao-ui)

[story文档 ](https://storybook.js.org/docs/react/addons/addons-api#addonssetconfigconfig)

### 开发
```
 yarn storybook
```

### 打包
```
 yarn build
```

### 发布npm
```
  npm publish
```
[npm线上地址](https://www.npmjs.com/package/@youdao-ead-fe/yodao-ui)


### 使用组件库
```
  npm install @youdao-ead-fe/yodao-ui
  
  // 在入口文件如_app.js中引入style
  import '@youdao-ead-fe/yodao-ui/dist/style.css'
  
  // 在目标页面中
  import {MutipleSelector} from @youdao-ead-fe/yodao-ui
```



### 发布到github静态页
使用[@storybook/storybook-deployer文档](https://github.com/storybook-eol/storybook-deployer)发布到github

```
    yarn build-storybook
    
    // 在storybook-static 文件夹中添加.nojekyll文件
    
    yarn deploy-storybook -- --existing-output-dir=storybook-static
```


