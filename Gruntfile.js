module.exports = function (grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-mocha');

  var PORT = 8899;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*!\n' +
        '* <%= pkg.name %>\n' +
        '* v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* (c) <%= pkg.author.name %>;' +
        ' <%= _.pluck(pkg.licenses, "type").join(", ") %> License\n' +
        '* Created by: <%= _.pluck(pkg.maintainers, "name").join(", ") %>\n' +
        '* Contributors: <%= _.pluck(pkg.contributors, "name").join(", ") %>\n' +
        '*/'
    },
    connect: {
      server: {
        options: {
          port: PORT,
          base: '.'
        }
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: '.',
          optimize: 'uglify2',
          preserveLicenseComments: false,
          paths: {
            aura: 'lib',
            jquery: 'empty:',
            underscore: 'empty:',
            eventemitter: 'bower_components/eventemitter2/lib/eventemitter2'
          },
          shim: {
            underscore: {
              exports: '_'
            }
          },
          include: [
            'aura/aura',
            'aura/aura.extensions',
            'aura/ext/debug',
            'aura/ext/mediator',
            'aura/ext/components'
          ],
          exclude: ['jquery'],
          out: 'dist/aura.js'
        }
      }
    },
    concat: {
      options: {
        stripBanners: true,
          banner: 
            "/*! Aura v<%= pkg.version %> | " +
            "(c) 2013 The Aura authors | " +
            "MIT License " +
            "*/\n"
      },
      dist: {
        src: ['dist/aura.js'],
        dest: 'dist/aura.js',
      },
    },
    yuidoc: {
      compile: {
        name: "<%= pkg.name %>",
        description: "<%= pkg.description %>",
        version: "<%= pkg.version %>",
        url: "<%= pkg.homepage %>",
        options: {
          paths: [ "lib" ],
          outdir: "docs",
          parseOnly: true
        }
      }
    },
    jshint: {
      all: {
        options: {
          jshintrc: '.jshintrc'
        },
        files: {
          src: [
            'lib/**/*.js',
            'spec/lib/**/*.js'
          ]
        }
      }
    },
    mocha: {
      all: {
          options: {
              urls: ['http://localhost:<%= connect.server.options.port %>/spec/index.html']
          }
      }
    },
    watch: {
      files: [
        'lib/**/*.js',
        'spec/lib/**/*.js'
      ],
      tasks: ['spec']
    }
  });

  grunt.registerTask('spec', ['jshint', 'mocha']);
  grunt.registerTask('build', ['connect', 'spec', 'requirejs', 'concat']);
  grunt.registerTask('default', ['connect', 'spec', 'watch']);
};
