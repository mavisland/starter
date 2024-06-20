# Starter

This project automates and optimizes various development tasks using Gulp.js. The tasks include compiling SASS to CSS, transpiling and minifying JavaScript, optimizing images, generating spritesheets, compiling templates, and more.

## Prerequisites

- Node.js (v18.x or later)
- npm (v6.x or later) or yarn (v1.x or later)

## Installation

1.  Clone the repository:

```sh
git clone https://github.com/mavisland/starter.git
cd starter
```

2.  Install the dependencies:

```sh
npm install
# or
yarn install
```

## Configuration

The configuration file `starter.config.mjs` holds paths and settings for different tasks. Ensure this file is correctly set up according to your project structure.

## Available Gulp Tasks

### `gulp archive`

Archives pre-existing content from output folders into a ZIP file with a timestamp.

### `gulp clean`

Removes pre-existing content from the output folders.

### `gulp sprites`

Generates a spritesheet and corresponding SASS variables from a set of images.

### `gulp copyStatic`

Copies static files such as fonts and scripts to the output directory.

### `gulp build`

Performs a full build of the project, including:

- Copying static files
- Compiling and minifying scripts
- Compiling, autoprefixing, and minifying styles
- Compiling templates
- Optimizing images

### `gulp watch`

Watches for changes in source files and automatically triggers the appropriate tasks.

### `gulp`

Runs the default task, which builds the project, starts a development server, and watches for changes.

## Development Workflow

1.  Start the development server and watch for changes:

```sh
gulp
```

2.  The development server runs at `http://localhost:9050`. Any changes made to the source files will automatically trigger the relevant tasks and reload the browser.

## Task Details

### Styles

- Compiles SASS to CSS
- Autoprefixes CSS for cross-browser compatibility
- Minifies the CSS

### Scripts

- Transpiles JavaScript using Babel
- Concatenates and minifies JavaScript files

### Templates

- Compiles Twig templates to HTML
- Uses JSON data to populate templates

### Images

- Optimizes GIF, JPEG, PNG, and SVG images

### Sprites

- Generates a spritesheet and corresponding SASS variables from a set of images

### Static Files

- Copies fonts and additional scripts to the output directory

## File Banner

Each generated file includes a banner with the following information:

- Project name
- Project description
- Version
- Homepage
- License

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
