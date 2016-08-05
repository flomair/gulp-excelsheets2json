'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var XLSX = require('xlsx');

/**
 * excel filename or workbook to json
 * @param fileName
 * @returns {{}} json
 */

var toJson = function (workbook) {
      var result = {};
      workbook.SheetNames.forEach(function(sheetName) {
        var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName],{"header":0});
         if(roa.length > 0){
            var re = {"id":sheetName};
            for (var i = 0; i < roa.length; i++) {
                try {
                    re[roa[i]["oname"]] = JSON.parse(roa[i]["ovalue"]);
                }
                catch(err) {
                    re[roa[i]["oname"]] = roa[i]["ovalue"]
                }
            }
            result[sheetName] = re;
        }
      });
      return result;
    }


        module.exports = function (options) {
            options = options || {};
            return through.obj(function (file, enc, cb) {
                if (file.isNull()) {
                    this.push(file);
                    return cb();
                }

                if (file.isStream()) {
                    this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
                    return cb();
                }

                var arr = [];
                for (var i = 0; i < file.contents.length; ++i) arr[i] = String.fromCharCode(file.contents[i]);
                var bString = arr.join("");

                /* Call XLSX */
                var workbook = XLSX.read(bString, { type: "binary" });
                file.contents = new Buffer(JSON.stringify(toJson(workbook)));


                if (options.trace) {
                    console.log("convert file :" + file.path);
                }
                file.path = file.path.replace(".xlsx", ".json");
                this.push(file);
                // cb();
            });
        };
