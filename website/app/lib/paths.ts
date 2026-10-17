export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const href = (path: string) => `${basePath}${path}`;
export const repository = 'https://github.com/smeltery/pyreload-cli';
export const siteURL =
  process.env.SITE_URL || 'https://smeltery.github.io/pyreload-cli';
