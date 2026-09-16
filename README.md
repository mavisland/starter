# Starter

This project automates and optimizes various development tasks using Gulp.js. The tasks include compiling SASS to CSS, transpiling and minifying JavaScript, optimizing images, generating spritesheets, compiling templates, and more.

## Prerequisites

- Node.js v20.19.0 or later
- npm v10 or later (the primary package manager)

## Installation

1.  Clone the repository:

```sh
git clone https://github.com/mavisland/starter.git
cd starter
```

2.  Install the dependencies:

```sh
npm ci
```

`npm ci` installs the exact versions in `package-lock.json`. Use `npm install` when adding or updating dependencies and commit the updated lockfile. Security overrides are defined in `package.json`.

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
npm run start
```

2.  The development server runs at `http://localhost:9050`. Any changes made to the source files will automatically trigger the relevant tasks and reload the browser.

Use `npm run dev` to clean the output before starting. If native filesystem events are unavailable, run `CHOKIDAR_USEPOLLING=true npm start`.

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

Generated CSS and JavaScript bundles include a banner with the following information:

- Project name
- Project description
- Version
- Homepage
- License

## Validation

```sh
npm run check
npm run build
npm run archive
```

`npm run check` checks JavaScript and configuration syntax. There is currently no automated test suite. Production compilation errors fail the build command; development tasks keep watching for corrections.

GitHub Actions installs dependencies with `npm ci`, checks syntax, builds the project, checks generated files and binary font copying, and validates the ZIP archive on Node.js 20, 22, and 24. It runs on pushes, pull requests, and manual dispatch.

`npm version` cleans, builds, and archives the project. Push commits and tags separately when ready.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
