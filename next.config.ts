export default {
  output: 'standalone',
  // Pin explicitly: a sibling pnpm-lock.yaml at the monorepo root (../) makes
  // Turbopack misdetect the workspace root otherwise.
  turbopack: {
    root: __dirname
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'date-fns']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        search: ''
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        search: ''
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        search: ''
      }
    ]
  }
};
