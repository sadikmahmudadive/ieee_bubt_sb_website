/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		serverActions: {
			bodySizeLimit: "2mb"
		},
		// Enable faster refresh and compilation
		webpackBuildWorker: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com"
			}
		]
	},
	// Enable swcMinify for faster builds
	swcMinify: true,
};

export default nextConfig;
