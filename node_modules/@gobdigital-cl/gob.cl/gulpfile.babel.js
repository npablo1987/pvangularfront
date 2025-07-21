import gulp from 'gulp';
import gulpClean from 'gulp-clean';
import gulpSass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import pug from 'gulp-pug';
import sass from 'sass';
import Fiber from 'fibers';
import svg2font from 'svgtofont';
import path from 'path';
import packageImporter from 'node-sass-package-importer';

import { rollup } from 'rollup';
import rollupBabel from 'rollup-plugin-babel';

import browserSync from 'browser-sync';

import icons from './src/fonts/gob-cl.json';

const server = browserSync.create();

gulpSass.compiler = sass;

const copyFonts = () => (
  gulp.src('./src/fonts/*')
    .pipe(gulp.dest('./site/fonts'))
    .pipe(gulp.dest('./dist/fonts'))
);

const copyImages = () => (
  gulp.src('./src/img/**/*')
    .pipe(gulp.dest('./site/img'))
    .pipe(gulp.dest('./dist/img'))
);

const clean = () => (
  gulp.src([
    './dist',
    './site/{css,fonts,img,js}',
    './site/**/*.html'
  ], { allowEmpty: true })
    .pipe(gulpClean())
);

const buildCss = () => (
  gulp.src('./src/scss/gob.cl.scss')
    .pipe(sourcemaps.init())
    .pipe(gulpSass({
      fiber: Fiber,
      precision: 10,
      importer: packageImporter()
    }).on('error', gulpSass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(rename('gob.cl.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./site/css'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(server.stream())
);

const buildDocCss = () => (
  gulp.src('./site/scss/doc.scss')
    .pipe(sourcemaps.init())
    .pipe(gulpSass({
      fiber: Fiber,
      precision: 10,
      importer: packageImporter()
    }).on('error', gulpSass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(rename('doc.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./site/css'))
    .pipe(server.stream())
);

function reload(done) {
  server.reload();
  done();
}

const watchScss = () => gulp.watch('./src/scss/**/*.scss', gulp.series(buildCss, buildDocCss));

const buildJs = () => (
  rollup({
    input: './src/js/app.js',
    plugins: [
      rollupBabel({
        presets: [['@babel/env', { modules: 'false' }]],
        exclude: 'node_modules/**'
      })
    ]
  })
    .then(bundle => (
      bundle.write({
        file: './dist/js/gob.cl.js',
        format: 'iife',
        sourcemap: true
      })
    ))
);

const copyJs = () => (
  gulp.src('./dist/js/gob.cl.{js,js.map}')
    .pipe(gulp.dest('./dist/js'))
    .pipe(gulp.dest('./site/js'))
);

const watchJs = () => gulp.watch('./src/js/**/*.js', gulp.series(buildJs, reload));

const buildHTMLExamples = () => (
  gulp.src('src/templates/examples/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('./site/examples'))
);

const buildHTML = () => (
  gulp.src([
    'src/templates/*.pug',
    'src/templates/includes/*.pug'
  ])
    .pipe(pug({
      pretty: true,
      basedir: 'src/templates/',
      data: {
        docSidebar: [{
          page: '/',
          title: 'Comenzando'
        }, {
          page: 'framework-explanation.html',
          title: 'Estructura del framework'
        }, {
          page: 'development.html',
          title: 'Desarrollo'
        }, {
          page: 'accessibility.html',
          title: 'Accesibilidad'
        }, {
          page: 'typography.html',
          title: 'Tipografía'
        }, {
          page: 'colors.html',
          title: 'Colores'
        }, {
          page: 'icons.html',
          title: 'Íconos'
        }, {
          page: 'sections.html',
          title: 'Secciones'
        }, {
          page: 'buttons.html',
          title: 'Botones'
        }, {
          page: 'navbar.html',
          title: 'Navegación'
        }, {
          page: 'pagination.html',
          title: 'Paginación'
        }, {
          page: 'tags.html',
          title: 'Tags'
        }, {
          page: 'cards.html',
          title: 'Cards'
        }, {
          page: 'news.html',
          title: 'Noticias'
        }, {
          page: 'custom-presentation.html',
          title: 'Presentación personalizada'
        }, {
          page: 'profiles.html',
          title: 'Perfiles'
        }, {
          page: 'banners.html',
          title: 'Banners'
        }, {
          page: 'search-form.html',
          title: 'Formulario de búsqueda'
        }, {
          page: 'tabs.html',
          title: 'Tabs'
        }, {
          page: 'collapsibles.html',
          title: 'Colapsables'
        }, {
          page: 'footer-explanation.html',
          title: 'Footer'
        }, {
          page: 'forms.html',
          title: 'Formularios'
        }, {
          page: 'utilities.html',
          title: 'Utilidades'
        }],
        docIcons: Object.keys(icons)
      }
    }))
    .pipe(gulp.dest('./site'))
);

const cleanFont = () => (
  gulp.src([
    './src/fonts'
  ], { allowEmpty: true })
    .pipe(gulpClean())
);

const buildFont = (done) => {
  svg2font({
    src: path.resolve(process.cwd(), './src/svg'),
    dist: path.resolve(process.cwd(), './src/fonts'),
    fontName: 'gob-cl',
    classNamePrefix: 'cl',
    styleTemplates: path.resolve(process.cwd(), './src/templates/styles'),
    startUnicode: 0xea01,
    svgicons2svgfont: {
      fontHeight: 1000,
      normalize: true
    },
    outSVGPath: true,
    css: {
      output: './src/scss/icons',
      include: 'scss'
    }
  })
    .then(done);
};

const watchPug = () => gulp.watch(
  './src/templates/**/*.pug',
  gulp.series(gulp.parallel(buildHTML, buildHTMLExamples), reload)
);

const serve = (done) => {
  server.init({
    server: {
      baseDir: ['./dist', './', './site'],
      index: 'index.html',
      routes: {
        './node_modules': 'node_modules',
        '../css': 'css'
      }
    },
    port: 5000,
    open: false
  });
  done();
};

const serveDoc = (done) => {
  server.init({
    server: {
      baseDir: ['./dist', './', './site'],
      index: 'doc.html',
      routes: {
        './node_modules': 'node_modules',
        '../css': 'css'
      }
    },
    port: 5000,
    open: false
  });
  done();
};

gulp.task('clean', clean);
gulp.task('copy', gulp.parallel(copyFonts, copyImages));

gulp.task('build', gulp.series(
  'clean',
  gulp.series(gulp.parallel(buildCss, buildDocCss, 'copy', buildJs, buildHTML, buildHTMLExamples), copyJs)
));
gulp.task('build:html', buildHTML);

gulp.task('watch', gulp.series('build', gulp.parallel(watchScss, watchPug, watchJs)));
gulp.task('serve', gulp.series('build', serve, gulp.parallel(watchScss, watchJs, watchPug)));
gulp.task('serve:doc', gulp.series('build', serveDoc, gulp.parallel(watchScss, watchJs, watchPug)));

gulp.task('build:font', gulp.series(cleanFont, buildFont));

gulp.task('default', gulp.series('serve'));
