module.exports = function(grunt) {

    var paths = {
        src: {
            bower: 'bower_components',
            css: 'source/css',
            fonts: 'source/fonts',
            js: 'source/js/source'
        },
        dest: {
            css: 'source/css',
            fonts: 'source/fonts',
            js: 'source/js',
            html: 'public/patterns',
            images: 'source/images',
            patterns: 'source/_patterns'
        },
        app: {
            css: 'export/css',
            fonts: 'export/fonts',
            js: 'export/js',
            html: 'export/patterns',
            images: 'export/images'
        }
    };


    grunt.initConfig ({
        uglify: {
            my_target: {
                files: {
                    'js/script.js' : ['components/js/*.js']
                }
            } 
        },         
        jshint: {
            js_target: {
                src: ['components/js/*.js']
            },
            options: { 
              force: true 
            }
        },
        compass: {
          dev: {
            options: {
              config: 'config.rb',
              sourcemap: true
            } 
          }
        }, 
        cssc: {
          build: {
            options: {
              compress: false,
              consolidateViaDeclarations: true,
              consolidateViaSelectors: true,
              consolidateMediaQueries: true,
              lineBreaks: false
            },
            files: {
              'css/style.css': 'css/style.css',
              'css/ie8.css': 'css/ie8.css'
            }
          }
        },
        csscomb: {
          build: {
              files: {
                'css/style.css': ['css/style.css']
              },
          }
        }, 
        autoprefixer: {
          options: {
            browsers: ['> 1%', 'last 5 versions', 'Firefox > 20', 'ios 7', 'ios 8', 'ie 7', 'ie 8', 'ie 9'],
            map: true
          },
          build: {
            expand: true,
            flatten: true,
            src: 'css/style.css', 
            dest: 'css/'
          } 
        }, 
        htmlhint: {
            build: {
                options: {
                  'tag-pair': true,
                  'tagname-lowercase': true,
                  'attr-lowercase': true,
                  'attr-value-double-quotes': true,
                  'spec-char-escape': true,
                  'id-unique': true
                },
                src: ['*.html']
            } 
        },
        stripmq: {
          options: {
              width: 1024,
              type: 'screen'
          },
          all: {
              files: {
                  'css/ie8.css': ['css/style.css']
              }
          }
        },
        imageoptim: {
          imgs: {
            options: {
              jpegMini: false,
              imageAlpha: false,
              quitAfter: true
            },
            src: ['images']
          }
        },
    })


    require('load-grunt-config')(grunt, {
        config: {
            paths: paths
        }
    });


//Uglify Javascript
  grunt.loadNpmTasks('grunt-contrib-uglify');

  //Watch task
  grunt.loadNpmTasks('grunt-contrib-watch');

  //Compass
  grunt.loadNpmTasks('grunt-contrib-compass');

  //CSS Comb
  grunt.loadNpmTasks('grunt-csscomb');

  //JS Lint/Hint
  grunt.loadNpmTasks('grunt-contrib-jshint');

  //HTML Lint/Hint
  grunt.loadNpmTasks('grunt-htmlhint');

  //Vendor prefixer
  grunt.loadNpmTasks('grunt-autoprefixer');

  //CSS Compress
  grunt.loadNpmTasks('grunt-cssc');

  //Image optim - optimises jpg's and png's
  grunt.loadNpmTasks('grunt-imageoptim');

  //Newer - checks if target is older 
  //than generated item before processing
  grunt.loadNpmTasks('grunt-newer');

  //Combines media queries
  grunt.loadNpmTasks('grunt-combine-media-queries');

  //Strips MQ's - generates a ie8 friendly stylesheet
  grunt.loadNpmTasks('grunt-stripmq');

  //default Grunt task
  grunt.registerTask('default', 'watch');

  //Distribution task
  grunt.registerTask('dist', [
    'compass:dev',
    'autoprefixer:build', 
    'csscomb',
    'stripmq', 
    'cssc:build', 
    'uglify', 
    'newer:imageoptim'
    ]);

}

<% if (includePagespeed) { %>
    grunt.registerTask('ngrok', 'Run pagespeed with ngrok', function() {
        var ngrok = require('ngrok');
        var done = this.async();
        var port = 8888;

        ngrok.connect(port, function(err, url) {
            if (err !== null) {
                grunt.fail.fatal(err);
                return done();
            }
            grunt.config.set('pagespeed.options.url', url);
            grunt.task.run('pagespeed');
            done();
        });
    });
    
<% } %>
};