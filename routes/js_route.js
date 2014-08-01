
var js_compile = require("./../util/js-compile.js");
var content_type_inspector = require("./../util/content-type-inspector.js")
var config = require("./../config.js");
var path = require("path");
var fs = require("fs");
module.exports = function(req, res, next) {
    var _path = req.params[0]

    var filePath = path.join(config.assets_path, "/js", _path + ".js");
    if (config.compress) {
        fileContent = js_compile(filePath);
    } else {
        fileContent = fs.readFileSync(filePath, "utf-8")
    }
    res.header('Content-Type', content_type_inspector(filePath));
    res.send(fileContent);
}