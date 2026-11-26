import type { Category, Product } from "@/lib/types";

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const HEADPHONES = "photo-1505740420928-5e560c06d30e";
const HEADPHONES_ALT = "photo-1546435770-a3e426bf472b";
const WATCH = "photo-1523275335684-37898b6baf30";
const SNEAKER = "photo-1542291026-7eec264c27ff";
const BACKPACK = "photo-1553062407-98eeb64c6a62";
const KEYBOARD = "photo-1587829741301-dc798b83add3";
const MUG = "photo-1514228742587-6b1558fcca3d";
const LAPTOP = "photo-1496181133206-80ce9b88a853";
const CAMERA = "photo-1516035069371-29a1b244cc32";
const SUNGLASSES = "photo-1511499767150-a48a237f0083";
const EARBUDS = "photo-1590658268037-6bf12165a8df";

export const categories: Category[] = [
  {
    id: "audio",
    name: "Audio",
    blurb: "Headphones and earbuds tuned for long listening.",
    image: img(HEADPHONES, 900),
  },
  {
    id: "wearables",
    name: "Wearables",
    blurb: "Watches and trainers for the everyday commute.",
    image: img(WATCH, 900),
  },
  {
    id: "workspace",
    name: "Workspace",
    blurb: "Desks, keys and screens that earn their space.",
    image: img(KEYBOARD, 900),
  },
  {
    id: "accessories",
    name: "Accessories",
    blurb: "Carry, shade and capture — built to be repaired.",
    image: img(BACKPACK, 900),
  },
  {
    id: "home",
    name: "Home",
    blurb: "Quiet objects for the kitchen and the table.",
    image: img(MUG, 900),
  },
];

export const products: Product[] = [
  {
    id: "p_halo",
    slug: "halo-wireless-headphones",
    name: "Halo Wireless Headphones",
    tagline: "Adaptive noise cancelling with memory-foam calm.",
    description:
      "Halo pairs a bio-cellulose driver with adaptive cancellation that reads the room four hundred times a second, so the world fades without the pressure you feel from cheaper ANC. The headband is wrapped in vegetable-tanned leather that softens with wear, and every hinge is serviceable — we ship replacement pads and batteries for a decade.",
    category: "audio",
    price: 289,
    compareAt: 349,
    images: [img(HEADPHONES), img(HEADPHONES_ALT)],
    colors: ["Sand", "Graphite", "Clay"],
    specs: [
      { label: "Driver", value: "40 mm bio-cellulose" },
      { label: "Battery", value: "38 hours, 5 min quick charge" },
      { label: "Weight", value: "248 g" },
      { label: "Connectivity", value: "Bluetooth 5.3, USB-C, 3.5 mm" },
      { label: "Warranty", value: "3 years, parts included" },
    ],
    rating: 4.8,
    reviewCount: 214,
    stock: 18,
    badge: "Bestseller",
    featured: true,
    createdAt: "2026-08-14",
  },
  {
    id: "p_orbit",
    slug: "orbit-smartwatch",
    name: "Orbit Smartwatch",
    tagline: "A quiet computer for your wrist.",
    description:
      "Orbit shows you one thing at a time: the time, your next train, the tide. A sapphire crystal sits over a transflective display that gets sharper in sunlight, and the titanium case is rated to 100 m. Nine-day battery, no app store, no notifications you did not ask for.",
    category: "wearables",
    price: 219,
    compareAt: 259,
    images: [img(WATCH)],
    colors: ["Steel", "Black", "Tan leather"],
    specs: [
      { label: "Case", value: "38 mm brushed titanium" },
      { label: "Glass", value: "Sapphire crystal" },
      { label: "Battery", value: "9 days typical use" },
      { label: "Water resistance", value: "10 ATM" },
      { label: "Straps", value: "Quick-release 20 mm" },
    ],
    rating: 4.6,
    reviewCount: 132,
    stock: 24,
    badge: "Editor's pick",
    featured: true,
    createdAt: "2026-07-02",
  },
  {
    id: "p_frame",
    slug: "frame-35-camera",
    name: "Frame 35 Camera",
    tagline: "A compact 35 mm camera, rebuilt for 2026.",
    description:
      "Frame keeps the ritual of film without the guesswork. A fixed 35 mm f/2 lens, a bright viewfinder and a meter that reads light in real time, wrapped in a magnesium body that weighs less than a paperback. Drop it in a bag, take it to dinner, develop the roll next week.",
    category: "accessories",
    price: 640,
    images: [img(CAMERA)],
    colors: ["Black", "Silver"],
    specs: [
      { label: "Lens", value: "35 mm f/2, fixed" },
      { label: "Format", value: "35 mm film, 24 × 36" },
      { label: "Body", value: "Magnesium alloy, 412 g" },
      { label: "Shutter", value: "1/2000 – 8 s, mechanical" },
      { label: "Metering", value: "Centre-weighted, ±2 EV" },
    ],
    rating: 4.9,
    reviewCount: 76,
    stock: 8,
    badge: "New",
    featured: true,
    createdAt: "2026-10-21",
  },
  {
    id: "p_drift",
    slug: "drift-runner",
    name: "Drift Runner",
    tagline: "Everyday trainers with a recycled knit upper.",
    description:
      "Drift is built for the walk between train and office, not the marathon. A recycled knit upper breathes in summer and layers under a coat in winter, while the cork-blend midsole moulds to your foot after a fortnight. Resoleable, and the knit is machine washable.",
    category: "wearables",
    price: 148,
    images: [img(SNEAKER)],
    colors: ["Ember", "Bone", "Olive"],
    specs: [
      { label: "Upper", value: "Recycled knit, 62% post-consumer" },
      { label: "Midsole", value: "Cork blend, 18 mm stack" },
      { label: "Outsole", value: "Natural rubber, 4 mm lugs" },
      { label: "Weight", value: "268 g (UK 8)" },
      { label: "Care", value: "Machine wash cold" },
    ],
    rating: 4.5,
    reviewCount: 318,
    stock: 42,
    createdAt: "2026-05-19",
  },
  {
    id: "p_field",
    slug: "field-day-backpack",
    name: "Field Day Backpack",
    tagline: "A 22-litre daypack that ages honestly.",
    description:
      "Waxed canvas, solid brass hardware and a padded 16-inch sleeve — the Field Day is the bag you stop thinking about. The roll top expands to 26 litres for a market run, and the leather base takes scuffs the way good boots do. Every strap is replaceable.",
    category: "accessories",
    price: 165,
    images: [img(BACKPACK)],
    colors: ["Tobacco", "Charcoal"],
    specs: [
      { label: "Volume", value: "22 L, expands to 26 L" },
      { label: "Fabric", value: "18 oz waxed canvas" },
      { label: "Laptop", value: "Fits up to 16 inch" },
      { label: "Hardware", value: "Solid brass" },
      { label: "Weight", value: "980 g" },
    ],
    rating: 4.7,
    reviewCount: 189,
    stock: 12,
    featured: true,
    createdAt: "2026-06-11",
  },
  {
    id: "p_form",
    slug: "form-65-keyboard",
    name: "Form 65 Keyboard",
    tagline: "A gasket-mounted 65% board, tuned by hand.",
    description:
      "Form is assembled in batches of fifty, each one lubed and filmed before it leaves the bench. The aluminium case sits on silicone gaskets for a soft, low-pitched typing feel, and the PCB is hot-swap so you can change switches without a soldering iron. Wired and Bluetooth, with a 4,000 mAh cell.",
    category: "workspace",
    price: 189,
    compareAt: 220,
    images: [img(KEYBOARD)],
    colors: ["Chalk", "Slate", "Olive"],
    specs: [
      { label: "Layout", value: "65%, 68 keys" },
      { label: "Case", value: "CNC aluminium, 1.4 kg" },
      { label: "Mount", value: "Silicone gasket" },
      { label: "Switches", value: "Hot-swap, 5-pin" },
      { label: "Battery", value: "4,000 mAh, USB-C" },
    ],
    rating: 4.9,
    reviewCount: 402,
    stock: 30,
    badge: "Bestseller",
    featured: true,
    createdAt: "2026-09-03",
  },
  {
    id: "p_atlas",
    slug: "atlas-14-laptop",
    name: "Atlas 14",
    tagline: "A repairable 14-inch notebook for real work.",
    description:
      "Atlas is a laptop you can open with a single screwdriver. Memory and storage are socketed, the battery is held by four screws, and we publish a service manual for every revision. A 14-inch 2.8K matte panel, 16 hours of battery and a keyboard with 1.5 mm of travel.",
    category: "workspace",
    price: 1290,
    images: [img(LAPTOP)],
    colors: ["Silver", "Graphite"],
    specs: [
      { label: "Display", value: "14 inch 2.8K matte, 120 Hz" },
      { label: "Memory", value: "16 GB, 2 sockets" },
      { label: "Storage", value: "512 GB NVMe, user replaceable" },
      { label: "Battery", value: "16 hours light use" },
      { label: "Ports", value: "2× USB-C, 2× USB-A, HDMI, SD" },
    ],
    rating: 4.4,
    reviewCount: 58,
    stock: 6,
    createdAt: "2026-10-02",
  },
  {
    id: "p_terra",
    slug: "terra-ceramic-mug",
    name: "Terra Ceramic Mug",
    tagline: "Thrown by hand, glazed in oatmeal.",
    description:
      "Each Terra mug is thrown on a wheel in a two-person studio outside Kyoto, so no two are identical. The clay body holds heat for a surprising length of time and the wide lip is shaped for a proper sip. Dishwasher safe, though we like it better washed by hand.",
    category: "home",
    price: 32,
    images: [img(MUG)],
    colors: ["Oatmeal", "Ash", "Ink"],
    specs: [
      { label: "Volume", value: "340 ml" },
      { label: "Material", value: "Stoneware, food-safe glaze" },
      { label: "Dimensions", value: "9 × 8.5 cm" },
      { label: "Care", value: "Dishwasher and microwave safe" },
      { label: "Origin", value: "Made in Shiga, Japan" },
    ],
    rating: 4.8,
    reviewCount: 511,
    stock: 120,
    createdAt: "2026-03-27",
  },
  {
    id: "p_daylight",
    slug: "daylight-sunglasses",
    name: "Daylight Sunglasses",
    tagline: "Acetate frames with mineral glass lenses.",
    description:
      "Cut from Italian acetate and finished by hand over five days, Daylight uses mineral glass lenses with a warm brown tint that keeps colours honest. The hinge is a riveted five-barrel, and the temples are adjustable with a hairdryer — the way opticians used to do it.",
    category: "accessories",
    price: 135,
    images: [img(SUNGLASSES)],
    colors: ["Honey", "Black", "Smoke"],
    specs: [
      { label: "Frame", value: "Italian acetate" },
      { label: "Lens", value: "Mineral glass, category 3" },
      { label: "Protection", value: "100% UVA / UVB" },
      { label: "Width", value: "142 mm total" },
      { label: "Includes", value: "Leather case, cloth" },
    ],
    rating: 4.6,
    reviewCount: 97,
    stock: 25,
    createdAt: "2026-04-08",
  },
  {
    id: "p_echo",
    slug: "echo-wireless-earbuds",
    name: "Echo Earbuds",
    tagline: "Small buds, twelve hours a charge.",
    description:
      "Echo is our smallest product and the one we argue about most. A single balanced-armature driver keeps the shell at 4.1 grams, the case charges over USB-C or any Qi pad, and a physical button means no accidental pauses when you adjust the fit. Four sizes of memory foam tips included.",
    category: "audio",
    price: 159,
    images: [img(EARBUDS)],
    colors: ["Chalk", "Graphite"],
    specs: [
      { label: "Driver", value: "Balanced armature" },
      { label: "Battery", value: "12 h buds, 36 h case" },
      { label: "Weight", value: "4.1 g per bud" },
      { label: "Charging", value: "USB-C, Qi wireless" },
      { label: "Rating", value: "IPX5 sweat resistant" },
    ],
    rating: 4.3,
    reviewCount: 168,
    stock: 40,
    badge: "New",
    createdAt: "2026-11-05",
  },
];

export function getCategory(id: string): Category | undefined {
  return categories.find((category) => category.id === id);
}
