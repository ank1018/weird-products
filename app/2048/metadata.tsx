import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
    title: "2048 Game | Classic Number Puzzle Game",
    description: "Play the classic 2048 number puzzle game. Combine tiles, reach 2048, and challenge your strategic thinking. A perfect brain exercise for all ages!",
    keywords: [
        "2048 game",
        "number puzzle",
        "brain game",
        "strategy game",
        "puzzle game",
        "2048 puzzle",
        "number combination game",
        "brain exercise",
        "mobile game",
        "browser game"
    ].join(", "),
    openGraph: {
        title: "2048 Game | Classic Number Puzzle Game",
        description: "Play the classic 2048 number puzzle game. Combine tiles, reach 2048, and challenge your strategic thinking. A perfect brain exercise for all ages!",
        type: "website",
        url: "https://weird-products.com/2048",
        images: [
            {
                url: "/static/images/2048-preview.png",
                width: 1200,
                height: 630,
                alt: "2048 Game Preview",
            },
        ],
    },
    robots: {
        index: true,
        follow: true,
    },
    authors: [{ name: "Weird Products" }],
    alternates: {
        canonical: "https://weird-products.com/2048",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
}; 