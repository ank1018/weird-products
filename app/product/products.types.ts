export type Product = {
    name: string;
    description: string;
    partnerName: string;
        images: string;
        buyLink: string;
        weird: number;
        useful: number;
        category: string;
        createdAt: string;
};

export type ProductsPageProps = {
    product: Product;
    isMobile: boolean;
};
