const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const css = require('rollup-plugin-css-only');
const copy = require('rollup-plugin-copy');

module.exports = {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'app',
    sourcemap: true,
    inlineDynamicImports: true
  },
  plugins: [
    resolve({
      browser: true
    }),
    commonjs(),
    css({ output: 'bundle.css' }),
    copy({
      targets: [
        { src: 'index.html', dest: 'dist' },
        { src: 'favicon.ico', dest: 'dist' }
      ]
    })
  ]
};
