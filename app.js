// 开启http服务 引入http模块
let http = require('http');
// 生成路径 path
let path = require('path');
// 引入文件系统
let fs = require('fs');
// require mime 模块 第三方模块
let mime = require('mime');
// 引入querystring模块
let querystring = require('querystring');
// 配置网站根目录
let rootPath = path.join(__dirname, "www");
// console.log("根目录是:", rootPath);

// 开启服务
http.createServer((request, response) => {
    let filePath = path.join(rootPath, querystring.unescape(request.url));
    // console.log(filePath);
    // 判断访问的这个目录(文件)是否存在
    let isExist = fs.existsSync(filePath);
    // console.log(isExist);
    // 如果存在 文件夹或者文件
    if (isExist) {
        fs.readdir(filePath, (err, files) => {
                // 不是文件夹 就回出错了 就是文件
                if (err) {
                    fs.readFile(filePath, (err, data) => {
                            if (err) {

                            } else {
                                // 判断文件类型 设置不同的mime类型返回给浏览器
                                response.writeHead(200, {
                                    'content-type': mime.getType(filePath)
                                });
                                response.end(data)
                            }
                        })
                        // 如果是文件夹
                } else {
                    console.log(files);
                    // 直接判断 是否存在首页
                    if (files.indexOf("index.html") != -1) {
                        console.log("有首页"),
                            // 读取首页
                            fs.readFile(path.join(filePath, "index.html"), (err, data) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(data);
                                }
                            })
                            // 如果没有首页
                    } else {
                        // 声明一个backData
                        let backData = "";
                        for (let i = 0; i < files.length; i++) {
                            // 根目录 request.url=> /
                            // 默认拼接都是./只能访问根目录
                            // 根据请求的url 进行判断 拼接上一级目录的地址 即可进行访问
                            backData += `<h2><a href="${request.url=='/'?'':request.url}/${files[i]}">${files[i]}</a></h2>`
                        }
                        response.writeHead(200, {
                            'content-type': 'text/html;charset=utf-8'
                        });
                        response.end(backData)
                    }
                }
            })
            // 如果不存在
    } else {
        // 返回404
        response.writeHead(404, {
            'content-type': 'text/html;charset=utf-8',
        });
        response.end(`
            <h2>not find  404</h2>
        `)
    }

}).listen(80, '127.0.0.1', () => {
    console.log("监听成功");
})