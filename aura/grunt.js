/*global module:false*/
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-contrib');

  // Project configuration.
  grunt.initConfig({

    // MULTI TASKS
    // -----------

    // clean build directory
    clean: ['www-build'],

    // js linting
    lint: {
      files: [
        'www/js/widgets/calendar/collections/*.js',
        'www/js/widgets/calendar/models/*.js',
        'www/js/widgets/calendar/views/*.js',                
        'www/js/widgets/todos/collections/*.js',
        'www/js/widgets/todos/models/*.js',
        'www/js/widgets/todos/views/*.js', 
        'www/js/widgets/controls/**/*.js',
        'www/js/widgets/**/main.js',             
        'www/js/app.js'
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
        dir: 'www-build',
        // applicatioon directory
        appDir: 'www',
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

  	        aura_core: 'aura/mediator',
  	        aura_perms: 'aura/permissions',
  	        aura_sandbox: 'aura/facade',

  	        backbone: 'ext/lib/backbone',
  	        localstorage: 'ext/lib/localstorage',
  	        jquery: 'aura/lib/jquery',
  	        underscore: 'aura/lib/underscore',
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