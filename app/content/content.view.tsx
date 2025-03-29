"use client";
import Image from "next/image";
import "./content.css";
import { Sigmar } from "next/font/google";
import QuirkyProductPage from "../product/product.view";
import QuirkyPagination from "../pagination/pagination.view";
import { useEffect, useMemo, useRef, useState } from "react";
import { Product } from "../product/products.types";
import GoogleAd from "../google-ads/google-ads.view";

const sigmar = Sigmar({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-sigmar",
});
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export default function Content({ products, page }) {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isMobile, setIsMobile] = useState(false); // Initialize without window check
  // Pagination settings
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1); // Initialize with default value
  // State for products to display (for infinite scroll)
  const [displayedMobileProducts, setDisplayedMobileProducts] = useState([]);

  // Handle client-side initialization
  useEffect(() => {
    // Set isMobile based on window width
    setIsMobile(window.innerWidth <= 768);

    // Set page number if provided and not mobile
    if (page && window.innerWidth > 768) {
      setCurrentPage(parseInt(page));
    }

    // Initialize displayed products
    if (products.length < ITEMS_PER_PAGE) {
      setHasMore(false);
    }
  }, [page, products.length]);

  // Initialize mobile products after isMobile is properly set
  useEffect(() => {
    if (
      isMobile &&
      displayedMobileProducts.length < ITEMS_PER_PAGE &&
      products.length > 0
    ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setDisplayedMobileProducts([...products.slice(0, ITEMS_PER_PAGE)]);
    }
  }, [isMobile, displayedMobileProducts.length, products]);

  // Use useMemo to avoid recalculating on every render (for pagination)
  const displayedDesktopProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return products.slice(startIndex, endIndex);
  }, [currentPage, products, ITEMS_PER_PAGE]);

  const resizeTimeoutRef = useRef(null); // Use a ref instead of window

  useEffect(() => {
    const handleResize = () => {
      const mobileStatus = window.innerWidth <= 768;
      if (mobileStatus !== isMobile) {
        setIsMobile(mobileStatus);
      }
    };

    const debounceResize = () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      resizeTimeoutRef.current = setTimeout(handleResize, 200);
    };

    window.addEventListener("resize", debounceResize);
    return () => {
      window.removeEventListener("resize", debounceResize);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    };
  }, [isMobile]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Create a reference for infinite scroll detection
  const observerRef = useRef(null);
  // Function to load more products (for infinite scroll)
  const loadMoreProducts = () => {
    if (loading || !hasMore || products.length < ITEMS_PER_PAGE) return;

    setLoading(true);
    const currentLength = displayedMobileProducts.length;
    const nextProducts = products.slice(
      currentLength,
      currentLength + ITEMS_PER_PAGE
    );

    if (nextProducts.length === 0) {
      setHasMore(false); // Prevents unnecessary calls
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setDisplayedMobileProducts((prev) => [...prev, ...nextProducts]);
    }
    setLoading(false);
  };
  // Intersection Observer for infinite scroll on mobile
  useEffect(() => {
    if (!isMobile || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          hasMore &&
          displayedMobileProducts.length > 0
        ) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    ); // Lower threshold for earlier detection

    const currentObserver = observer;

    if (observerRef.current) {
      currentObserver.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        currentObserver.unobserve(observerRef.current);
      }
    };
  }, [
    isMobile,
    loading,
    hasMore,
    displayedMobileProducts,
    products,
    loadMoreProducts,
  ]);

  // Choose which products to display based on mobile or desktop
  const productsToShow = isMobile
    ? displayedMobileProducts
    : displayedDesktopProducts;

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
        Browse and buy the weirdest, most surprisingly useful products on the
        internet! Whether it&#39;s absurd or genius, you decide—vote if it&#39;s
        Wacky or Wise!&#34;
      </div>
      <Image
        className={"banner-image"}
        src="/images/wow-banner.png"
        width="900"
        height="450"
        alt="banner image"
      />

      <GoogleAd slot={"4077644091"} className="ad-top" />

      {/* Products List */}
      {productsToShow.map((product: Product, index: number) => (
        <div key={`${product.name}-${index}`}>
          <QuirkyProductPage product={product} isMobile={isMobile} />
          <GoogleAd slot={"5420878871"} className="ad-top" />
        </div>
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

      {/* Intersection observer target element - only rendered client-side */}
      {isMobile && hasMore && (
        <div
          ref={observerRef}
          className="observer-element"
          style={{ height: "20px", margin: "20px 0" }}
        ></div>
      )}
    </div>
  );
}
