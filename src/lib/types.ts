export type CategoryId =
  | "audio"
  | "wearables"
  | "workspace"
  | "accessories"
  | "home";

export interface Category {
  id: CategoryId;
  name: string;
  blurb: string;
  image: string;
}

export interface Spec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: CategoryId;
  price: number;
  compareAt?: number;
  images: string[];
  colors: string[];
  specs: Spec[];
  rating: number;
  reviewCount: number;
  stock: number;
  badge?: string;
  featured?: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  productSlug: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  date: string;
}

export interface CartItem {
  slug: string;
  name: string;
  price: number;
  image: string;
  color: string;
  qty: number;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderLine {
  slug: string;
  name: string;
  price: number;
  qty: number;
  color: string;
  image: string;
}

export interface Address {
  fullName: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
}

export interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface Order {
  id: string;
  number: string;
  userId: string | null;
  email: string;
  items: OrderLine[];
  address: Address;
  coupon: string | null;
  totals: Totals;
  status: OrderStatus;
  createdAt: string;
  note?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "customer" | "admin";
  createdAt: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
}
