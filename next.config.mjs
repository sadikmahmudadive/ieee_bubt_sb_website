/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		serverActions: {
			bodySizeLimit: "2mb"
		}
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com"
			}
		]
	}
};

export default nextConfig;
