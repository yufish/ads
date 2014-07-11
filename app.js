/**
 * Created by tianqi on 14-7-11.
 */
    var app, config, express, expressUglify, fs, http, less, lessmiddle, log4js, logger, path, rainbow;

    express = require('express');

    http = require('http');

    path = require('path');

    config = global.__CONFIG = require('./config.js');


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
        app.use("/assets", express["static"](config.assets_path));

        app.locals.pretty = true;
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

