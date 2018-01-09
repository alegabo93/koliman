// generated on 2016-08-15 using generator-webapp 2.1.0
// const gulp = require('gulp');
// const gulpLoadPlugins = require('gulp-load-plugins');
// const browserSync = require('browser-sync');
// const del = require('del');
// const wiredep = require('wiredep').stream;
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import {stream as wiredep} from 'wiredep';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

var scsslint = require('gulp-scss-lint');

gulp.task('styles', () => {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 5 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('scss-lint', function() {
  return gulp
    .src(['app/styles/main.scss', 'app/styles/**/*.scss'])
    .pipe(scsslint({
      'config' : '.scss-lint.yml'
    }));
});

gulp.task('scripts', () => {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}));
});

gulp.task('pug', () => {
  return gulp.src('app/pug/**/*.pug')
    .pipe($.pug({pretty: true}))
    .pipe(gulp.dest('.tmp'))
    .pipe(reload({stream: true}));
});

function lint(files, options) {
  return gulp.src(files)
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint(options))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/scripts/**/*.js', {
    fix: true
  })
    .pipe(gulp.dest('app/scripts'));
});

gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js', {
    fix: true,
    env: {
      mocha: true
    }
  })
  .pipe(gulp.dest('test/spec/**/*.js'));
});

gulp.task('html', ['pug', 'styles', 'scripts'], () => {
  return gulp.src(['app/**/*.html', '.tmp/**/*.html'])
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
    // .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('dist'));
});

// gulp.task('html', ['pug', 'styles', 'scripts'], () => {
//   const assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

//   return gulp.src(['app/**/*.html', '.tmp/**/*.html'])
//     .pipe(assets)
//     .pipe($.if('*.js', $.uglify()))
//     .pipe($.if('*.css', $.minifyCss({compatibility: '*', processImport: false})))
//     .pipe(assets.restore())
//     .pipe($.useref())
//     .pipe(gulp.dest('dist'));
// });

// gulp.task('html', ['pug', 'styles', 'scripts'], () => {
//   const assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

//   return gulp.src(['app/**/*.html', '.tmp/**/*.html'])
//     .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
//     .pipe($.if('*.js', $.uglify()))
//     .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
//     .pipe(assets.restore())
//     .pipe($.useref())
//     .pipe(gulp.dest('dist'));
// });

gulp.task('images', () => {
  return gulp.src('app/assets/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('dist/assets/'));
});

gulp.task('copy-bs-fonts', function(){
  return gulp.src('bower_components/bootstrap-sass/assets/fonts/bootstrap/*.{eot,svg,ttf,woff,woff2}')
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});


gulp.task('fonts', ['copy-bs-fonts'], () => {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['pug', 'scss-lint', 'styles', 'scripts', 'fonts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'app/*.html',
    '.tmp/*.html',
    'app/scripts/**/*.js',
    '.tmp/scripts/**/*.js',
    'app/images/**/*',
    '.tmp/fonts/**/*',
    'app/styles/**/*.scss'
  ]).on('change', reload);

  gulp.watch('app/pug/**/*.pug', ['pug']).on('change', reload);
  gulp.watch('app/styles/**/*.scss', ['scss-lint', 'styles']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('app/scripts/**/*.js', ['scripts', reload]);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

gulp.task('serve:test', ['scripts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/scripts',
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      exclude: ['bootstrap-sass'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['lint', 'html', 'images', 'fonts', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
