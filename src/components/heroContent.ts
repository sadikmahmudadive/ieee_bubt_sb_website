type HeroSlideSeed = {
  title: string;
  subtitle: string;
  coverImage: string;
  slug?: string;
  eventDate?: string;
  location?: string;
};

export const fallbackSpotlight: Required<Pick<HeroSlideSeed, "title" | "subtitle" | "eventDate" | "location">> = {
  title: "Tech for Impact Summit",
  subtitle: "Where sustainable innovation, humanitarian tech, and industry mentorship collide.",
  eventDate: "2025-11-15T00:00:00.000Z",
  location: "BUBT Auditorium"
};

export const defaultSlides: HeroSlideSeed[] = [
  {
    title: fallbackSpotlight.title,
    subtitle: fallbackSpotlight.subtitle,
    coverImage: "https://res.cloudinary.com/dqmqc0uaa/image/upload/v1728383200/ieee-bubt/events/hackathon.jpg",
    slug: undefined,
    eventDate: fallbackSpotlight.eventDate,
    location: fallbackSpotlight.location
  },
  {
    title: "Robotics Innovation Week",
    subtitle: "Prototype, code, and iterate on automation ideas with faculty mentors and IEEE tools.",
    coverImage: "https://res.cloudinary.com/dqmqc0uaa/image/upload/v1728383200/ieee-bubt/events/robotics-showcase.jpg",
    slug: undefined,
    eventDate: fallbackSpotlight.eventDate,
    location: "Labs & Innovation Zone"
  },
  {
    title: "Humanitarian Tech Lab",
    subtitle: "Build resilient solutions tackling real challenges across Bangladesh communities.",
    coverImage: "https://res.cloudinary.com/dqmqc0uaa/image/upload/v1728383200/ieee-bubt/events/hum-tech-lab.jpg",
    slug: undefined,
    eventDate: fallbackSpotlight.eventDate,
    location: "IEEE Makerspace"
  }
];

export const heroStats = [
  { label: "Workshops hosted", value: "40+" },
  { label: "Volunteers active", value: "180" },
  { label: "Industry mentors", value: "25" }
];

