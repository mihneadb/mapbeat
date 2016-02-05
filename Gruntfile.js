module.exports = function(grunt) {

  grunt.initConfig({
    jsdoc : {
      dist : {
        src: ['app.js'],
        options: {
          destination: 'jsdoc'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask('default', ['jsdoc']);

};
