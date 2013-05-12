module.exports = function (grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-dox');

  var PORT = 8899;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
          optimize: 'none',
          paths: {
            aura: 'lib',
            jquery: 'empty:',
            underscore: 'empty:',
            eventemitter: 'components/eventemitter2/lib/eventemitter2'
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
            'aura/ext/widgets'
          ],
          exclude: ['jquery'],
          out: 'dist/aura.js'
        }
      }
    },
    dox: {
      options: {
        title: "AuraJS documentation"
      },
      files: {
        src: ['lib/'],
        dest: 'docs'
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
  grunt.registerTask('build', ['connect', 'spec', 'requirejs','dox']);
  grunt.registerTask('default', ['connect', 'spec', 'watch']);
};
