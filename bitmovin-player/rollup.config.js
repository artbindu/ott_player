import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs'

export default {
    input: "src/AmcBitmovin.js",
    external: ['thirdparty/bitmovin_8.90.0/*.js'],
    output: {
        file: 'dist/bundle.js',
        format: 'cjs', // 'iife',
        inlineDynamicImports: true
    },
    plugins: [
        resolve(),
        commonjs()
    ]
}