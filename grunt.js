/*global module:false*/
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-requirejs');
  
  // Project configuration.
  grunt.initConfig({

    // MULTI TASKS
    // -----------

    // clean build directory
    clean: ['demo-build'],

    // js linting
    lint: {
      files: [
        'demo/js/widgets/calendar/collections/*.js',
        'demo/js/widgets/calendar/models/*.js',
        'demo/js/widgets/calendar/views/*.js',                
        'demo/js/widgets/todos/collections/*.js',
        'demo/js/widgets/todos/models/*.js',
        'demo/js/widgets/todos/views/*.js', 
        'demo/js/widgets/controls/**/*.js',
        'demo/js/widgets/**/main.js',             
        'demo/js/app.js'
      ],
    },

    // qunit testsuites
    qunit: {
      files: ['test/**/*.html']
    },
    
    // tasks to be executed and files
    // to be watched for changes
    watch: {
      files: ['<config:lint.files>'],
      tasks: ['lint qunit']
    },

    // SINGLE TASKS
    // ----------------------

    // require js
    requirejs: {
        // build directory path
        dir: 'demo-build',
        // applicatioon directory
        appDir: 'demo',
        // base url for retrieving paths
        baseUrl: 'js',
        // shim underscore & backbone (cause we use the non AMD versions here)
  	    shim: {
  	        'underscore': {
  	            exports: '_'
  	        },
  	        'backbone': {
  	            deps: ['underscore', 'jquery'],
  	            exports: 'Backbone'
  	        }
  	    },
        // paths
        paths: {

            core: 'ext/mediator',
            perms: 'ext/permissions',
            sandbox: 'ext/facade',

            aura_core: '../../aura/mediator',
            aura_perms: '../../aura/permissions',
            aura_sandbox: '../../aura/facade',

            text: 'ext/lib/text',
            backbone: 'ext/lib/backbone',
            localstorage: 'ext/lib/localstorage',
            jquery: '../../aura/lib/jquery',
            underscore: '../../aura/lib/underscore',
            fullcalendar: 'ext/lib/fullcalendar.min',
            jquery_ui: 'ext/lib/jquery-ui.min'
        },
        // optimize javascript files with uglifyjs
        optimize: 'uglify',
        // define our app model
        modules: [{name: 'app'}]
    },

    // Configuration
    // -------------

    // js linting options
    jshint: {
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
        nomen: false
      },
      globals: {
        require: true,
        define: true
      }
    }

  });

  // build task
  grunt.registerTask('build', 'clean lint requirejs');

};