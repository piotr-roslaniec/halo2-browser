const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const config = {
  mode: "development",
  entry: {
    index: "./src/index.ts"
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "./src/index.html", to: "./index.html" }]
    })
  ],
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    modules: [
      path.resolve(__dirname, "./src"),
      path.resolve(__dirname, "./node_modules")
    ],
    fallback: {
      // https: require.resolve("https-browserify"),
      // url: require.resolve("url/"),
      // http: require.resolve("stream-http"),
      // buffer: require.resolve("buffer/"),
      // events: require.resolve("events/"),
    },
  },
  devServer: {
    hot: "only",
    compress: true,
    port: 9000,
    headers: {
      // Required by `SharedArrayBuffer` in `halo2-wasm`
      // See: https://stackoverflow.com/questions/72881660/web-worker-blocked-by-self-crossoriginisolated-on-cypress
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader"
        }
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  stats: { modules: false, children: false, entrypoints: false }
};

module.exports = config;
