module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-mocha');
  

  var port = 8899;

  // ==========================================================================
  // Project configuration
  // ==========================================================================

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    
    connect: {
      server: {
        options: {
          port: port,
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
            aura:         'lib',
            jquery:       'empty:',
            underscore:   'empty:',
            eventemitter: 'components/eventemitter2/lib/eventemitter2'
          },
          shim: {
            underscore: { exports: '_' }
          },
          include: ['aura/aura', 'aura/aura.extensions', 'aura/ext/debug', 'aura/ext/mediator', 'aura/ext/widgets'],
          exclude: ['jquery'],
          out: 'dist/aura.js'
        }
      }
    },

    jshint: {
      files: {
        src: ['lib/**/*.js', 'spec/lib/**/*.js']
      },
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        eqnull: true,
        browser: true,
        nomen: false,
        expr: true,
        globals: {
          console: true,
          require: true,
          define: true,
          _: true,
          $: true,
        }
      }
    },

    mocha: {
      aura: ["spec/index.html"]
    },

    watch: {
      files: ['lib/**/*.js', 'spec/lib/**/*.js'],
      tasks: ['build']
    }
  });

  // default build task
  grunt.registerTask('build', ['jshint', 'mocha', 'requirejs']);
  grunt.registerTask('default', ['connect', 'build', 'watch']);
  grunt.registerTask('spec', ['bower', 'connect', 'build']);

};
