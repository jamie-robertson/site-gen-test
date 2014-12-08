'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


var blondeGenerator = module.exports = yeoman.generators.Base.extend({

    initializing: function() {
        this.pkg = require('../package.json');
    },

    prompting: function() {
        var cb = this.async();

        this.log(yosay('Lets make a style guide!'));

        var prompts = [
            {
                type: 'input',
                name: 'projectName',
                message: 'What is the name of this project?',
                default: 'Blonde Project'
            },
            {
                type: 'checkbox',
                message: 'Need to install some third party scripts?',
                name: 'features',
                choices: [
                    {
                        name: 'jQuery (~1.11.1)',
                        value: 'includeJquery'
                    },

                    {
                        name: 'Modernizr/Grunt-Modernizr (Latest)',
                        value: 'includeModernizr'
                    },

                    {
                        name: 'Require.js (~2.1.14)',
                        value: 'includeRequire'
                    }
                ]
            },
            {
                type: 'checkbox',
                message: 'Need Grunt to do stuff?',
                name: 'gruntfeatures',
                choices: [
                    {
                        name: 'Pagespeed/Ngrok',
                        value: 'includePagespeed'
                    }
                ]
            },
            {
                type: 'list',
                message: 'What type of project is this?',
                name: 'projectType',
                choices: [
                    {
                        name: 'Static',
                        value: 'staticTemplate'
                    },
                    {
                        name: 'Symfony',
                        value: 'symfonyTemplate'
                    },
                    {
                        name: 'Drupal',
                        value: 'drupalTemplate'
                    }
                ]
            }
        ];

        this.prompt(prompts, function(props) {
            var features = props.features;
            var gruntfeatures = props.gruntfeatures;
            function hasFeature (feat) {
                return features.indexOf(feat) !== -1;
            }
            function hasGruntFeature (feat) {
                return gruntfeatures.indexOf(feat) !== -1;
            }

            this.currentYear = new Date().getFullYear();

            this.projectName = props.projectName;
            this.includeJquery = hasFeature('includeJquery');
            this.includeModernizr = hasFeature('includeModernizr');
            this.includeRequire = hasFeature('includeRequire');
            this.includePagespeed = hasGruntFeature('includePagespeed');
            this.projectType = props.projectType;

            this.dependencies = {};

            if ( this.includeJquery ) {
                this.dependencies["jquery"] = "~1.11.1";
            }

            if ( this.includeModernizr ) {
                this.dependencies["modernizr"] = "latest";
            }

            cb();

        }.bind(this));

    },

    copyingDependencyFiles: function() {
        var done = this.async();

        this.copy('_package.json', 'package.json');
        this.copy('_bower.json', 'bower.json');
        this.copy('_Gruntfile.js', 'Gruntfile.js');
        
        this.mkdir('grunt');
        this.copy('grunt/_aliases.yaml', 'grunt/aliases.yaml');
        this.copy('grunt/_compass.js', 'grunt/compass.js');
        this.copy('grunt/_copy.js', 'grunt/copy.js');
        if (this.includePagespeed) {
            this.copy('grunt/_pagespeed.js', 'grunt/pagespeed.js');
        }
        this.copy('grunt/_shell.js', 'grunt/shell.js');
        this.copy('grunt/_watch.js', 'grunt/watch.js');
        if (this.includeRequire) {
            this.copy('grunt/_bower.js', 'grunt/bower.js');
        } else {
            this.template('grunt/_uglify.js', 'grunt/uglify.js');
        }
        if (this.includeModernizr) {
            this.copy('grunt/_modernizr.js', 'grunt/modernizr.js');
        }

        done();
    },

    cloningTemplates: function() {
        var done = this.async();
        
        if(this.projectType === "symfonyTemplate") {
            this.remote('ru7hl355', 'symfony-test', this.projectType, function(err, remote) {
                remote.directory('.', 'source');
                done();
            });
        } else if(this.projectType === 'staticTemplate') {
            this.remote('ru7hl355', 'static-test', this.projectType, function(err, remote) {
                remote.directory('.', 'source');
                done();
            });
        } else if(this.projectType === 'drupalTemplate') {
            this.remote('repo-user', 'repo-name-drupal', this.projectType, function(err, remote) {
                remote.directory('.', 'source');
                done();
            });
        }
    },

    copyingJsFiles: function() {
        var done = this.async();

        this.mkdir('export');
        this.mkdir('source/js');

        if ( this.includeRequire ) {
            this.copy('js/_global-require.js', 'source/js/global.js');
        } else {
            this.mkdir('source/js/source');
            this.mkdir('source/js/source/components');
            this.mkdir('source/js/source/lib');
            this.mkdir('source/js/source/plugins');
            this.copy('js/_global-norequire.js', 'source/js/source/global.js');
        }

        done();
    },

    installingDependencies: function () {
        this.on('end', function() {
            this.installDependencies({
                callback: function () {
                    if ( this.includeRequire ) {
                        this.spawnCommand('grunt', ['bower']);
                    }
                    this.log(yosay('Your site is ready! Type "grunt" or "grunt watch" to compile your build.'));
                    
                }.bind(this)
            });
        });
    }
});