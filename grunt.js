module.exports = function(grunt) {
	"use strict";

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-jasmine-task');

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('auraCopy', 'Copy files.', function() {
    var fs = require('fs'),
      files = grunt.file.expandFiles(this.file.src);

    // Copy specified files.
    for (var i = 0; i < files.length; i++) {
      var src = files[i],
        dest = this.file.dest || files[i].replace('src/', 'dist/'),
        isDirective = src.match(/^<(.*)>$/);

      // grunt.log.writeln('Copying file ' + src + ' to ' + dest);
      if (isDirective) {
        grunt.file.write(dest, grunt.task.directive(src, grunt.file.read));
      } else {
        grunt.file.copy(src, dest);
      }
    }

    // Fail task if errors were logged.
    if (this.errorCount) {
      return false;
    }

    // Otherwise, print a success message.
    // grunt.log.writeln('File "' + this.file.dest + '" copied.');
    grunt.log.writeln('Total of ' + files.length + ' files copied.');
  });

  // ==========================================================================
  // Project configuration
  // ==========================================================================

  grunt.initConfig({
    // MULTI TASKS
    // -----------

    // clean build directory
    clean: ['dist'],

    // js linting
    lint: {
      files: ['src/aura/*.js', 'src/apps/**/*.js', 'src/widgets/**/*.js', 'src/extensions/*/*.js']
    },

    // jasmine testsuites
    jasmine: {
      files: ['spec/SpecRunner.html']
    },

    // tasks to be executed and files
    // to be watched for changes
    watch: {
      files: ['<config:lint.files>'],
      tasks: ['lint', 'jasmine']
    },

    auraCopy: {
      dist: {
        src: ['src/config.js', 'src/index.html',
        // TODO: These files below should also be combined and minified by requirejs.
        'src/aura/**', 'src/widgets/**', 'src/extensions/**']
      }
    },

    // SINGLE TASKS
    // ----------------------

    // require js
    requirejs: {
      // build directory path
      dir: 'dist/apps/demo',
      // application directory
      appDir: 'src/apps/demo',
      mainConfigFile: 'src/config.js',
      // base url for retrieving paths
      baseUrl: 'js',
      // optimize javascript files with uglifyjs
      optimize: 'uglify',
      // define our app model
      modules: [{
        name: 'app'
      }]
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
        console: true,
        require: true,
        define: true,
        $: true
      }
    },

    server: {
      port: 8888,
      base: './'
    }

  });

  // build task
  grunt.registerTask('build', 'clean lint jasmine requirejs auraCopy');

  // default build task
  grunt.registerTask('default', 'build');

  // launch node server to view the projct
  grunt.registerTask('launch', 'server watch');

};
