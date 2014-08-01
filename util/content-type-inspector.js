var mime = require("mime");
var path = require("path");
module.exports = function(filePath) {
    return mime.lookup(path.extname(filePath));
}