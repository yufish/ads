var fs = require("fs");
var path = require("path");
var config = require("./../config.js");
var jade = require('jade');
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
                 content=content.replace(/\{\{include (.+?)\.jade\}\}/g,function(r,r2){
                     var filename = path.join(path.dirname(path.join(config.demo_path, req.params[0])),r2+".jade");
                     var html = jade.render(fs.readFileSync(filename,'utf-8'), {filename:filename,pretty:true});
                     return html
                  })
                 content=content.replace(/\{\{include (.+?)\.html\}\}/g,function(r,r2){
                     var filename = path.join(path.dirname(path.join(config.demo_path, req.params[0])),r2+".html");
                     var html =fs.readFileSync(filename,'utf-8');
                     return html
                 })
                 return res.send(content);
             }
         });
     }
 }