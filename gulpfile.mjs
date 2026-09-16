//
// Gulp.js Configurations
//

"use strict";

// Packages
import { src, dest, series, parallel, watch as gulpWatch } from "gulp";

// Configuration
import config from "./starter.config.mjs";

// Style related packages
import * as dartSass from "sass";
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
import twig from "twig";

// Image related packages
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from "gulp-imagemin";
import spritesmith from "gulp.spritesmith";

// Server related packages
import browserSync from "browser-sync";
const bs = browserSync.create();

// Utility packages
import { deleteAsync } from "del";
import fs from "fs";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import concat from "gulp-concat";
import gulpif from "gulp-if";
import header from "gulp-header";
import plumber from "gulp-plumber";
import rename from "gulp-rename";
import zip from "gulp-zip";

import pkg from "./package.json" with { type: "json" };

const isDevelopment = () => process.env.NODE_ENV === "development";

// Keep watch tasks alive, but let production builds report compilation failures.
const runPipeline = (input, ...transforms) => {
  if (!isDevelopment()) return pipeline(input, ...transforms);
  const stream = input.pipe(
    plumber(function (error) {
      console.error(error.toString());
      this.emit("end");
    }),
  );
  return transforms.reduce((output, transform) => output.pipe(transform), stream);
};

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
const archiveDist = () => {
  return pipeline(
    src(config.archive.input, { encoding: false }),
    zip(pkg.name + "_v" + pkg.version + "-build_" + getTimestamp() + ".zip"),
    dest(config.archive.output),
  );
};

// Remove pre-existing content from output folders
const cleanDist = async () => {
  await deleteAsync(config.clean);
};

// Optimise GIF, JPEG, PNG and SVG images
const buildImages = () => {
  return runPipeline(
    src(config.images.input, { encoding: false }),
    imagemin([
      gifsicle({ interlaced: true }),
      mozjpeg({ progressive: true }),
      optipng({ optimizationLevel: 5 }),
      svgo(),
    ]),
    dest(config.images.output),
  );
};

// Concanate & minify JavaScript files
const buildScripts = () => {
  return runPipeline(
    src(config.scripts.input),
    gulpif(isDevelopment(), sourcemaps.init()),
    babel({ presets: ["@babel/env"] }),
    concat("scripts.js"),
    header(banner, { pkg }),
    dest(config.scripts.output),
    terser({ keep_fnames: true, mangle: false }),
    rename({ suffix: ".min" }),
    gulpif(isDevelopment(), sourcemaps.write(".")),
    dest(config.scripts.output),
  );
};

// Convert a set of images into a spritesheet and CSS variables
const buildSprites = () => {
  return pipeline(
    src(config.sprites.input, { encoding: false }),
    spritesmith({
      imgName: "s.png",
      cssName: "_sprites.scss",
      cssFormat: "scss",
      cssTemplate: "src/sprites/scss.template.handlebars",
      imgPath: "../images/s.png",
      padding: 3,
      imgOpts: { quality: 100 },
    }),
    dest(config.sprites.output),
  );
};

// Compile, autoprefix & minify SASS files
const buildStyles = () => {
  return runPipeline(
    src(config.styles.input),
    gulpif(isDevelopment(), sourcemaps.init()),
    sass({ outputStyle: "expanded" }),
    postcss([autoprefixer()]),
    header(banner, { pkg }),
    dest(config.styles.output),
    cleanCSS({ level: { 1: { specialComments: 0 } } }),
    header(banner, { pkg }),
    rename({ suffix: ".min" }),
    gulpif(isDevelopment(), sourcemaps.write(".")),
    dest(config.styles.output),
  );
};

// Compile Twig files to HTML
const buildTemplates = () => {
  twig.cache(false);
  return runPipeline(
    src(config.templates.input),
    new Transform({
      objectMode: true,
      transform(file, encoding, callback) {
        try {
          const content = JSON.parse(fs.readFileSync(config.content, "utf8"));
          const target = {
            path: file.path.replace(/\.twig$/, ".html"),
            relative: file.relative.replace(/\.twig$/, ".html"),
          };
          const template = twig.twig({ path: file.path, async: false, rethrow: true });
          file.contents = Buffer.from(template.render({ ...content, _file: file, _target: target }));
          file.path = target.path;
          callback(null, file);
        } catch (error) {
          callback(new Error(`${file.relative}: ${error.message || error}`, { cause: error }));
        }
      },
    }),
    dest(config.templates.output),
  );
};

// 'copy:fonts'
const copyFonts = () => {
  return src(config.fonts.input, { encoding: false }).pipe(dest(config.fonts.output));
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
const watchSource = async () => {
  // Set polling before Chokidar chooses the native macOS event backend.
  const options = process.env.CHOKIDAR_USEPOLLING
    ? { usePolling: !/^(false|0)$/i.test(process.env.CHOKIDAR_USEPOLLING) }
    : {};
  const watchers = [
    gulpWatch(config.images.watch, options, series(buildImages, reloadBrowser)),
    gulpWatch(config.scripts.watch, options, series(buildScripts, reloadBrowser)),
    gulpWatch(config.styles.watch, options, series(buildStyles, reloadBrowser)),
    gulpWatch([config.templates.watch, config.content], options, series(buildTemplates, reloadBrowser)),
  ];
  await Promise.all(
    watchers.map((watcher) => new Promise((resolve, reject) => watcher.once("ready", resolve).once("error", reject))),
  );
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
