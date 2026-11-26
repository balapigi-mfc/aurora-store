import { NextResponse } from "next/server";
import { getProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() ?? "";
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");

  let products = await getProducts();

  if (query) {
    products = products.filter((product) =>
      [product.name, product.tagline, product.description, product.category]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }

  if (category) {
    products = products.filter((product) => product.category === category);
  }

  if (sort === "price-asc") {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    products.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    products.sort((a, b) => b.rating - a.rating);
  } else if (sort === "new") {
    products.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  return NextResponse.json({ products, count: products.length });
}
