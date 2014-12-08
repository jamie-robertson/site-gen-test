module.exports = {
	uglify: {
            my_target: {
                files: {
                    'js/script.js' : ['components/js/*.js']
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
}