var elixir = require('laravel-elixir');
var tailwindcss = require('tailwindcss');
var postcss = require('laravel-elixir-postcss');
var mix = require('laravel-mix');
var theme = 'grippers';
var purify = require('gulp-purifycss');
var autoprefix = require('gulp-autoprefixer');
var gulp = require('gulp');


elixir.config.assetsPath = './';
elixir.config.publicPath = './';

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Statamic theme. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    mix.postcss('grippers.css', {
      srcPath: 'postcss',
      options: {
        parser: require('postcss-scss')
      },
      output: 'css',
      plugins: [
        require('postcss-import'),
        require('postcss-nesting'),
        tailwindcss('tailwind.js'),
        require('tailwindcss')
      ]
    });
});

gulp.task('purify', function(){
  return gulp.src('css/grippers.css')
    .pipe(purify(['templates/**/*.html','layouts/**/*.html','partials/**/*.html'],{rejected:true,minify:true}))
    .pipe(autoprefix())
    .pipe(gulp.dest('css/dist'));
});
