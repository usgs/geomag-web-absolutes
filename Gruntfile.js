'use strict';

var LIVE_RELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVE_RELOAD_PORT});
var gateway = require('gateway');
var rewriteRulesSnippet = require('grunt-connect-rewrite' +
		'/lib/utils').rewriteRequest;
var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;


var mountFolder = function (connect, dir) {
	return connect.static(require('path').resolve(dir));
};

var mountPHP = function (dir, options) {
	options = options || {
		'.php': 'php-cgi',
		'env': {
			'PHPRC': process.cwd() + '/node_modules/hazdev-template/src/conf/php.ini'
		}
	};
	return gateway(require('path').resolve(dir), options);
};

module.exports = function (grunt) {

	// Load grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// App configuration, used throughout
	var appConfig = {
		dev: 'src',
		dist: 'dist',
		test: 'test',
		tmp: '.tmp'
	};

	// TODO :: Read this from .bowerrc
	var bowerConfig = {
		directory: 'bower_components'
	};

	grunt.initConfig({
		app: appConfig,
		bower: bowerConfig,
		watch: {
			scripts: {
				files: ['<%= app.dev %>/htdocs/js/**/*.js'],
				tasks: ['concurrent:scripts'],
				options: {
					livereload: LIVE_RELOAD_PORT
				}
			},
			scss: {
				files: ['<%= app.dev %>/htdocs/css/**/*.scss'],
				tasks: ['compass:dev']
			},
			tests: {
				files: ['<%= app.test %>/*.html', '<%= app.test %>/**/*.js'],
				tasks: ['concurrent:tests']
			},
			livereload: {
				options: {
					livereload: LIVE_RELOAD_PORT
				},
				files: [
					'<%= app.dev %>/htdocs/**/*.html',
					'<%= app.dev %>/htdocs/css/**/*.css',
					'<%= app.dev %>/htdocs/img/**/*.{png,jpg,jpeg,gif}',
					'.tmp/css/**/*.css'
				]
			},
			gruntfile: {
				files: ['Gruntfile.js'],
				tasks: ['jshint:gruntfile']
			}
		},
		concurrent: {
			scripts: ['jshint:scripts', 'mocha_phantomjs'],
			tests: ['jshint:tests', 'mocha_phantomjs'],
			dist: [
				'requirejs:dist',
				'cssmin:dist',
				'htmlmin:dist',
				'uglify',
				'copy'
			]
		},
		connect: {
			options: {
				hostname: 'localhost'
			},
			proxies: [{
				context: '/map',
				host: 'geomag.usgs.gov',
				port: 80,
				https: false,
				changeOrigin: true,
				xforward: false
			}],
			rules: [
				{
					from: '^/theme/(.*)$',
					to: '/hazdev-template/src/htdocs/$1'
				},
				{
					from: '^/webabsolutes/(.*)$',
					to: '/$1'
				},
				{
					from: '^/observation/(.*)$',
					to: '/observation.php?id=$1'
				},
				{
					from: '^/observatory/(.*)$',
					to: '/observatory.php?id=$1'
				}
			],
			dev: {
				options: {
					base: '<%= app.dev %>/htdocs',
					port: 8080,
					components: bowerConfig.directory,
					middleware: function (connect, options) {
						return [
							lrSnippet,
							rewriteRulesSnippet,
							proxySnippet,
							mountFolder(connect, '.tmp'),
							mountFolder(connect, options.components),
							mountPHP(options.base),
							mountFolder(connect, options.base),
							mountFolder(connect, 'node_modules')
						];
					}
				}
			},
			dist: {
				options: {
					base: '<%= app.dist %>/htdocs',
					port: 8081,
					keepalive: true,
					middleware: function (connect, options) {
						return [
							rewriteRulesSnippet,
							proxySnippet,
							mountPHP(options.base),
							mountFolder(connect, options.base),
							mountFolder(connect, 'node_modules'),
							mountFolder(connect, 'bower_components')
						];
					}
				}
			},
			test: {
				options: {
					base: '<%= app.test %>',
					devBase: '<%= app.dev %>/htdocs',
					components: bowerConfig.directory,
					port: 8000,
					middleware: function (connect, options) {
						return [
							mountFolder(connect, '.tmp'),
							mountFolder(connect, 'bower_components'),
							mountFolder(connect, 'node_modules'),
							mountFolder(connect, options.base),
							mountPHP(options.devBase),
							mountFolder(connect, options.devBase + '/js')
						];
					}
				}
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			gruntfile: ['Gruntfile.js'],
			scripts: ['<%= app.dev %>/htdocs/js/**/*.js'],
			tests: ['<%= app.test %>/spec/**/*.js']
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
		mocha_phantomjs: {
			all: {
				options: {
					urls: [
						'http://localhost:<%= connect.test.options.port %>/index.html'
					]
				}
			}
		},
		requirejs: {
			dist: {
				options: {
					baseUrl: appConfig.dev + '/htdocs/js',
					optimize: 'uglify2',
					dir: appConfig.dist + '/htdocs/js',
					useStrict: true,
					wrap: true,

					paths: {
						'mvc': '../../../bower_components/hazdev-webutils/src/mvc',
						'util': '../../../bower_components/hazdev-webutils/src/util',
						'tablist': '../../../node_modules/hazdev-tablist/src/tablist'
					},
					modules: [
						{
							name: 'index'
						},
						{
							name: 'observation'
						},
						{
							name: 'observatory'
						}
					]
				}
			}
		},
		cssmin: {
			dist: {
				files: {
					'<%= app.dist %>/htdocs/css/index.css': [
						'.tmp/css/index.css'
					],
					'<%= app.dist %>/htdocs/css/observation.css': [
						'.tmp/css/observation.css'
					],
					'<%= app.dist %>/htdocs/css/theme.css': [
						'.tmp/css/theme.css'
					]
				}
			}
		},
		htmlmin: {
			dist: {
				options: {
					collapseWhitespace: true
				},
				files: [{
					expand: true,
					cwd: '<%= app.dev %>',
					src: '**/*.html',
					dest: '<%= app.dist %>'
				}]
			}
		},
		uglify: {
			options: {
				mangle: true,
				compress: true,
				report: 'gzip'
			},
			dist: {
				files: {
					'<%= app.dist %>/htdocs/lib/requirejs/require.js':
							['<%= bower.directory %>/requirejs/require.js'],
					'<%= app.dist %>/htdocs/lib/html5shiv/html5shiv.js':
							['<%= bower.directory %>/html5shiv-dist/html5shiv.js']
				}
			}
		},
		copy: {
			app: {
				expand: true,
				options: {mode: true},
				cwd: '<%= app.dev %>/htdocs',
				dest: '<%= app.dist %>/htdocs',
				src: [
					'img/**/*.{png,gif,jpg,jpeg}',
					'**/*.php'
				]
			},
			conf: {
				expand: true,
				options: {mode: true},
				cwd: '<%= app.dev %>/conf',
				dest: '<%= app.dist %>/conf',
				src: [
					'config.inc.php'
				]
			},
			lib: {
				expand: true,
				options: {mode: true},
				cwd: '<%= app.dev  %>/lib',
				dest: '<%= app.dist %>/lib',
				src: [
					'**/*'
				]
			}
		},
		replace: {
			dist: {
				src: [
					'<%= app.dist %>/htdocs/index.html',
					'<%= app.dist %>/**/*.php'
				],
				overwrite: true,
				replacements: [
					{
						from: '<script src="http://localhost:35729/livereload.js'+
								'?snipver=1"></script>',
						to: ''
					},
					{
						from: 'requirejs/require.js',
						to: 'lib/requirejs/require.js'
					},
					{
						from: 'html5shiv-dist/html5shiv.js',
						to: 'lib/html5shiv/html5shiv.js'
					}
				]
			}
		},
		open: {
			server: {
				path: 'http://localhost:<%= connect.dev.options.port %>'
			},
			test: {
				path: 'http://localhost:<%= connect.test.options.port %>'
			},
			dist: {
				path: 'http://localhost:<%= connect.dist.options.port %>'
			}
		},
		clean: {
			dist: ['<%= app.dist %>'],
			dev: ['<%= app.tmp %>', '.sass-cache']
		}
	});

	grunt.event.on('watch', function (action, filepath) {
		// Only lint the file that actually changed
		grunt.config(['jshint', 'scripts'], filepath);
	});

	grunt.registerTask('test', [
		'clean:dist',
		'connect:test',
		'mocha_phantomjs'
	]);

	grunt.registerTask('build', [
		'clean:dist',
		'compass',
		'concurrent:dist',
		'replace',
		'configureRewriteRules',
		'configureProxies',
		'open:dist',
		'connect:dist'
	]);

	grunt.registerTask('default', [
		'clean:dist',
		'compass:dev',
		'configureRewriteRules',
		'configureProxies',
		'connect:dev',
		'connect:test',
		'open:server',
		'open:test',
		'watch'
	]);

};
