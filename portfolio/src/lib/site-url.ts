const DEFAULT_LOCAL_SITE_URL = "http://localhost:3030";

const trimTrailingSlash = (url: string) => url.trim().replace(/\/+$/, "");

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredUrl) {
    return trimTrailingSlash(configuredUrl);
  }

  if (process.env.VERCEL_URL) {
    return trimTrailingSlash(`https://${process.env.VERCEL_URL}`);
  }

  return DEFAULT_LOCAL_SITE_URL;
}
