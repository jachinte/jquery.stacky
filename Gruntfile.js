module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        concat: {
          options: {
            banner: '/*\n* <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> \n' +
                '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> - <%= pkg.author.web %> \n*/\n'
          }, 
          build: {
            src: 'src/js/jquery.stacky-0.1.1.js',
            dest: 'dist/js/jquery.stacky.js'
          }
        },

        // configure jshint to validate js files -----------------------------------
        jshint: {
          options: {
            reporter: require('jshint-stylish')
          },
          all: ['src/js/*.js']
        },

        // configure uglify to minify js files -------------------------------------
        uglify: {
          options: {
            banner: '/*\n* <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> \n' +
                '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> - <%= pkg.author.web %> \n*/\n'
          }, 
          build: {
            files: {
              'dist/js/jquery.stacky.min.js': 'dist/js/jquery.stacky.js'
            }
          }
        },

        // configure watch to auto update ------------------------------------------
        watch: {
          scripts: {
            files: 'src/js/*.js',
            tasks: ['concat', 'uglify']
          }
        },

        // configure sass to compile, concat and minify css files ------------------
        sass: {
          dist: {
            options: {
              style: 'expanded'
            },
            src: 'src/sass/styles.scss',
            dest: 'dist/css/jquery.stacky.css'
          }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('default', ['concat', 'uglify', 'sass']);

};
