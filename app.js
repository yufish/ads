/**
 * Created by tianqi on 14-7-11.
 */





var config = global.__CONFIG = require('./config.js');
var content_type_inspector = require("./util/content-type-inspector.js")
var lessmiddle = require('./libs/less-middleware/lib/middleware.js');

var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var log4js = require('log4js');
app.configure(function() {
    // app.disable('etag')
    app.set("port", config.run_port);
    app.set("views", config.demo_path);
    app.set("view engine", "jade");
    app.use(express.favicon());
    //日志支持
    log4js.configure({
        appenders: [{
            type: 'console'
        }]
    });
    logger = log4js.getLogger('normal');
    logger.setLevel('INFO');
    app.use(log4js.connectLogger(logger, {
        level: log4js.levels.INFO
    }));
    app.use(function(req, res, next) {
        res.header("Cache-Control", "max-age=2592000")
        next();
    })
    app.use("/assets", lessmiddle({
        src: config.assets_path,
        compress: false,
        force: true
    }));

    //combo service 多个文件合并
    //like this : http://f2e.souche.com/assets/$$js/index.js,css/index.css
    app.get(/\/assets\/(.*?)\$\$(.*)$/, require("./routes/combo_route.js"));

    //requirejs 实时打包
    app.get(/\/assets\/js\/(.*?)\.r\.js/, require("./routes/require_route.js"));

    //js 静态服务，支持压缩
    //
    app.get(/assets\/js\/(.*?)\.js/, require("./routes/js_route.js"));

    //其他文件的静态服务
    app.get(/assets\/(.*)$/, function(req, res, next) {
        var _path = req.params[0]
        var filePath = path.join(config.assets_path, _path);
        res.sendfile(filePath)
    });

    //demo服务，支持jade和普通的html
    app.get(/^\/demo\/(.*)$/, require("./routes/demo_route.js"));

    app.locals.pretty = true;
    app.all("*", function(req, res, next) {
        return res.send("页面不存在", 404);
    });
    app.use(function(err, req, res, next) {
        console.trace(err);
        return res.send(err.message, 404);
    });
    app.locals.moment = require('moment');
    return app.locals.moment.lang('zh-cn');
});

app.set('env', 'development');

app.configure("development", function() {
    return app.use(express.errorHandler());
});
require('http').createServer(app).listen(config.run_port, function() {
    console.log("Express server listening on port " + app.get("port"));
}).setMaxListeners(0);
module.exports = app;