export const SITE = {
  name: "Pasha Archive",
  brandName: "Pasha",
  ownerName: "Muhamad Dwi Pasha",
  identity: "mdpashaaa",
  username: "mdwipasha",
  url: "https://www.mdpashaaa.web.id",
  locale: "en_US",
  language: "en",
  defaultImage: "/favicon.svg",
  description:
    "Pasha Archive is the personal digital archive of Muhamad Dwi Pasha, connecting the identities Pasha, mdpashaaa, and mdwipasha through memories and moments.",
  socials: {
    website: "https://www.mdpashaaa.web.id",
    github: "https://github.com/mdwipasha",
    instagram: "https://www.instagram.com/mdpashaaa",
    linkedin: "https://www.linkedin.com/in/mdwipasha",
  },
} as const;

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE.url}/about#person`,
  name: SITE.ownerName,
  alternateName: [SITE.brandName, SITE.identity, SITE.username],
  url: SITE.url,
  image: new URL(SITE.defaultImage, SITE.url).toString(),
  description:
    "Muhamad Dwi Pasha is an Indonesia-based Web Developer and Digital Analytics QA. Pasha is his personal brand.",
  nationality: {
    "@type": "Country",
    name: "Indonesia",
  },
  jobTitle: ["Web Developer", "Digital Analytics QA"],
  knowsAbout: [
    "Web development",
    "Digital analytics QA",
  ],
  sameAs: [
    SITE.socials.website,
    SITE.socials.github,
    SITE.socials.instagram,
  ],
};

export const getAbsoluteUrl = (path = "/") => new URL(path, SITE.url).toString();
