// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
 
export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'es'
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      typescript: require("typescript"),
      rootDir: "src",
      outDir: 'dist'
    })
  ]
};