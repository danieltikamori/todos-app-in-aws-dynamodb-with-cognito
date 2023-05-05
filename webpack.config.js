// webpack.config.js
const slsw = require("serverless-webpack");
var nodeExternals = require("webpack-node-externals");

module.exports = {
  // ...
  //   mode options	descriptions:
  // development:	Sets process.env.NODE_ENV on DefinePlugin to value development. Enables useful names for modules and chunks.

  // production:	Sets process.env.NODE_ENV on DefinePlugin to value production. Enables deterministic mangled names for modules and chunks, FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin and TerserPlugin.

  // none:	Opts out of any default optimization options

  mode: "development",
  entry: slsw.lib.entries,
  // ...
  // we use webpack-node-externals to excludes all node deps.
  // You can manually set the externals too.
  // externals: [nodeExternals()]
  externals: {
    "aws-sdk": "aws-sdk"
  }
};
