// Jest can't parse SVG/PNG/JPG (webpack's asset/resource module type, see
// webpack.config.mjs, has no Jest equivalent). Tests only need a stable
// string wherever an image import is used as an `src` -- the exact value
// doesn't matter for assertions, unlike CSS class names, so this is a
// simpler stand-in than styleMock.cjs (@lynkflow/config/jest/styleMock.cjs),
// not a copy of it.
module.exports = "test-file-stub";
