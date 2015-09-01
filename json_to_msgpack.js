var msgpack = require('msgpack-lite'),
    fs = require('fs')

function eachFiles(filePath, rootPath, callback) {
    if (!rootPath) {
        rootPath = filePath;
    }
    var stat = fs.statSync(filePath);
    if (!stat) {

    } else if (stat.isDirectory()) {
        try {
            var files = fs.readdirSync(filePath);
            if (!files) {

            } else {
                for (var _i in files)(function (i) {
                    var file = files[i];
                    if (filePath.match(/.*\/$/)) {
                        eachFiles(filePath + file, rootPath, callback);
                    } else {
                        eachFiles(filePath + "/" + file, rootPath, callback);
                    }
                }(_i));
            }
        } catch (e1) {
            console.error("Directory " + filePath + " is unreadable.");
        }
    } else if (stat.isFile()) {
        if (callback) {
            callback.call(this, filePath, rootPath);
        }
    } else {
        console.error(filePath + " is not file or directory");
    }
}

var reg = /\.json$/i
eachFiles(process.argv[2], null, function(filePath){
    if (!(reg.test(filePath))) return;

    var data = fs.readFileSync(filePath)
    if(data){
        var ws = fs.createWriteStream(filePath.replace(reg, '.bin'))
          , es = msgpack.createEncodeStream()
        es.pipe(ws)
        es.write(JSON.parse(data))
    }
})
