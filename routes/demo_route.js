var fs = require("fs");
var path = require("path");
var config = require("./../config.js");
 module.exports = function(req, res, next) {
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
 }