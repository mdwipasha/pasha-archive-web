export type Person = {
  name: string;
  social?: string;
};

export const people: Record<string, Person> = {
  me: { name: "Me" },
  aril: { name: "Aril", social: "https://instagram.com/aril" },
  ajay: { name: "Ajay" },
  api: { name: "Api" },
  putra: { name: "Putra" },
  juli: { name: "Juli", social: "https://www.instagram.com/_julsyah" },
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
  childhood: { tag: "Childhood" },
  school: { tag: "School" },
};

export type Memory = {
  id: number;
  title: string;
  slug: string;
  type: "photo" | "video";
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
// ╔══════════════════════════════════════╗
// ║               YEAR 2017              ║
// ╚══════════════════════════════════════╝
  {
    id: 1,
    title: "Untitled",
    slug: "untitled-1",
    type: "photo",
    description: "Gw yang baju ijoo.",
    date: "",
    year: "2017",
    era: "",
    location: "Bogor, Indonesia",
    image: "https://ik.imagekit.io/pashaarchive/Pasha%20Archive/2017/1.jpg?updatedAt=1780558867957",
    tags: [tags.friends.tag, tags.childhood.tag],
    featured: false,
    people: [people.me, people.ajay, people.api, people.putra],
  },

  {
    id: 2,
    title: "Untitled",
    slug: "untitled-2",
    type: "photo",
    description: "Gw yang baju ijo paling kanan.",
    date: "",
    year: "2017",
    era: "",
    location: "Bogor, Indonesia",
    image: "https://ik.imagekit.io/pashaarchive/Pasha%20Archive/2017/2.jpg?updatedAt=1780558878876",
    tags: [tags.friends.tag, tags.childhood.tag],
    featured: false,
    people: [people.me, people.juli, people.ajay, people.putra],
  },

  {
    id: 3,
    title: "Untitled",
    slug: "untitled-3",
    type: "photo",
    description: "Gw yang baju ijo kedua dari paling belakang.",
    date: "",
    year: "2017",
    era: "",
    location: "Bogor, Indonesia",
    image: "https://ik.imagekit.io/pashaarchive/Pasha%20Archive/2017/3.jpg?updatedAt=1780558889119",
    tags: [tags.friends.tag, tags.childhood.tag],
    featured: false,
    people: [people.me, people.ajay, people.api, people.juli, people.putra],
  },

  {
    id: 4,
    title: "Untitled",
    slug: "untitled-4",
    type: "photo",
    description: "Gw yang baju ijo center of the world.",
    date: "",
    year: "2017",
    era: "",
    location: "Bogor, Indonesia",
    image: "https://ik.imagekit.io/pashaarchive/Pasha%20Archive/2017/4.jpg?updatedAt=1780558904390",
    tags: [tags.friends.tag, tags.childhood.tag],
    featured: false,
    people: [people.me, people.putra, people.ajay, people.api, people.juli],
  },

  {
    id: 5,
    title: "Untitled",
    slug: "untitled-5",
    type: "photo",
    description: "Gw yang baju ijo arah jam 10.30.",
    date: "",
    year: "2017",
    era: "",
    location: "Bogor, Indonesia",
    image: "https://ik.imagekit.io/pashaarchive/Pasha%20Archive/2017/5.jpg?updatedAt=1780558914420",
    tags: [tags.friends.tag, tags.childhood.tag],
    featured: false,
    people: [people.me, people.putra, people.ajay, people.juli, people.api],
  },

  // ╔══════════════════════════════════════╗
  // ║               YEAR 2015              ║
  // ╚══════════════════════════════════════╝ 

  {
    id: 6,
    title: "Untitled",
    slug: "Untitled-6",
    type: "photo",
    description: "udah keren dari kecil.",
    date: "",
    year: "2015",
    era: "",
    location: "Bogor, Indonesia",
    image: "https://ik.imagekit.io/pashaarchive/Pasha%20Archive/2015/2.jpg",
    tags: [tags.childhood.tag],
    featured: true,
    people: [people.me],
  },

  {
    id: 7,
    title: "Untitled",
    slug: "Untitled-7",
    type: "photo",
    description: "aku suka timnas.",
    date: "",
    year: "2015",
    era: "",
    location: "Bogor, Indonesia",
    image: "https://ik.imagekit.io/pashaarchive/Pasha%20Archive/2015/1.jpg",
    tags: [tags.childhood.tag],
    featured: true,
    people: [people.me],
  },

  // ╔══════════════════════════════════════╗
  // ║         YEAR 2018 - 2019             ║
  // ╚══════════════════════════════════════╝ 

   {
    id: 8,
    title: "Untitled",
    slug: "Untitled-8",
    type: "photo",
    description: "aku kedua dari sebelah kiri abis jadi penari yamko rambe yamko.",
    date: "",
    year: "2019",
    era: "",
    location: "Bogor, Indonesia",
    image: "https://ik.imagekit.io/pashaarchive/Pasha%20Archive/2019/1.jpg",
    tags: [tags.school.tag, tags.friends.tag],
    featured: true,
    people: [people.me, people.friends],
  },

  {
    id: 9,
    title: "botak",
    slug: "botak-part1",
    type: "video",
    description: "botakkkk.",
    date: "",
    year: "2025",
    era: "",
    location: "Bogor, Indonesia",
    image: "/botakk.mp4",
    tags: [tags.school.tag, tags.friends.tag],
    featured: true,
    people: [people.me, people.juli, people.ajay, people.juli, people.api],
  },

];
