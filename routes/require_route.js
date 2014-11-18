var requirejs_combo = require("./../util/requirejs-combo.js");
var config = require("./../config.js");
var path = require("path");
var fs = require("fs");
module.exports = function(req, res, next) {
    var _path = req.params[0]
    requirejs_combo(config.assets_path + "/js/" + _path + ".rjs",(req.query.no_compress?false:true), function(e, data) {
        var filePath = path.join(config.assets_path, "/js", _path + ".r.js");
        res.sendfile(filePath,function(){
//            fs.unlink(filePath,function(e){
//                if(e) console.trace(e);
//            })
        })

    })
}