const fs = require('fs');
const { execSync } = require('child_process');
const { nodeResolve } = require('@rollup/plugin-node-resolve');

function cleanDist() {
  return {
    name: 'clean-dist',
    buildStart() {
      fs.rmSync('dist', { recursive: true, force: true });
    },
  };
}

function minifyJavaScript() {
  return {
    name: 'minify-javascript',
    renderChunk(code) {
      const uglify = require('uglify-js');
      const result = uglify.minify(code);

      if (result.error) {
        throw result.error;
      }

      return {
        code: result.code,
        map: null,
      };
    },
  };
}

function emitStaticFiles() {
  return {
    name: 'emit-static-files',
    generateBundle() {
      const html = fs
        .readFileSync('public/index.html', 'utf8')
        .replace(
          /<script\s+type="module"\s+src="(?:\.\.\/)?(?:src\/)?script\/index\.js"><\/script>/,
          '<script src="index.min.js"></script>',
        )
        .replace(
          /<link\s+href="(?:\.\.\/)?(?:src\/)?style\/media\.css"\s+rel="stylesheet"\s+type="text\/css"\s*\/>/,
          '<link href="style/media.min.css" rel="stylesheet" type="text/css" />',
        );

      this.emitFile({
        type: 'asset',
        fileName: 'index.html',
        source: html,
      });

      this.emitFile({
        type: 'asset',
        fileName: 'style/media.min.css',
        source: execSync('npx cleancss src/style/media.css', { encoding: 'utf8' }),
      });

      if (fs.existsSync('public/favicon.ico')) {
        this.emitFile({
          type: 'asset',
          fileName: 'favicon.ico',
          source: fs.readFileSync('public/favicon.ico'),
        });
      }

      if (fs.existsSync('data')) {
        for (const fileName of fs.readdirSync('data')) {
          if (!fileName.toLowerCase().endsWith('.mp4')) {
            continue;
          }

          this.emitFile({
            type: 'asset',
            fileName: `data/${fileName}`,
            source: fs.readFileSync(`data/${fileName}`),
          });
        }
      }
    },
  };
}

module.exports = {
  input: 'src/script/index.js',
  output: {
    file: 'dist/index.min.js',
    format: 'iife',
    name: 'OTTPlayerApp',
  },
  plugins: [cleanDist(), nodeResolve(), minifyJavaScript(), emitStaticFiles()],
};