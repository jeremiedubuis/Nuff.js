
module.exports = function(grunt){

    grunt.initConfig({


        concat: {
            dist: {
                src: [
                    'nuff/intro.js',
                    'nuff/helpers/*.js',
                    'nuff/Validator.js',
                    'nuff/Dispatcher.js',
                    'nuff/Router.js',
                    'nuff/Model.js',
                    'nuff/Collection.js',
                    'nuff/Presenter.js',
                    'nuff/outro.js'
                ],
                dest: 'nuff/build/Nuff.js',
            },
        },

        uglify: {
            js: {
                expand: true,
                files: {
                'nuff/build/Nuff.min.js': 'nuff/build/Nuff.js'
                }
            }
        },

        browserify: {
            options: {
                debug: true,
                extensions: ['.js','.jsx'],
                external: ['react.min'],
                transform: [
                    "reactify", "browserify-shim"
                ]
            },
            main: {
                src: ['js/**/*.js', 'js/**/*.jsx','!js/bundle.js'  ],
                dest: 'js/bundle.js'
            }
        },

        watch: {

            nuff: {
                files: ['nuff/**/*.js', '!nuff/Nuff.min.js', '!nuff/Nuff.build.js'],
                tasks: ['concat','uglify'],
                options: {
                    spawn: false
                }
            },

            js: {
                files: ['js/**/*.js', 'js/**/*.jsx'],
                tasks: ['browserify'],
                options: {
                    spawn: false
                }
            }
        },

    });

    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('default', ['concat','uglify', 'browserify']);
    grunt.registerTask('dev', ['default','watch']);


}
