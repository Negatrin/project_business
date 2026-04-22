import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.vercel-storage.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
}

export default withNextIntl(nextConfig)
