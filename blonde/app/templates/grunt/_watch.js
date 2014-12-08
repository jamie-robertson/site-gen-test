module.exports = {
	watch: {
        options: { 
            livereload: true, 
            port: 1337 
        },
        scripts: {
            files: ['components/js/*.js'],
            tasks: ['jshint']
        },
        html: {
            files: ['*.html'],
            tasks: ['htmlhint:build']
        },
        css: {
            files: ['components/sass/*.scss'],
            tasks: ['compass:dev', 'autoprefixer:build', 'cssc:build']
        },
        images: {
            files: ['images/*'],
            tasks: ['newer:imageoptim']
        }
    }
}