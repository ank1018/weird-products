'use client'
import Image from "next/image";
import "./content.css";
import { Sigmar } from "next/font/google";
import QuirkyProductPage from "../product/product.view";
import QuirkyPagination from "../pagination/pagination.view";
import {useEffect, useMemo, useRef, useState} from "react";

const sigmar = Sigmar({ subsets: ["latin"], weight: ["400"], variable: "--font-sigmar" });

export default function Content({products, page}) {
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth <= 768 : false);
    // Pagination settings
    const ITEMS_PER_PAGE = 3;
    const [currentPage, setCurrentPage] = useState(page && !isMobile ? parseInt(page) : 1);
    console.log("currentPage:........................", currentPage)
    // State for products to display (for infinite scroll)
    const [displayedMobileProducts, setDisplayedMobileProducts] = useState([]);
    // Initialize mobile products on first render
    useEffect(() => {
        if (products.length < ITEMS_PER_PAGE) {
            setHasMore(false);
        }
        if (isMobile && displayedMobileProducts.length === 0) {
            console.log("Setting displayedMobileProducts:", products.slice(0, ITEMS_PER_PAGE));
            setDisplayedMobileProducts([...products.slice(0, ITEMS_PER_PAGE)]);
            console.log("Updated displayedMobileProducts:..............", displayedMobileProducts);
        }
    }, [isMobile, displayedMobileProducts]);

    useEffect(() => {
        console.log("Products from API:", products);
    }, [products]);

    useEffect(() => {
        console.log("Updated displayedMobileProducts:......................", displayedMobileProducts);
    }, [displayedMobileProducts]);


    // Use useMemo to avoid recalculating on every render (for pagination)
    const displayedDesktopProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return products.slice(startIndex, endIndex);
    }, [currentPage, products, ITEMS_PER_PAGE]);

    const resizeTimeoutRef = useRef<number | null>(null); // Use a ref instead of window

    useEffect(() => {
        const handleResize = () => {
            const mobileStatus = window.innerWidth <= 768;
            if (mobileStatus !== isMobile) {
                console.log("isMobile status changed:", mobileStatus);
                setIsMobile(mobileStatus);
            }
        };

        const debounceResize = () => {
            if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
            resizeTimeoutRef.current = setTimeout(handleResize, 200) as unknown as number;
        };

        window.addEventListener("resize", debounceResize);
        return () => {
            window.removeEventListener("resize", debounceResize);
            if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
        };
    }, [isMobile]);


    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Create a reference for infinite scroll detection
    const observerRef = useRef(null);

    // Intersection Observer for infinite scroll on mobile
    useEffect(() => {
        if (!isMobile || !hasMore) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !loading && hasMore) {
                loadMoreProducts();
            }
        }, { threshold: 0.1 }); // Lower threshold for earlier detection

        const currentObserver = observer;

        if (observerRef.current) {
            currentObserver.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                currentObserver.unobserve(observerRef.current);
            }
        };
    }, [isMobile, loading, hasMore, displayedMobileProducts]);

    // Function to load more products (for infinite scroll)
    const loadMoreProducts = () => {
        if (loading || !hasMore || products.length < ITEMS_PER_PAGE) return;
        console.log("loadMoreProducts triggered");

        setLoading(true);
        const currentLength = displayedMobileProducts.length;
        const nextProducts = products.slice(currentLength, currentLength + ITEMS_PER_PAGE);

        if (nextProducts.length === 0) {
            setHasMore(false);  // Prevents unnecessary calls
        } else {
            setDisplayedMobileProducts(prev => [...prev, ...nextProducts]);
            console.log("Updated displayedMobileProducts:..............2", displayedMobileProducts);
        }
        setLoading(false);
    };

    // Choose which products to display based on mobile or desktop
    const productsToShow = isMobile ? displayedMobileProducts : displayedDesktopProducts;

    return (
        <div className="floating-icons">
            <Image
                src="/images/doodle-1.png"
                sizes="(max-width: 479px) 92vw, 60vw"
                width="1000"
                height="120"
                alt=""
                className="floating-images-1"
            />
            <div className={`${sigmar.className} website-description`}>
                Discover the weirdest yet most surprisingly useful products! From the absurd to the genius, we help you decide: is it wacky or wise?
            </div>
            <Image
                className={'banner-image'}
                src="/images/wow-banner.png"
                width="900"
                height="450"
                alt="banner image"
            />

            {/* Products List */}
            {productsToShow.map((product, index) => (
                <QuirkyProductPage key={`${product.name}-${index}`} product={product} isMobile={isMobile} />
            ))}

            {/* Quirky Pagination - only shown on desktop */}
            {!isMobile && (
                <QuirkyPagination
                    totalItems={products.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            )}

            {/* Loading indicator for mobile infinite scroll */}
            {isMobile && loading && (
                <div className="loading">Loading more products...</div>
            )}

            {/* Intersection observer target element */}
            {isMobile && hasMore && (
                <div ref={observerRef} className="observer-element" style={{ height: '20px', margin: '20px 0' }}></div>
            )}
        </div>
    );
}
