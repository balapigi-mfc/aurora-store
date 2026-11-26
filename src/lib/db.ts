import { promises as fs } from "fs";
import path from "path";
import type { Order, OrderLine, Product, User } from "@/lib/types";
import { hashPassword } from "@/lib/password";

export interface DbShape {
  users: User[];
  orders: Order[];
  subscribers: string[];
  productOverrides: Record<string, Partial<Product>>;
  customProducts: Product[];
  deletedProducts: string[];
  stockUsed: Record<string, number>;
  messages: Message[];
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  createdAt: string;
}

const DB_PATH = path.join(process.cwd(), "data", "db.json");

const seedUsers: User[] = [
  {
    id: "u_admin",
    name: "Aurora Studio",
    email: "admin@aurora.store",
    passwordHash: hashPassword("aurora123"),
    role: "admin",
    createdAt: "2026-01-04T09:00:00.000Z",
  },
  {
    id: "u_demo",
    name: "Farhan Miraj",
    email: "hello@aurora.store",
    passwordHash: hashPassword("aurora123"),
    role: "customer",
    createdAt: "2026-02-18T11:24:00.000Z",
  },
];

const seedOrders: Order[] = [
  {
    id: "ord_seed_1",
    number: "AUR-2611-1042",
    userId: "u_demo",
    email: "hello@aurora.store",
    items: [
      {
        slug: "halo-wireless-headphones",
        name: "Halo Wireless Headphones",
        price: 289,
        qty: 1,
        color: "Sand",
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
      },
      {
        slug: "terra-ceramic-mug",
        name: "Terra Ceramic Mug",
        price: 32,
        qty: 2,
        color: "Oatmeal",
        image:
          "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    address: {
      fullName: "Farhan Miraj",
      email: "hello@aurora.store",
      phone: "+81 90 1234 5678",
      line1: "2-11-3 Ebisu",
      line2: "Shibuya-ku",
      city: "Tokyo",
      postcode: "150-0013",
      country: "Japan",
    },
    coupon: null,
    totals: {
      subtotal: 353,
      discount: 0,
      shipping: 0,
      tax: 28.24,
      total: 381.24,
    },
    status: "shipped",
    createdAt: "2026-11-18T04:12:00.000Z",
  },
  {
    id: "ord_seed_2",
    number: "AUR-2611-1039",
    userId: null,
    email: "nadia@example.com",
    items: [
      {
        slug: "form-65-keyboard",
        name: "Form 65 Keyboard",
        price: 189,
        qty: 1,
        color: "Slate",
        image:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    address: {
      fullName: "Nadia Rahman",
      email: "nadia@example.com",
      phone: "+44 7700 900123",
      line1: "14 Cheshire Street",
      city: "London",
      postcode: "E2 6EH",
      country: "United Kingdom",
    },
    coupon: "SAVE10",
    totals: {
      subtotal: 189,
      discount: 18.9,
      shipping: 0,
      tax: 13.61,
      total: 183.71,
    },
    status: "delivered",
    createdAt: "2026-11-11T15:47:00.000Z",
  },
  {
    id: "ord_seed_3",
    number: "AUR-2611-1051",
    userId: null,
    email: "jules@example.com",
    items: [
      {
        slug: "field-day-backpack",
        name: "Field Day Backpack",
        price: 165,
        qty: 1,
        color: "Tobacco",
        image:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
      },
      {
        slug: "daylight-sunglasses",
        name: "Daylight Sunglasses",
        price: 135,
        qty: 1,
        color: "Honey",
        image:
          "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    address: {
      fullName: "Jules Moreau",
      email: "jules@example.com",
      phone: "+33 6 12 34 56 78",
      line1: "8 Rue de Charonne",
      city: "Paris",
      postcode: "75011",
      country: "France",
    },
    coupon: null,
    totals: {
      subtotal: 300,
      discount: 0,
      shipping: 0,
      tax: 24,
      total: 324,
    },
    status: "paid",
    createdAt: "2026-11-24T08:03:00.000Z",
  },
  {
    id: "ord_seed_4",
    number: "AUR-2611-1054",
    userId: "u_demo",
    email: "hello@aurora.store",
    items: [
      {
        slug: "echo-wireless-earbuds",
        name: "Echo Earbuds",
        price: 159,
        qty: 1,
        color: "Chalk",
        image:
          "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    address: {
      fullName: "Farhan Miraj",
      email: "hello@aurora.store",
      phone: "+81 90 1234 5678",
      line1: "2-11-3 Ebisu",
      line2: "Shibuya-ku",
      city: "Tokyo",
      postcode: "150-0013",
      country: "Japan",
    },
    coupon: null,
    totals: {
      subtotal: 159,
      discount: 0,
      shipping: 0,
      tax: 12.72,
      total: 171.72,
    },
    status: "pending",
    createdAt: "2026-11-25T22:31:00.000Z",
  },
];


const demoCustomers = [
  ["Emma Fischer", "emma@example.com", "Berlin", "Germany", "+49 30 1234 5678", "Torstraße 118", "10119"],
  ["Ravi Patel", "ravi@example.com", "Mumbai", "India", "+91 22 2345 6789", "14 Bandra West", "400050"],
  ["Sofia Rossi", "sofia@example.com", "Milan", "Italy", "+39 02 8765 4321", "Via Tortona 27", "20144"],
  ["Kenji Watanabe", "kenji@example.com", "Osaka", "Japan", "+81 6 1234 5678", "2-4-9 Umeda", "530-0001"],
  ["Lucy Chen", "lucy@example.com", "Singapore", "Singapore", "+65 6123 4567", "8 Marina View", "018960"],
  ["Owen Brooks", "owen@example.com", "Austin", "United States", "+1 512 555 0134", "1104 E 6th St", "78702"],
  ["Amara Diallo", "amara@example.com", "Paris", "France", "+33 1 23 45 67 89", "22 Rue Oberkampf", "75011"],
  ["Noah Berg", "noah@example.com", "Stockholm", "Sweden", "+46 8 123 456", "Hornsgatan 42", "118 20"],
  ["Hana Suzuki", "hana@example.com", "Tokyo", "Japan", "+81 3 9876 5432", "1-2-3 Daikanyama", "150-0034"],
  ["Marco Silva", "marco@example.com", "Lisbon", "Portugal", "+351 21 123 4567", "Rua da Boavista 40", "1200-068"],
  ["Ivy Nguyen", "ivy@example.com", "Melbourne", "Australia", "+61 3 9123 4567", "18 Gertrude St", "3065"],
  ["Adam Kowalski", "adam@example.com", "Warsaw", "Poland", "+48 22 123 45 67", "ul. Mokotowska 12", "00-561"],
];

const demoCatalog = [
  ["halo-wireless-headphones", "Halo Wireless Headphones", 289, "Sand", "photo-1505740420928-5e560c06d30e"],
  ["orbit-smartwatch", "Orbit Smartwatch", 219, "Steel", "photo-1523275335684-37898b6baf30"],
  ["drift-runner", "Drift Runner", 148, "Ember", "photo-1542291026-7eec264c27ff"],
  ["field-day-backpack", "Field Day Backpack", 165, "Tobacco", "photo-1553062407-98eeb64c6a62"],
  ["form-65-keyboard", "Form 65 Keyboard", 189, "Chalk", "photo-1587829741301-dc798b83add3"],
  ["terra-ceramic-mug", "Terra Ceramic Mug", 32, "Oatmeal", "photo-1514228742587-6b1558fcca3d"],
  ["daylight-sunglasses", "Daylight Sunglasses", 135, "Honey", "photo-1511499767150-a48a237f0083"],
  ["echo-wireless-earbuds", "Echo Earbuds", 159, "Chalk", "photo-1590658268037-6bf12165a8df"],
  ["frame-35-camera", "Frame 35 Camera", 640, "Black", "photo-1516035069371-29a1b244cc32"],
];

const demoStatuses: Order["status"][] = [
  "delivered", "delivered", "shipped", "paid", "packed",
  "delivered", "shipped", "paid", "delivered", "packed", "paid", "delivered",
];

function demoOrders(): Order[] {
  const today = new Date("2026-11-26T10:00:00.000Z");
  return demoCustomers.map((customer, index) => {
    const [name, email, city, country, phone, line1, postcode] = customer;
    const created = new Date(today);
    created.setDate(today.getDate() - (index * 2 + 1));
    created.setHours(9 + (index % 8), (index * 7) % 60, 0, 0);

    const first = demoCatalog[index % demoCatalog.length];
    const second = demoCatalog[(index + 4) % demoCatalog.length];
    const useSecond = index % 3 === 0 && second[0] !== first[0];

    const lines: OrderLine[] = [first, ...(useSecond ? [second] : [])].map((entry) => ({
      slug: entry[0] as string,
      name: entry[1] as string,
      price: entry[2] as number,
      qty: 1,
      color: entry[3] as string,
      image: `https://images.unsplash.com/${entry[4]}?auto=format&fit=crop&w=1200&q=80`,
    }));

    const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
    const shipping = subtotal >= 120 ? 0 : 9;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;

    return {
      id: `ord_demo_${index + 1}`,
      number: `AUR-2610-${900 + index}`,
      userId: null,
      email,
      items: lines,
      address: {
        fullName: name,
        email,
        phone,
        line1,
        city,
        postcode,
        country,
      },
      coupon: null,
      totals: {
        subtotal,
        discount: 0,
        shipping,
        tax,
        total: Math.round((subtotal + shipping + tax) * 100) / 100,
      },
      status: demoStatuses[index],
      createdAt: created.toISOString(),
    };
  });
}

function seed(): DbShape {
  return {
    users: seedUsers,
    orders: [...seedOrders, ...demoOrders()],
    subscribers: [],
    productOverrides: {},
    customProducts: [],
    deletedProducts: [],
    stockUsed: {},
    messages: [],
  };
}

let cache: DbShape | null = null;

export async function readDb(): Promise<DbShape> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<DbShape>;
    cache = { ...seed(), ...parsed, users: parsed.users ?? seedUsers };
    return cache;
  } catch {
    const fresh = seed();
    await writeDb(fresh);
    return fresh;
  }
}

export async function writeDb(db: DbShape): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  const temp = `${DB_PATH}.${process.pid}.tmp`;
  await fs.writeFile(temp, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(temp, DB_PATH);
  cache = db;
}

export async function updateDb(
  mutator: (db: DbShape) => void | Promise<void>,
): Promise<DbShape> {
  const db = await readDb();
  await mutator(db);
  await writeDb(db);
  return db;
}

export async function nextOrderNumber(): Promise<string> {
  const db = await readDb();
  const now = new Date();
  const prefix = `AUR-${String(now.getFullYear()).slice(2)}${String(
    now.getMonth() + 1,
  ).padStart(2, "0")}`;
  const sequence =
    1030 +
    db.orders.filter((order) => order.number.startsWith(prefix)).length +
    1;
  return `${prefix}-${sequence}`;
}
