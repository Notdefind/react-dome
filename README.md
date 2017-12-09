react 项目初始化

## 功能点:
* 统一配置API请求
* 开发 测试 预发 生产环境配置 及debug
* 路由 redux 模块化配置
* 添加项目全局配置

[node项目初始化](https://github.com/Notdefind/node-project)

## 项目相关依赖
* [react](https://github.com/facebook/react)
* [redux](https://github.com/rackt/redux)
* [react-redux](https://github.com/reactjs/react-redux)
* [react-router](https://github.com/rackt/react-router)
* [fetch](https://github.com/github/fetch)
* [webpack](https://github.com/webpack/webpack)
* [babel](https://github.com/babel/babel)
* [express](https://github.com/expressjs/express)
* [karma](https://github.com/karma-runner/karma)


## 需求配置
* node `^4.5.0`
* npm `^3.0.0`

## 开始

```bash
$ npm install | yarn            
$ npm start                
```

|`npm run <script>`|解释|
|------------------|-----------|
|`start`|服务启动在8000端口，代码热替换开启。|
|`compile`|编译程序到dist目录下（默认目录~/dist）。|
|`dev`|与`npm start`相同, 但是启动nodemon守护进程。|
|`dev:no-debug`|与`npm run dev` 但是禁用devtool（开发工具）。|
|`test`|开启Karma测试并生成覆盖率报告。|
|`test:dev`|开启Karma测试并监听改变随时重新测试，但是生成覆盖率报告。|
|`deploy`|启动代码检查，测试，如果成功，编译到dist目录下。|
|`deploy:dev`|与`deploy`相同，但是`NODE_ENV`值为"development"。|
|`deploy:prod`|与`deploy`相同，但是`NODE_ENV`值为"production"。|

## 目录


```
.
├── bin                      # 启动脚本
├── build                    # 所有打包配置项
│   └── webpack              # webpack的指定环境配置文件
├── config                   # 项目配置文件
├── server                   # Express 程序 (使用 webpack 中间件)
│   └── main.js              # 服务端程序入口文件
├── src                      # 程序源文件
│   ├── main.js              # 程序启动和渲染
│   ├── api                  # restful 服务器接口
│   ├── components           # 全局可复用的表现组件
│   ├── containers           # 全局可复用的容器组件
│       └──HomePage          # 业务模块
|          └──assets         # 依赖资源
|          └──Home           # 页面
|          └──components     # 模块复用组件
│   ├── services             # 服务类相关文件
│   ├── static               # 静态文件
│   ├── styles               # 程序样式
│   ├── store                # Redux指定块
│   ├── utils                # 工具类函数
│   ├── polyfills            # 处理兼容相关
│   └── routes               # 主路由和异步分割点
└── tests                    # 单元测试
```