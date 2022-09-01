declare module "mongo-sanitize" {
  export default function sanitize({}: {[idx: string]: any}): {[idx: string]: any};
}