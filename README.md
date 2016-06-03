## YAOPAI - photographer

YAOPAI摄影师端

### 使用方法

- 初始化安装 ```npm install```
- dev ```npm run start```  开发模式[^1]
	- 页面访问目录：http://localhost:8000/
	- 目录app/src下的.js文件，支持hot loader[^2]
- build ```npm run build``` 发布模式
	- 打包app到app/dist目录下
	- app.\*.js 是主程序
- test ```npm run test``` 测试模式
	- 控件在app/scripts
	- 测试在app/test

### 本框架用Yeoman Generator生成，包含主要模块有：

- react
- react-router
- reflux


### css 直接在html文件中使用boostrap

### jquery 也是在html文件中直接使用


### 安装使用：Yeoman Generator

- ```npm install -g yo```
- ```npm install -g generator-react-reflux```
- ```yo react-reflux [app-name]```

- 生成component模块
  - ```yo react-reflux:component name_of_component```
  	生成文件在app/scripts/compenents下
- 生成Actions
  - ```yo react-reflux:actions name_of_action```
  	生成文件在app/scripts/actions下
- 生成Store
	- ```yo react-reflux:store user```
	生成文件在app/scripts/stores下


### 参考：
Yeoman Generator  
[https://github.com/TFaga/generator-react-reflux](https://github.com/TFaga/generator-react-reflux)

聊一聊基于flux的前端系统  
[http://react.nodejs-china.org/t/flux/615](https://github.com/TFaga/generator-react-reflux)

### 兼容windows

- Failed at the contextify@0.1.15 install script 'node-gyp rebuild'
> 解决方案：  
> 下载别人编译的contextify的zip包，[https://github.com/Benvie/contextify/zipball/master](https://github.com/Benvie/contextify/zipball/master)  
> 将内容保存到node_modules目录中，改名为contextify
- UNMET PEER DEPENDENCY history@^1.12.0  
> ```npm install history```

解决了这2个问题后 直接npm run start就可以了
