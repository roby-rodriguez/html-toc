module.exports = function(grunt) {

	grunt.initConfig( {

		appConfig: grunt.file.readJSON('package.json') || {},

		userConfig: grunt.file.readJSON('build-config.json'),

		// Add imports
		import_js: {
			files: {
				expand: true, 								// Enable dynamic expansion - whatever that is..
				cwd: '<%= userConfig.paths.js %>',			// Define js sources folder
				src: [ '<%= userConfig.files.main_js %>' ],	// Define main source
				rename: function () {						// Output to temporary folder
					return '<%= userConfig.dist.js.uncompressed %>'
				}
			}
		},

		// Cleanup main source
		jsbeautifier: {
			files: [ '<%= userConfig.dist.js.uncompressed %>' ],
			options: {
				js: {
					indentWithTabs: true,
					preserveNewlines: false,
					jslintHappy: true
				}
			}
		},

		// Add important copyright
		usebanner: {
			jsbeautifier: {
				options: {
					position: 'top',
					banner: '/**\n* <%= appConfig.name %> - version <%= appConfig.version %> - ' +
					'<%= grunt.template.today("dd-mm-yyyy") %>\n' +
					'* <%= appConfig.description %>\n' +
					'* Copyright (c) <%= grunt.template.today("yyyy") %> - <%= appConfig.author %>\n' +
					'* Licensed under MIT \n*/\n',
					linebreak: false
				},
				files: {
					src: [ '<%= userConfig.dist.js.uncompressed %>' ]
				}
			}
		},
/*
		jshint: {
			files: [ dist_js_uncompressed ],
			options: {
				jshintrc: ".jshintrc"
			}
		},
*/
		// Minify js and add source map
		uglify: {
			minify_prod: {
				options: {
					sourceMap: true,
					sourceMapIncludeSources: true,
					banner: '/** <%= appConfig.name %> v<%= appConfig.version %> */'
				},
				files: {
					'<%= userConfig.dist.js.minified %>': ['<%= userConfig.dist.js.uncompressed %>']
				}
			}
		},

		// Process less css
		less: {
			prod: {
				options: {
					paths: ['src/css'],
					plugins: [
						new (require('less-plugin-autoprefix'))({ browsers: ["last 2 versions"] })
					]
				},
				files: {
					'<%= userConfig.dist.css.uncompressed %>': '<%= userConfig.src.css %>'
				}
			}
		},

		// Minify css and add source map
		cssmin: {
			options: {
				sourceMap: true,
				sourceMapIncludeSources: true
			},
			prod: {
				files: {
					'<%= userConfig.dist.css.minified %>': '<%= userConfig.dist.css.uncompressed %>'
				}
			}
		},

		// fugly - for some reason cssmin adds this extra rel path that we must strip to make the map to work
		replace: {
			fix_css_sourcemap: {
				overwrite: true,
				src: '<%= userConfig.dist.css.sourcemap %>',
				replacements: [
					{
						from: '<%= userConfig.dist.css.uncompressed %>',
						to: '<%= userConfig.files.uncompressed_css %>'
					}
				]
			}
		},

		// watch for changes and launch grunt default task -> launched at end of `npm install`
		watch: {
			files: [ "src/**/*.*" ],
			tasks: [ "default" ]
		}
	});

	grunt.loadNpmTasks('grunt-banner');
	grunt.loadNpmTasks("grunt-import-js");
	grunt.loadNpmTasks("grunt-jsbeautifier");
	//grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask("default", [
		"import_js",
		"jsbeautifier",
		"usebanner",
		// "jshint",
		"uglify:minify_prod",
		"less:prod",
		"cssmin:prod",
		"replace:fix_css_sourcemap"
	]);
};
