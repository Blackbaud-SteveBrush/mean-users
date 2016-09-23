/*jshint node: true, strict: implied */
module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-concat-sourcemap');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        buildPath: grunt.option('buildpath') || 'build',
        concat_sourcemap: {
            options: {
                sourcesContent: true,
                sourceRoot: '../..'
            },
            app: {
                files: {
                    '<%= buildPath %>/js/app.js': [
                        'bower_components/checklist-model/checklist-model.js',
                        'public/**/*.js',
                        'tmp/templates.js'
                    ]
                }
            }
        },
        copy: {
            images: {
                files: [{
                    expand: true,
                    cwd: 'public/app/images/',
                    src: ['*'],
                    dest: '<%= buildPath %>/images/'
                }]
            }
        },
        html2js: {
            app: {
                options: {
                    module: 'mean-users.templates',
                    quoteChar: '\'',
                    indentString: '    ',
                    singleModule: true,
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        removeComments: true,
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    }
                },
                src: ['public/app/**/*.html'],
                dest: 'tmp/templates.js'
            }
        },
        sass: {
            options: {
                style: 'compressed'
            },
            app: {
                files: {
                    '<%= buildPath %>/css/app.min.css': 'public/app/styles/app.scss'
                }
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            combine: {
                files: {
                    '<%= buildPath %>/css/app.min.css': [
                        '<%= buildPath %>/css/app.min.css'
                    ]
                }
            }
        },
        uglify: {
            options: {
                sourceMap: true,
                sourceMapIncludeSources: true
            },
            scripts: {
                options: {
                    sourceMapIn: '<%= buildPath %>/js/app.js.map'
                },
                src: ['<%= buildPath %>/js/app.js'],
                dest: '<%= buildPath %>/js/app.min.js'
            }
        },
        watch: {
            sass: {
                files: ['public/app/**/*.scss'],
                tasks: ['sass', 'cssmin']
            },
            scripts: {
                files: ['public/app/**/*.js'],
                tasks: ['concat_sourcemap:app', 'uglify:scripts']
            },
            html: {
                files: ['public/app/**/*.html'],
                tasks: ['html2js', 'concat_sourcemap:app', 'uglify:scripts']
            }
        }
    });

    grunt.registerTask('build', [
        'html2js',
        'concat_sourcemap',
        'uglify',
        'sass',
        'cssmin',
        'copy',
        'watch'
    ]);

    grunt.registerTask('default', 'build');
};
