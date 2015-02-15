module.exports = function(grunt) {

    var banner = '/*!\n' +
                ' * <%= pkg.name %>\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> - <%= pkg.author.email %> | <%= pkg.author.web %>\n' +
                ' * Licensed under the MIT license.\n' +
                ' * <%= pkg.repository.url %>\n' +
                ' * @projectDescription <%= pkg.description %>\n' +
                ' * @author <%= pkg.author.name %>\n' +
                ' * @version v<%= pkg.version %>\n' +
                ' */\n';

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        concat: {
          options: {
            banner: banner
          }, 
          build: {
            src: ['src/js/jquery.stacky.js'],
            dest: 'dist/js/<%= pkg.name %>.js'
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
            banner: banner
          },
          build: {
            files: {
              'dist/js/<%= pkg.name %>.min.js': 'dist/js/<%= pkg.name %>.js'
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
