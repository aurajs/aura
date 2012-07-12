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
			// base url for retrieving paths
			baseUrl: 'js',
			// shim underscore & backbone (cause we use the non AMD versions here)
			shim: {
				'dom': {
					exports: '$',
					deps: ['jquery']
				},
				'underscore': {
					exports: '_'
				},
				'backbone': {
					deps: ['underscore', 'dom'],
					exports: 'Backbone'
				},
				'deferred': {
					exports: 'Deferred',
					deps: ['dom']
				}
			},
			// paths
			paths: {
				// jQuery
				jquery: '../../aura/lib/jquery/jquery',

				// Zepto
				zepto: '../../aura/lib/zepto/zepto',
				deferred: '../../aura/lib/zepto/deferred',

				dom: '../../aura/lib/dom',

				core: '../../backbone-aura/mediator',
				perms: '../../backbone-aura/permissions',
				sandbox: '../../backbone-aura/facade',

				aura_core: '../../aura/mediator',
				aura_perms: '../../aura/permissions',
				aura_sandbox: '../../aura/facade',

				text: '../../backbone-aura/lib/text',
				backbone: '../../backbone-aura/lib/backbone',
				localstorage: '../../backbone-aura/lib/localstorage',
				underscore: '../../aura/lib/underscore',
				fullcalendar: '../../backbone-aura/lib/fullcalendar.min',
				jquery_ui: '../../backbone-aura/lib/jquery-ui.min'
			},
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