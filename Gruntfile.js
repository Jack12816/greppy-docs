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
            generate: {
                command: './bin/generate'
            }
        },

        watch: {
            main: {
                options: {
                    // Start a live reload server on the default port 35729
                    livereload: true
                },
                files: [
                    'Gruntfile.js',
                    'resources/public/**'
                ],
                tasks: ['generate', 'assets']
            },
            content: {
                options: {
                    // Start a live reload server on the default port 35729
                    livereload: true
                },
                files: [
                    'docs/**',
                    'resources/views/**'
                ],
                tasks: 'generate'
            },
            build: {
                options: {
                    // Start a live reload server on the default port 35729
                    livereload: true
                },
                files: [
                    'bin/**'
                ],
                tasks: 'default'
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
    grunt.registerTask('generate', ['shell:generate', 'jade']);
    grunt.registerTask('assets', ['cssmin', 'uglify']);
    grunt.registerTask('default', ['generate', 'assets']);
};

