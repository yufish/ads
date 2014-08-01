/**
 * Created by tianqi on 14-7-11.
 */
var app, config, express, expressUglify, fs, http, less, lessmiddle, log4js, logger, path, rainbow;

express = require('express');

http = require('http');

path = require('path');

config = global.__CONFIG = require('./config.js');

var requirejs_combo = require("./util/requirejs-combo.js")
var less_compile = require("./util/less-compile.js");
var queuedo = require("queuedo");
var content_type_inspector = require("./util/content-type-inspector.js")
var js_compile = require("./util/js-compile.js");
lessmiddle = require('./libs/less-middleware/lib/middleware.js');

less = require('less');

fs = require('fs');

expressUglify = require('express-uglify');

app = express();

app.configure(function() {
    app.set("port", config.run_port);
    app.set("views", config.demo_path);
    app.set("view engine", "jade");
    app.use(express.favicon());
    app.use("/assets", lessmiddle({
        src: config.assets_path,
        compress: false,
        force: true
    }));
    //http://f2e.souche.com/assets/$$js/index.js,css/index.css
    app.get(/\/assets\/(.*?)\$\$(.*)$/, function(req, res, next) {
        var _path = req.params[0]
        var files = req.params[1].split(",");
        var str = "";
        queuedo(files, function(file, next, context) {
            var filePath = path.join(config.assets_path, _path, file);
            var fileContent = "";
            var extname = path.extname(filePath)
            if (extname == ".css") {
                var lessFilePath = filePath.replace(/\.css$/, ".less");
                if (fs.existsSync(lessFilePath)) {
                    fileContent = less_compile(lessFilePath, function(error, lessContent) {

                        str += lessContent + "\n"
                        next.call(context);
                    })
                    return;
                } else {
                    if (config.compress && extname == ".js") {
                        fileContent = js_compile(filePath);
                    } else {
                        fileContent = fs.readFileSync(filePath, "utf-8")
                    }
                }
            } else {
                if (config.compress && extname == ".js") {
                    fileContent = js_compile(filePath);
                } else {
                    fileContent = fs.readFileSync(filePath, "utf-8")
                }
            }
            str += fileContent + "\n"
            next.call(context);
        }, function() {
            res.header('Content-Type', content_type_inspector(files));
            res.send(str);

        })


    });
    app.get(/\/assets\/js\/(.*?)\.r\.js/, function(req, res, next) {
        var _path = req.params[0]
        requirejs_combo(config.assets_path + "/js/" + _path + ".rjs", function(e, data) {
            var filePath = path.join(config.assets_path, "/js", _path + ".r.js");
            console.log("js:" + filePath)
            res.sendfile(filePath)
        })
    });

    app.get(/assets\/js\/(.*?)\.js/, function(req, res, next) {
        var _path = req.params[0]

        var filePath = path.join(config.assets_path, "/js", _path + ".js");
        if (config.compress) {
            fileContent = js_compile(filePath);
        } else {
            fileContent = fs.readFileSync(filePath, "utf-8")
        }
        res.header('Content-Type', content_type_inspector(filePath));
        res.send(fileContent);
    });
    app.get(/assets\/(.*)$/, function(req, res, next) {
        var _path = req.params[0]
        var filePath = path.join(config.assets_path, _path);
        res.sendfile(filePath)
    });
    app.get(/^\/demo\/(.*)$/, function(req, res, next) {
        var _path;
        console.log(req.params[0]);
        res.locals.query = req.query;
        _path = path.join(config.demo_path, req.params[0] + ".jade");
        if (fs.existsSync(_path)) {
            return res.render(config.demo_path + req.params[0] + ".jade", {
                pretty: true
            });
        } else {
            return fs.readFile(path.join(config.demo_path, req.params[0]), 'utf-8', function(error, content) {
                if (error) {
                    return next(error);
                } else {
                    return res.send(content);
                }
            });
        }
    });

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