var less_compile = require("./../util/less-compile.js");
var js_compile = require("./../util/js-compile.js");
var content_type_inspector = require("./../util/content-type-inspector.js")
var config = require("./../config.js");
var path = require("path");
var fs = require("fs");
var queuedo = require("queuedo");

module.exports = function(req, res, next) {
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


}