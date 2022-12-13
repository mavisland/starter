const srcPath = "src";
const publicPath = "public";
const buildPath = "build";
const thirdPartyPath = `${srcPath}/third-party`;

module.exports = {
  archive: {
    input: `${publicPath}/**`,
    output: `${buildPath}/`,
  },
  clean: [`${publicPath}/`],
  content: "starter.content.json",
  fonts: {
    input: `${thirdPartyPath}/font-awesome/fonts/*`,
    output: `${publicPath}/fonts/`,
  },
  images: {
    input: `${srcPath}/images/**`,
    output: `${publicPath}/images/`,
    watch: `${srcPath}/images/**`,
  },
  scripts: {
    copy: `${thirdPartyPath}/jquery/jquery.min.js`,
    input: [
      `${thirdPartyPath}/bootstrap/js/bootstrap.bundle.min.js`,
      `${thirdPartyPath}/bootnavbar/js/bootnavbar.js`,
      `${thirdPartyPath}/slick/js/slick.min.js`,
      `${thirdPartyPath}/fancybox/js/jquery.fancybox.min.js`,
      `${thirdPartyPath}/utilities/data-slick.js`,
      `${thirdPartyPath}/utilities/fancybox-init.js`,
      `${srcPath}/js/scripts.js`,
    ],
    output: `${publicPath}/js/`,
    watch: `${srcPath}/js/**/*.js`,
  },
  server: {
    root: `${publicPath}/`,
  },
  sprites: {
    input: `${srcPath}/sprites/images/*.png`,
    output: `${srcPath}/images/`,
  },
  styles: {
    input: `${srcPath}/scss/*.scss`,
    output: `${publicPath}/css`,
    watch: [`${srcPath}/scss/**/*.scss`, `${thirdPartyPath}/**/*.scss`],
  },
  templates: {
    input: [`${srcPath}/html/**/*.twig`, `!${srcPath}/html/**/_*.twig`],
    output: `${publicPath}/`,
    watch: `${srcPath}/html/**/*.twig`,
  },
};
