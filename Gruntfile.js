'use strict';

module.exports = function (grunt) {

	// Load grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// App configuration, used throughout
	var appConfig = {
		dev: 'dev',
		dist: 'dist',
		test: 'test',
		tmp: '.tmp'
	};

	grunt.initConfig({
		app: appConfig,
		watch: {
			scripts: {
				files: ['<%= app.dev %>/htdocs/js/{,*/}*.js'],
				tasks: ['jshint']
			},
			scss: {
				files: ['<%= app.dev %>/htdocs/css/{,*/}*.scss'],
				tasks: ['compass:dev']
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'<%= app.dev %>/htdocs/js/{,*/}*.js',
				'<%= app.test %>/spec/{,*/}*.js'
			]
		},
		compass: {
			dev: {
				options: {
					sassDir: '<%= app.dev %>/htdocs/css',
					cssDir: '<%= app.tmp %>/css',
					environment: 'development'
				}
			}
		},
		clean: {
			dist: ['<%= app.dist %>/*'],
			dev: ['<%= app.tmp %>', '.sass-cache']
		}
	});

	grunt.registerTask('build', [
		'clean:dist',
	]);

	grunt.registerTask('default', [
		'jshint'/*,
		'test',
		'build'*/
	]);
};