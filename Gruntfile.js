module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        concat: {
          options: {
            banner: '/*\n* <%= pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n' +
                '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
                '*\n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> - <%= pkg.author.web %>\n' +
                '* Licensed under the MIT license.\n' +
                '*/\n'
          }, 
          build: {
            src: ['src/js/jquery.stacky.js'],
            dest: 'dist/js/<%= pkg.name %>-<%= pkg.version %>.js'
          }
        },

        // configure jshint to validate js files
        jshint: {
          options: {
            reporter: require('jshint-stylish')
          },
          all: ['src/js/*.js']
        },

        // configure uglify to minify js files
        uglify: {
          options: {
            banner: '/*\n* <%= pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n' +
                '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
                '*\n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> - <%= pkg.author.web %>\n' +
                '* Licensed under the MIT license.\n' +
                '*/\n'
          },
          build: {
            files: {
              'dist/js/<%= pkg.name %>-<%= pkg.version %>.min.js': 'dist/js/<%= pkg.name %>-<%= pkg.version %>.js'
            }
          }
        },

        // configure sass to compile, concat and minify css files
        sass: {
          dist: {
            options: {
              style: 'expanded',
              sourcemap: 'none'
            },
            src: 'src/sass/styles.scss',
            dest: 'dist/css/jquery.stacky.css'
          }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');

    grunt.registerTask('default', ['concat', 'uglify', 'sass']);

};
