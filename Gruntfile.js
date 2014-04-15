/* global module:false */
module.exports = function(grunt) {

    // Project configuration
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jade: {
            compile: {
                options: {
                    data: {
                        debug: false,
                        package: '<%= pkg %>'
                    }
                },
                files: {
                    'build/index.html': [
                        'resources/views/index/index.jade'
                    ]
                }
            }
        },

        cssmin: {
            compress: {
                options: {
                    keepSpecialComments: 0
                },
                files: {
                    'build/assets/docs.min.css': [
                        'bower_components/bootstrap/dist/css/bootstrap.min.css',
                        'bower_components/font-awesome/css/font-awesome.min.css',
                        'resources/public/css/*'
                    ]
                }
            }
        },

        uglify: {
            compress: {
                files: {
                    'build/assets/docs.min.js': [
                        'bower_components/jquery/dist/jquery.min.js',
                        'bower_components/bootstrap/dist/js/bootstrap.min.js',
                        'resources/public/js/*'
                    ]
                }
            }
        },

        shell: {
            docs: {
                options: {
                    stdout: true
                },
                command: './bin/generate-docs'
            },
            api: {
                options: {
                    stdout: true
                },
                command: './bin/generate-api'
            },
            structure: {
                options: {
                    stdout: true
                },
                command: './bin/build-assets'
            }
        },

        watch: {
            main: {
                options: {
                    livereload: true
                },
                files: [
                    'Gruntfile.js',
                    'resources/public/**'
                ],
                tasks: 'build'
            },
            content: {
                options: {
                    livereload: true
                },
                files: [
                    'docs/**',
                    'resources/views/**'
                ],
                tasks: 'build'
            },
            build: {
                options: {
                    livereload: true
                },
                files: [
                    'bin/**'
                ],
                tasks: 'build'
            }
        },

        connect: {
            server: {
                options: {
                    port: 9000,
                    base: 'build',
                    livereload: true,
                    keepalive: true,
                    open: false
                }
            }
        }
    });

    // Dependencies
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-shell');

    // Default task
    grunt.registerTask('structure', ['shell:structure']);
    grunt.registerTask('docs', ['shell:docs']);
    grunt.registerTask('api', ['shell:api']);
    grunt.registerTask('assets', ['cssmin', 'uglify']);
    grunt.registerTask('build', ['assets', 'jade', 'docs', 'api']);
    grunt.registerTask('default', ['structure', 'build']);
};

