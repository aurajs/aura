/* global module:false */
module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib');
	grunt.loadNpmTasks('grunt-requirejs');
	grunt.loadNpmTasks('grunt-jasmine-task');

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
			]
		},

		// jasmine testsuites
		jasmine: {
			files: ['spec/SpecRunner.html']
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
			mainConfigFile: 'config.js',
			// base url for retrieving paths
			baseUrl: 'js',
			// optimize javascript files with uglifyjs
			optimize: 'uglify',
			// define our app model
			modules: [{ name: 'app' }]
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
				define: true,
				$: true
			}
		}

	});

	// build task
	grunt.registerTask('build', 'clean lint jasmine requirejs');

};