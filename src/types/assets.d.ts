/**
 * Image imports (src/assets/) resolve at build time via webpack's
 * asset/resource module type (webpack.config.mjs) -- TypeScript needs a
 * declaration to know these imports are valid and what type they produce.
 */
declare module "*.svg" {
  const src: string;
  export default src;
}
declare module "*.png" {
  const src: string;
  export default src;
}
declare module "*.jpg" {
  const src: string;
  export default src;
}
