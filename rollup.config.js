import { terser } from 'rollup-plugin-terser';

export default {
  input: 'script/media.js',
  output: {
    file: 'dist/script/media.min.js',
    format: 'iife',
    name: 'MediaPlayer'
  },
  plugins: [
    terser()
  ]
};
