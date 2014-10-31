var fs = require('fs');
var zlib = require('zlib');
var StringDecoder = require('string_decoder').StringDecoder;

var FileController = function() {

}
FileController.prototype.writeAndCompressFile = function(data, file) {
    fs.writeFile(file,data , function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
        compressAndDelete(file);
    });

};

FileController.prototype.readCompressedFile = function(file, cb) {
    var inp1 = fs.createReadStream(file);
    var data = '';
    var decoder = new StringDecoder('utf8');
    var stream = inp1.pipe(zlib.createGunzip());

    stream.on('data', function(chunk) {
        data = data + decoder.write(chunk);
    });
    stream.on('close', function() {
       var obj = JSON.parse(data);
        cb(obj);
    });
};

function compressAndDelete(file) {
    var compress = zlib.createGzip(),
        input = fs.createReadStream(file),
        output = fs.createWriteStream(file + '.gz');

    input.pipe(compress).pipe(output);
}

FileController.prototype.loadFileIntoArray = function(file, cb) {
    var arr = [];
    var fs = require('fs'),
        readline = require('readline');

    var rd = readline.createInterface({
        input: fs.createReadStream(file),
        output: process.stdout,
        terminal: false
    });

    rd.on('line', function(line) {
        arr.push(line);
    });
    rd.on('close', function() {
        cb(arr);
    })
}

module.exports = new FileController();