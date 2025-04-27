import HeaderView from "./header/header.view";
import ContentView from "./content/content.view";
import Footer from "./footer/footer.view";
import { Product } from "./product/products.types";
import SeeAllProductsCtaView from "./see-all-products-cta/see-all-products-cta.view";
import { cache } from "react";
import NavBarView from "./nav-bar/nav-bar.view";
import {generateProductMetadata, metadata} from "./metadata";

// Add caching to the fetch function
const fetchProducts = cache(async () => {
  const SHEET_ID = process.env.SHEET_ID;
  const API_KEY = process.env.SHEET_API_KEY;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);

    const data = await response.json();
    if (data.values) {
      return data.values.slice(1).map((row: string[]) => ({
        name: row[0] || "No name",
        description: row[1] || "No description",
        partnerName: row[2] || "Unknown partner",
        buyLink: row[3] || "Unknown buyLink",
        weird: row[4] || 0,
        useful: row[5] || 0,
        category: row[6] || "Unknown category",
        images: row[8] || "",
      }));
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return [];
  }
});

// Metadata generator function
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ productName?: string }> }) {
  const { productName } = await searchParams || {};

  if (!productName) {
    return metadata;
  }

  const products = await fetchProducts();
  const product = products.find((p: Product) =>
    p.name.toLowerCase().includes(productName.toLowerCase())
  );

  return generateProductMetadata(product);
}

// Main page component
export default async function Page({ searchParams }: { searchParams: Promise<{ productName?: string; page?: string }> }) {
  const products = await fetchProducts();
  const { productName, page: currentPage } = await searchParams;

  const filteredProducts = productName
    ? products.filter((product: Product) =>
        product.name.toLowerCase().includes(productName.toLowerCase())
      )
    : products;

  return (
    <div className="background">
      <NavBarView />
      <HeaderView />
      <ContentView products={filteredProducts} page={currentPage} />
      {productName ? <SeeAllProductsCtaView /> : null}
      <Footer />
    </div>
  );
}
