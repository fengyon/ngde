/* eslint-disable @typescript-eslint/no-var-requires */
import json from '@rollup/plugin-json'
// import babel from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
const banner = `
/**
 * ngdec - some decorators of typescript for angular 
 * Copyright (c) 2023-${new Date().getFullYear()}, Fengyon. (MIT Licensed)
 * https://github.com/fengyon/ngde
 */
`
const extensions = ['.js', '.ts', '.json']
const exclude = ['node_modules/**', 'src/test/**']

export default [
  {
    input: './src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'esm',
      banner,
      sourcemap: true,
    },
    plugins: [
      // 自动将dependencies依赖声明为外部依赖
      // externals({ devDeps: false }),
      // babel({
      //   exclude,
      //   extensions,
      // }),
      commonjs({ extensions }), // the ".ts" extension is required
      json(),
      typescript({
        include: 'src/**',
        exclude,
        declaration: true,
        declarationDir: 'dist',
        declarationMap: true,
        outDir: 'dist',
        sourceMap: true,
      }),
      nodeResolve({
        extensions,
        modulesOnly: true,
        preferredBuiltins: false,
      }),
      // terser({
      //   sourceMap: true,
      // }),
    ],
  },
]
