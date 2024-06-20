//
// Gulp.js Configurations
//

"use strict";

// Packages
import { src, dest, series, parallel, watch as gulpWatch } from "gulp";

// Configuration
import config from "./starter.config.mjs";

// Style related packages
import dartSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(dartSass);
import postcss from "gulp-postcss";
import cleanCSS from "gulp-clean-css";
import autoprefixer from "autoprefixer";
import sourcemaps from "gulp-sourcemaps";

// JavaScript related packages
import babel from "gulp-babel";
import terser from "gulp-terser";

// Template related packages
import twig from "gulp-twig";
import data from "gulp-data";

// Image related packages
import imagemin from "gulp-imagemin";
import spritesmith from "gulp.spritesmith";

// Server related packages
import browserSync from "browser-sync";
const bs = browserSync.create();

// Utility packages
import { deleteAsync } from "del";
import fs from "fs";
import concat from "gulp-concat";
import gulpif from "gulp-if";
import header from "gulp-header";
import plumber from "gulp-plumber";
import rename from "gulp-rename";
import zip from "gulp-zip";

// Import JSON with assert
import pkg from "./package.json" assert { type: "json" };

// File Banner
const banner = [
  "/*!",
  " * <%= pkg.name %> - <%= pkg.description %>",
  " * @version v<%= pkg.version %>",
  " * @link <%= pkg.homepage %>",
  " * @license <%= pkg.license %>",
  " */",
  "",
].join("\n");

// Get Timestamp
const getTimestamp = () => {
  let date = new Date();
  let year = date.getFullYear().toString();
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);
  let hour = ("0" + date.getHours().toString()).slice(-2);
  let minute = ("0" + date.getMinutes().toString()).slice(-2);
  let second = ("0" + date.getSeconds().toString()).slice(-2);
  return year + month + day + hour + minute + second;
};

// Archive pre-existing content from output folders
const archiveDist = (cb) => {
  src(config.archive.input)
    .pipe(zip(pkg.name + "_v" + pkg.version + "-build_" + getTimestamp() + ".zip"))
    .pipe(dest(config.archive.output));
  return cb();
};

// Remove pre-existing content from output folders
const cleanDist = async (cb) => {
  await deleteAsync(config.clean);
  return cb();
};

// Optimise GIF, JPEG, PNG and SVG images
const buildImages = () => {
  return src(config.images.input)
    .pipe(plumber())
    .pipe(
      imagemin({
        interlaced: true,
        progressive: true,
        optimizationLevel: 5,
        svgoPlugins: [
          {
            removeViewBox: true,
          },
        ],
      }),
    )
    .pipe(dest(config.images.output));
};

// Concanate & minify JavaScript files
const buildScripts = () => {
  return src(config.scripts.input)
    .pipe(plumber())
    .pipe(gulpif(process.env.NODE_ENV === "development", sourcemaps.init()))
    .pipe(
      babel({
        presets: ["@babel/env"],
      }),
    )
    .pipe(concat("scripts.js"))
    .pipe(header(banner, { pkg }))
    .pipe(dest(config.scripts.output))
    .pipe(
      terser({
        keep_fnames: true,
        mangle: false,
      }),
    )
    .pipe(
      rename({
        suffix: ".min",
      }),
    )
    .pipe(gulpif(process.env.NODE_ENV === "development", sourcemaps.write(".")))
    .pipe(dest(config.scripts.output));
};

// Convert a set of images into a spritesheet and CSS variables
const buildSprites = (cb) => {
  const spriteData = src(config.sprites.input)
    .pipe(plumber())
    .pipe(
      spritesmith({
        imgName: "s.png",
        cssName: "_sprites.scss",
        cssFormat: "scss",
        cssTemplate: "src/sprites/scss.template.handlebars",
        imgPath: "../images/s.png",
        padding: 3,
        imgOpts: {
          quality: 100,
        },
      }),
    );

  spriteData.img.pipe(dest(config.sprites.output));
  spriteData.css.pipe(dest(config.sprites.output));

  return cb();
};

// Compile, autoprefix & minify SASS files
const buildStyles = () => {
  return src(config.styles.input)
    .pipe(plumber())
    .pipe(gulpif(process.env.NODE_ENV === "development", sourcemaps.init()))
    .pipe(
      sass({
        outputStyle: "expanded",
      }),
    )
    .pipe(postcss([autoprefixer()]))
    .pipe(header(banner, { pkg }))
    .pipe(dest(config.styles.output))
    .pipe(
      cleanCSS({
        level: {
          1: {
            specialComments: 0,
          },
        },
      }),
    )
    .pipe(header(banner, { pkg }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulpif(process.env.NODE_ENV === "development", sourcemaps.write(".")))
    .pipe(dest(config.styles.output));
};

// Compile Twig files to HTML
const buildTemplates = () => {
  return src(config.templates.input)
    .pipe(plumber())
    .pipe(
      data((file) => {
        return JSON.parse(fs.readFileSync(config.content));
      }),
    )
    .pipe(twig())
    .pipe(dest(config.templates.output));
};

// 'copy:fonts'
const copyFonts = () => {
  return src(config.fonts.input).pipe(dest(config.fonts.output));
};

// 'copy:scripts'
const copyScripts = () => {
  return src(config.scripts.copy).pipe(dest(config.scripts.output));
};

// Watch for changes to the source directory
const serveDist = (cb) => {
  bs.init({
    server: {
      baseDir: config.server.root,
    },
    open: false,
    port: 9050,
  });
  cb();
};

// Reload the browser when files change
const reloadBrowser = (cb) => {
  bs.reload();
  cb();
};

// Watch all file changes
const watchSource = () => {
  gulpWatch(config.images.watch, series(buildImages, reloadBrowser));
  gulpWatch(config.scripts.watch, series(buildScripts, reloadBrowser));
  gulpWatch(config.styles.watch, series(buildStyles, reloadBrowser));
  gulpWatch([config.templates.watch, config.content], series(buildTemplates, reloadBrowser));
};

// Archive task
export const archive = archiveDist;

// Clean task
export const clean = cleanDist;

// Sprites task
export const sprites = buildSprites;

// copy
export const copyStatic = parallel(copyFonts, copyScripts);

// Build task
export const build = series(
  parallel(copyFonts, copyScripts),
  parallel(buildScripts, buildStyles, buildTemplates),
  buildImages,
);

// Watch Task
export const watch = watchSource;

// Default task
export default series(build, serveDist, watchSource);
