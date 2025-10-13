import { connectToDatabase } from "@/lib/db";
import { EventModel } from "@/models/Event";
import { GalleryItemModel } from "@/models/GalleryItem";
import { TeamMemberModel } from "@/models/TeamMember";

async function seed() {
	await connectToDatabase();

	// TODO: Replace placeholders with branch-specific content
	const sampleEvents = [
		{
			title: "Tech Fusion Summit",
			slug: "tech-fusion-summit",
			description: "Flagship IEEE BUBT SB symposium featuring workshops on AI, IoT, and robotics.",
			eventDate: new Date(),
			location: "BUBT Auditorium",
			coverImage: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
			tags: ["Workshop", "Innovation"],
			featured: true
		}
	];

	const sampleTeam = [
		{
			name: "Jane Doe",
			role: "Chair",
			bio: "Leading initiatives to empower young engineers at BUBT.",
			photoUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
			priority: 100,
			socials: {
				linkedin: "https://www.linkedin.com"
			}
		}
	];

	const sampleGallery = [
		{
			title: "Workshop Highlights",
			publicId: "sample",
			imageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
			event: "Tech Fusion Summit",
			uploadedAt: new Date()
		}
	];

	await Promise.all([
		EventModel.deleteMany({}),
		TeamMemberModel.deleteMany({}),
		GalleryItemModel.deleteMany({})
	]);

	await EventModel.insertMany(sampleEvents);
	await TeamMemberModel.insertMany(sampleTeam);
	await GalleryItemModel.insertMany(sampleGallery);
}

seed()
	.then(() => {
		console.log("Seed data inserted successfully");
		process.exit(0);
	})
	.catch((error) => {
		console.error("Seeding failed", error);
		process.exit(1);
	});
