// Sample answers of GET /api/v1/site/top-chefs and /testimonials, for dev and e2e only (CMS_FIXTURES=1).
// The real site never reads these: it shows what the API sends, or hides the section.
// Sample photos are this site's own images (the API sends absolute URLs); 3 of 5 so the section shows.
const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const topChefsFixture = {
  chefs: [
    {
      id: 1,
      name: "Chef Maria Santos",
      area: "Lahug",
      cuisine: "Filipino classics",
      story: "Cooks her mother's recipes every weekend.",
      image_url: null,
      rating: 4.8,
      reviews: 12,
    },
    {
      id: 2,
      name: "Chef Kenji Tanaka",
      area: "Mandaue",
      cuisine: "Japanese",
      story: "Home-style bento and ramen, made to order.",
      image_url: `${site}/images/about.jpg`,
      rating: 4.6,
      reviews: 7,
    },
    {
      id: 3,
      name: "Chef Priya Sharma",
      area: "Talamban",
      cuisine: "Indian",
      story: null,
      image_url: null,
      rating: null,
      reviews: 0,
    },
    {
      id: 4,
      name: "Chef Isabella Rossi",
      area: "Banilad",
      cuisine: "Italian",
      story: "Fresh pasta rolled by hand on Sundays.",
      image_url: `${site}/images/become-a-chef.jpg`,
      rating: 4.4,
      reviews: 5,
    },
    {
      id: 5,
      name: "Chef Carlos Mendoza",
      area: "Mabolo",
      cuisine: "Mexican",
      story: "Street-style tacos with salsa made the same morning.",
      image_url: `${site}/images/how-it-works-chefs.jpg`,
      rating: 5,
      reviews: 1,
    },
  ],
};

export const testimonialsFixture = {
  testimonials: [
    {
      id: 1,
      text: "Tasted exactly like my lola's pochero. I almost cried at my desk.",
      rating: 5,
      author: "Mae D.",
      chef: "Chef Maria Santos",
      area: "Lahug",
      dish: "Beef pochero",
      created_at: "2026-11-10T08:00:00+00:00",
    },
    {
      id: 2,
      text: "Fresh, hot and on time. The portions were generous too.",
      rating: 4,
      author: "Paolo R.",
      chef: "Chef Kenji Tanaka",
      area: "Mandaue",
      dish: null,
      created_at: "2026-11-09T08:00:00+00:00",
    },
  ],
};
