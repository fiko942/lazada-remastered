/**
 * Base webpack config used across other specific configs
 */

import webpack, { dependencies } from 'webpack';
import webpackPaths from './webpack.paths';
import pkg, { dependencies as externals } from '../../release/app/package.json';
import Externals from 'webpack-node-externals';

const configuration: webpack.Configuration = {
  // externals: [...Object.keys(externals || {})],
  externals: [...Object.keys(dependencies || {})],
  stats: 'errors-only',
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            // Remove this line to enable type checking in webpack builds
            transpileOnly: true,
            compilerOptions: {
              module: 'esnext',
            },
          },
        },
      },
    ],
  },

  output: {
    path: webpackPaths.srcPath,
    // https://github.com/webpack/webpack/issues/1114
    library: {
      type: 'commonjs2',
    },
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [webpackPaths.srcPath, 'node_modules'],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
};

export default configuration;
