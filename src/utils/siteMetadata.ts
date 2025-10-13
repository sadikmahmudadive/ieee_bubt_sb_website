const fallbackBaseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const siteMetadata = {
  title: "IEEE BUBT Student Branch",
  shortTitle: "IEEE BUBT SB",
  description:
    "Official website for the IEEE Bangladesh University of Business and Technology Student Branch showcasing events, volunteers, and achievements.",
  baseUrl: fallbackBaseUrl,
  social: {
    facebook: "https://www.facebook.com/IEEEBUBTSB",
    instagram: "https://www.instagram.com/ieeebubtsb",
    linkedin: "https://www.linkedin.com/company/ieee-bubt-student-branch",
    twitter: "@ieeebubtsb",
    email: "ieee@bubt.edu.bd"
  },
  contact: {
    phone: "+8801XXXXXXXXX",
    address: "Bangladesh University of Business and Technology, Dhaka, Bangladesh"
  }
};
