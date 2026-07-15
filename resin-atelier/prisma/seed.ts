import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // --- Admin user ---
  const adminEmail = (process.env.ADMIN_EMAIL || "imsameena05@gmail.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Studio Admin",
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });
  console.log(`Admin user ready: ${adminEmail}`);

  // --- Demo customer ---
  const demoPasswordHash = await bcrypt.hash("Customer123!", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "priya@example.com" },
    update: {},
    create: {
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "9876543210",
      passwordHash: demoPasswordHash,
      role: "CUSTOMER",
    },
  });

  // --- Reset catalog (this is dev/demo data; clears any stray test orders that reference it) ---
  await prisma.orderItem.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  console.log("Old catalog cleared.");

  // --- Categories ---
  const categoriesData = [
    { name: "Resin Keychains", slug: "keychains", description: "Alphabet and photo keychains, glossy and personalised.", sortOrder: 1, imageUrl: "/products/resin-alphabet-keychain.jpg" },
    { name: "Resin Bookmarks", slug: "bookmarks", description: "Pressed-flower resin bookmarks for book lovers.", sortOrder: 2, imageUrl: "/products/resin-bookmark.jpg" },
    { name: "Name Stands", slug: "name-stands", description: "Personalised resin name stands for desks and shelves.", sortOrder: 3, imageUrl: "/products/resin-name-stand.jpg" },
    { name: "Resin Coasters", slug: "coasters", description: "Photo-frame coasters that double as keepsakes.", sortOrder: 4, imageUrl: "/products/resin-photo-coaster.jpg" },
  ];

  const categories: Record<string, string> = {};
  for (const c of categoriesData) {
    const cat = await prisma.category.create({ data: c });
    categories[c.slug] = cat.id;
  }
  console.log("Categories ready.");

  // --- Products ---
  const productsData = [
    {
      name: "Resin Alphabet Keychain",
      slug: "resin-alphabet-keychain",
      sku: "RA-KC-001",
      categorySlug: "keychains",
      basePrice: 20000,
      stock: 50,
      isFeatured: true,
      shortDescription: "A single resin letter charm, glossy and glitter-flecked.",
      description:
        "Pick your initial or a favourite letter, set in glossy resin with a hint of glitter and finished with a sturdy keyring. A simple, playful everyday keychain.",
      colorOptions: ["Clear", "Blush Pink", "Lavender", "Ivory Gold"],
      allowsPhotoUpload: false,
      materialInfo: "UV-resistant epoxy resin, gold-tone hardware.",
      careInstructions: "Avoid prolonged direct sunlight and contact with water for best longevity.",
    },
    {
      name: "Photo Keychain",
      slug: "photo-keychain",
      sku: "RA-KC-002",
      categorySlug: "keychains",
      basePrice: 30000,
      stock: 40,
      isFeatured: true,
      shortDescription: "Your favourite photo, sealed in a glossy resin keychain.",
      description:
        "Upload a photo and we'll seal it in crystal-clear resin, finished with a gold-tone keyring — a pocket-sized keepsake you can carry everywhere.",
      colorOptions: ["Clear", "Ivory Gold"],
      allowsPhotoUpload: true,
      materialInfo: "UV-resistant epoxy resin, gold-tone hardware.",
      careInstructions: "Avoid prolonged direct sunlight and contact with water for best longevity.",
    },
    {
      name: "Resin Bookmark",
      slug: "resin-bookmark",
      sku: "RA-BM-001",
      categorySlug: "bookmarks",
      basePrice: 25000,
      stock: 45,
      isFeatured: false,
      shortDescription: "Pressed flowers set in a slim resin bookmark.",
      description:
        "A delicate bookmark with real pressed flowers suspended in glossy resin, finished with a tassel. Perfect for readers and gifting alike.",
      colorOptions: ["Clear", "Blush Pink", "Lavender"],
      allowsPhotoUpload: false,
      materialInfo: "UV-resistant epoxy resin, dried botanicals, tassel.",
      careInstructions: "Wipe clean with a soft, dry cloth.",
    },
    {
      name: "Resin Name Stand",
      slug: "resin-name-stand",
      sku: "RA-NS-001",
      categorySlug: "name-stands",
      basePrice: 50000,
      stock: 20,
      isFeatured: true,
      shortDescription: "A personalised resin name plate for your desk or shelf.",
      description:
        "Your name or a short word, hand-set in resin on a freestanding stand — a polished addition to any desk, shelf or wedding table setting.",
      colorOptions: ["Clear", "Ivory Gold", "Blush Pink", "Lavender"],
      allowsPhotoUpload: false,
      materialInfo: "UV-resistant epoxy resin, weighted freestanding base.",
      careInstructions: "Dust gently with a dry, soft cloth.",
    },
    {
      name: "Resin Photo Coaster",
      slug: "resin-photo-coaster",
      sku: "RA-CS-001",
      categorySlug: "coasters",
      basePrice: 80000,
      stock: 15,
      isFeatured: true,
      shortDescription: "A resin coaster that doubles as a mini photo frame.",
      description:
        "Your favourite photo, layered beneath glossy resin in a coaster you'll actually want to use — practical, personal, and beautifully finished.",
      colorOptions: ["Clear", "Ivory Gold", "Lavender"],
      allowsPhotoUpload: true,
      materialInfo: "UV-resistant epoxy resin, cork base.",
      careInstructions: "Wipe clean with a soft, dry cloth; avoid soaking in water.",
    },
  ];

  for (const p of productsData) {
    const { categorySlug, ...rest } = p;
    const imageUrl = `/products/${p.slug}.jpg`;
    await prisma.product.create({
      data: {
        ...rest,
        categoryId: categories[categorySlug],
        images: { create: [{ url: imageUrl, alt: p.name, sortOrder: 0 }] },
      },
    });
  }
  console.log(`${productsData.length} products ready.`);

  // --- Testimonials ---
  const testimonials = [
    { name: "Ananya R.", message: "The alphabet keychain I ordered for my sister was even more beautiful in person. Packaging was so thoughtful too!", rating: 5 },
    { name: "Rahul M.", message: "Got a name stand made for my work desk — the finish is stunning and it arrived so well packed.", rating: 5 },
    { name: "Sneha K.", message: "The photo keychain turned out exactly like the picture I sent. Fast shipping too, will order again for gifts.", rating: 5 },
    { name: "Vikram S.", message: "Ordered a set of photo coasters as a housewarming gift — everyone asked where I got them from.", rating: 4 },
    { name: "Meera T.", message: "Such a lovely small business! The resin bookmark is gorgeous and the quality feels premium.", rating: 5 },
    { name: "Arjun P.", message: "Customised a couple of alphabet keychains for my parents — they loved them.", rating: 5 },
  ];
  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name, message: t.message } });
    if (!existing) {
      await prisma.testimonial.create({ data: { ...t, userId: t.name === "Ananya R." ? demoUser.id : undefined, isApproved: true } });
    }
  }
  console.log("Testimonials ready.");

  // --- Gallery ---
  const galleryCaptions = [
    "Fresh resin pour, just set",
    "Glitter shelf in the studio",
    "Today's finished keychains",
    "Wrapped and ready to ship",
    "Mixing pigments this morning",
    "A little coaster set in progress",
  ];
  await prisma.galleryImage.deleteMany({});
  await prisma.galleryImage.createMany({
    data: galleryCaptions.map((caption, i) => ({
      imageUrl: `/gallery/gallery-${i + 1}.jpg`,
      caption,
      sortOrder: i,
    })),
  });
  console.log("Gallery ready.");

  // --- FAQs ---
  await prisma.fAQItem.deleteMany({});
  await prisma.fAQItem.createMany({
    data: [
      {
        question: "How long does it take to make and ship my order?",
        answer: "Every piece is made to order. Crafting typically takes 3–5 business days, plus shipping time of 2–6 days depending on your location.",
        sortOrder: 1,
      },
      {
        question: "Can I customize the color and glitter for my piece?",
        answer: "Yes! Most products let you choose a resin color and glitter finish, plus add a custom name or short message during checkout.",
        sortOrder: 2,
      },
      {
        question: "How do I upload a photo for a photo keychain or coaster order?",
        answer: "On the product page, use the 'Upload Photo' option in the customization section. Accepted formats are JPG, PNG and WEBP, up to 5MB.",
        sortOrder: 3,
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept UPI payments only, right now. At checkout, scan the QR code or pay directly to our UPI ID, then share your transaction reference so we can confirm your order quickly.",
        sortOrder: 4,
      },
      {
        question: "Do you offer bulk or corporate gifting orders?",
        answer: "Yes, we love bulk and corporate orders! Reach out via our Contact page or WhatsApp for a custom quote.",
        sortOrder: 5,
      },
      {
        question: "How should I care for my resin piece?",
        answer: "Keep it away from prolonged direct sunlight and excess moisture, and wipe gently with a soft, dry cloth to maintain its shine.",
        sortOrder: 6,
      },
    ],
  });
  console.log("FAQs ready.");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
