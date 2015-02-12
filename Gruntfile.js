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
            src: 'src/jquery.stacky.js',
            dest: 'dist/jquery.stacky.js'
          }
        },

        // configure jshint to validate js files -----------------------------------
        jshint: {
          options: {
            reporter: require('jshint-stylish')
          },
          all: ['src/*.js']
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
              'dist/jquery.stacky.min.js': 'dist/jquery.stacky.js'
            }
          }
        },

        // configure watch to auto update ------------------------------------------
        cssmin: {
          options: {
            noAdvanced: true
          },
          css: {
            src: 'src/css/*.css',
            dest: 'dist/css/stacky.min.css'
          },
          minify: {
            files: [{
              expand: true,
              cwd: 'src/css/',
              src: ['*.css', '!*.min.css'],
              dest: 'dist/css/',
              ext: '.css'
            }, {
              expand: true,
              cwd: 'src/css/',
              src: ['*.min.css'],
              dest: 'dist/css/',
              ext: '.min.css'
            }]
          }
        },

        // configure cssmin to concat and minify css files -------------------------

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);

};
