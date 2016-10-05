/**
 * Created by thor on 10/4/2016.
 */

module.exports = function(grunt) {
    var webpack = require("webpack");
    var webpackConfig = require("./webpack.config.js");
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        webpack: {
            options: webpackConfig,
            // build: {
            //
            // }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                // src: 'src/<%= pkg.name %>.js',
                src: 'bin/app.bundle.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['webpack', 'uglify']);

};