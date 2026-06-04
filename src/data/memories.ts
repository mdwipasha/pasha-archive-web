export type Person = {
  name: string;
  social?: string;
};

export const people: Record<string, Person> = {
  me: { name: "Me" },
  aril: { name: "Aril", social: "https://instagram.com/aril" },
  family: { name: "Family" },
  friends: { name: "Friends" },
};

export const tags: Record<string, { tag: string }> = {
  travel: { tag: "Travel" },
  photography: { tag: "Photography" },
  music: { tag: "Music" },
  creative: { tag: "Creative" },
  nature: { tag: "Nature" },
  friends: { tag: "Friends" },
};

export type Memory = {
  id: number;
  title: string;
  slug: string;
  description: string;
  year: string;
  era: string;
  location: string;
  image: string;
  tags: string[];
  featured: boolean;

  date?: string;
  people?: Person[];
};

export const memories: Memory[] = [
  {
    id: 1,
    title: "First Camera",
    slug: "first-camera",
    description: "Found in an antique shop in Kyoto. This vintage camera became my gateway to understanding photography.",
    date: "",
    year: "2022",
    era: "Creative Era",
    location: "Kyoto, Japan",
    image: "",
    tags: [tags.travel.tag, tags.photography.tag],
    featured: true,
  },

  {
    id: 2,
    title: "Studio Sessions",
    slug: "studio-sessions",
    description: "Early drafts, late nights, coffee spills. These sessions shaped my creative voice.",
    date: "January 3, 2023",
    year: "2023",
    era: "Creative Era",
    location: "Berlin, Germany",
    image: "",
    tags: [tags.music.tag, tags.creative.tag],
    featured: true,
    people: [people.me],
  },

  {
    id: 3,
    title: "The Long Drive North",
    slug: "long-drive-north",
    description: "A quiet road trip that somehow felt important. The highway stretched endlessly under a pale sky.",
    date: "June 1, 2022",
    year: "2022",
    era: "Travel Era",
    location: "Northern Route",
    image: "",
    tags: [tags.travel.tag],
    featured: true,
    people: [people.me, people.aril],
  },

  {
    id: 4,
    title: "Evening Light Studies",
    slug: "evening-light-studies",
    description: "Exploring how light behaves as it fades. Golden hour photography during a contemplative phase.",
    date: "September 15, 2023",
    year: "2023",
    era: "Exploration Phase",
    location: "Rural Landscape",
    image: "",
    tags: [tags.photography.tag],
    featured: false,
  },

  {
    id: 5,
    title: "Mountain Expedition",
    slug: "mountain-expedition",
    description: "High altitude adventures and the clarity that comes with thin air.",
    date: "April 22, 2021",
    year: "2021",
    era: "Adventure Phase",
    location: "Alps, Switzerland",
    image: "",
    tags: [tags.travel.tag, tags.nature.tag],
    featured: false,
    people: [people.me, people.family],
  },

  {
    id: 6,
    title: "Urban Geometries",
    slug: "urban-geometries",
    description: "Finding patterns and structures in the concrete landscape. Architecture through a photographer's lens.",
    date: "November 8, 2022",
    year: "2022",
    era: "Creative Era",
    location: "Tokyo, Japan",
    image: "",
    tags: [tags.travel.tag, tags.creative.tag],
    featured: false,
    people: [people.me, people.friends],
  },
];
