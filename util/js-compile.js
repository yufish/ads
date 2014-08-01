var UglifyJS = require("uglify-js");

module.exports = function(filePath, callback) {
    var result = UglifyJS.minify(filePath);
    return result.code;
}