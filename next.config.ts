export default {
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
