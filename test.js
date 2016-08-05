'use strict';
var gulp = require('gulp');
var excelsheets2json = require('gulp-excelsheets2json');

gulp.task('ex2json', function() {
    gulp.src('test.xlsx')
        .pipe(excel2json({
            trace: true
        }))
        .pipe(gulp.dest('build'))
});

gulp.task('test', function (cb) {
    sequence('ex2json');
});