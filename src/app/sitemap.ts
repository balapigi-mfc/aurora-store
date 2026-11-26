import type { MetadataRoute } from "next";
import { products } from "@/data/products";

const base = "https://aurora-store.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/products", "/about", "/contact"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    priority: path === "" ? 1 : 0.7,
  }));

  const productPages = products.map((product) => ({
    url: `${base}/products/${product.slug}`,
    lastModified: new Date(product.createdAt),
    priority: 0.8,
  }));

  return [...pages, ...productPages];
}
