import HeaderView from "./header/header.view";
import ContentView from "./content/content.view";
import Footer from "./footer/footer.view";

export default async function Page({ searchParams }: { searchParams: { productName?: string, page?: string } }) {
    const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID;
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`;

    // Extract search parameters from the request
    const productName = searchParams?.productName;
    const currentPage = searchParams?.page;
    console.log("currentPage:........................", currentPage)
    let products = [];
    try {
        const response = await fetch(url, { cache: "no-store" });
        // const response = await fetch(url, { next: { revalidate: 360000 } });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        if (data.values) {
            products = data.values.slice(1).map(row => ({
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
    } catch (error) {
        console.error("Failed to fetch data:", error);
    }
    // Filter products based on productName (case-insensitive)
    const filteredProducts = productName
        ? products.filter(product => {
            console.log("product.name.toLowerCase():........................", product.name.toLowerCase(), productName.toLowerCase())
            return product.name.toLowerCase().includes(productName.toLowerCase())
        })
        : products
    return (
        <div className="background">
            <HeaderView />
            <ContentView products={filteredProducts} page={currentPage} />
            <Footer />
        </div>
    );
}
