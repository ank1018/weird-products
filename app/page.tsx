import HeaderView from "./header/header.view";
import ContentView from "./content/content.view";
import Footer from "./footer/footer.view";
import {Product} from "./product/products.types";
import SeeAllProductsCtaView from "./see-all-products-cta/see-all-products-cta.view";
import {Metadata} from "next";

import { cache } from 'react';

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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            return data.values.slice(1).map(row => ({
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
export async function generateMetadata({
                                           searchParams
                                       }: {
    searchParams: { productName?: string, page?: string }
}): Promise<Metadata> {
    const { productName } = await searchParams

    // If no product name is specified, return default metadata
    if (!productName) {
        return {}; // This will use the layout metadata as fallback
    }

    // Use the cached fetch function
    const products = await fetchProducts();

    // Find the product that matches the name
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const product = products.find(p =>
        p.name.toLowerCase().includes(productName.toLowerCase())
    );

    if (product) {
        // Parse image URLs
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const imageUrls = product.images ? product.images.split(',').map(url => url.trim()) : [];
        const firstImageUrl = imageUrls.length > 0 ? imageUrls[0].replace(/^"|"$/g, '') : 'https://www.wackyorwise.com/images/wow-logo.png';

        // Return product-specific metadata
        return {
            title: `${product.name} - Wacky or Wise`,
            description: product.description,
            openGraph: {
                title: `${product.name} - Wacky or Wise`,
                description: product.description,
                images: [
                    {
                        url: firstImageUrl,
                        width: 800,
                        height: 600,
                        alt: product.name,
                    },
                ],
            },
        };
    }

    return {}; // Fallback to layout metadata
}

// Main page component
export default async function Page({
                                       searchParams
                                   }: {
    searchParams: { productName?: string, page?: string }
}) {
    // Use the cached fetch function - will reuse the result from generateMetadata if already called
    const products = await fetchProducts();

    const { productName, page: currentPage } = await searchParams

    // Filter products based on productName (case-insensitive)
    const filteredProducts = productName
        ? products.filter((product: Product) =>
            product.name.toLowerCase().includes(productName.toLowerCase())
        )
        : products;

    return (
        <div className="background">
            <HeaderView />
            <ContentView products={filteredProducts} page={currentPage} />
            {productName ? <SeeAllProductsCtaView /> : null}
            <Footer />
        </div>
    );
}
