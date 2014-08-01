var less = require("less")
var fs = require("fs")
var path = require("path")
var config = require("./../config.js")

module.exports = function(filePath, callback) {
    var parser = new(less.Parser)({
        paths: [path.dirname(filePath)], // Specify search paths for @import directives
        compress: false,
        force: true
    });
    parser.parse(fs.readFileSync(filePath, "utf-8"), function(e, tree) {
        if (e) {
            console.log(e)
            callback(e)
        } else {
            callback(e, tree.toCSS({
                // Minify CSS output
                compress: true
            }));
        }

    });
}