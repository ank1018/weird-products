'use client'
import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import './product.css';
import { ProductsPageProps } from "./products.types";
import Image from "next/image";
import { Fredoka } from "next/font/google";
import RandomDoodles from "../doodle/doodle.view";
import { toast } from "react-hot-toast";

const fredoka = Fredoka({ subsets: ["latin"], weight: ["300", "400"], variable: "--font-fredoka" });

const QuirkyProductPage: React.FC<ProductsPageProps> = ({ product, isMobile }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [weirdCount, setWeirdCount] = useState(product.weird || 0);
    const [usefulCount, setUsefulCount] = useState(product.useful || 0);
    const [hasVotedWeird, setHasVotedWeird] = useState(false);
    const [hasVotedUseful, setHasVotedUseful] = useState(false);
    const [isVoting, setIsVoting] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    const imageUrls = product.images.replace(/"/g, '').split(',').map(url => url.trim());
    const formattedDescription = product.description.replace(/\\n/g, "\n");

    useEffect(() => {
        const weirdVoteKey = `weird-vote-${product.name}`;
        const usefulVoteKey = `useful-vote-${product.name}`;

        setHasVotedWeird(!!localStorage.getItem(weirdVoteKey));
        setHasVotedUseful(!!localStorage.getItem(usefulVoteKey));
    }, [product.name]);

    // Update vote count
    const updateVoteCount = async (voteType: string) => {
        if (isVoting) return;

        const voteKey = `${voteType}-vote-${product.name}`;
        if ((voteType === 'weird' && hasVotedWeird) || (voteType === 'useful' && hasVotedUseful)) {
            toast.error("You have already voted!");
            return;
        }

        setIsVoting(true);
        try {
            const response = await fetch("/api/updateVote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productName: product.name, voteType }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success(`Thank you for voting! 🎉`);
                if (voteType === 'weird') {
                    setWeirdCount(result.newValue);
                    setHasVotedWeird(true);
                } else {
                    setUsefulCount(result.newValue);
                    setHasVotedUseful(true);
                }
                localStorage.setItem(voteKey, 'true');
            } else {
                toast.error(`Vote failed: ${result.error}`);
            }
        } catch (error) {
            toast.error(`An error occurred. Please try again. ${error}`);
        } finally {
            setIsVoting(false);
        }
    };

    // Share product
    const shareProduct = async () => {
        setIsSharing(true);
        // Use the current URL instead of hardcoding localhost
        const url = typeof window !== 'undefined'
            ? `${window.location.origin}${window.location.pathname}?productName=${encodeURIComponent(product.name)}`
            : '';

        try {
            if (navigator.share) {
                // Use Web Share API if available
                await navigator.share({
                    title: `Check out this quirky product: ${product.name}`,
                    text: `I found this weird but useful product! ${product.name}`,
                    url: url
                });
                toast.success("Shared successfully! 🎉");
            } else if (navigator.clipboard && navigator.clipboard.writeText) {
                // Check if clipboard API is fully available
                await navigator.clipboard.writeText(url);
                toast.success("Link copied to clipboard! 📋");
            } else {
                // Fallback for environments where clipboard API is not available
                // Create a temporary input element
                const tempInput = document.createElement('input');
                tempInput.value = url;
                document.body.appendChild(tempInput);
                tempInput.select();

                try {
                    // Try the document.execCommand method as last resort
                    const successful = document.execCommand('copy');
                    if (successful) {
                        toast.success("Link copied to clipboard! 📋");
                    } else {
                        throw new Error('Copy command failed');
                    }
                } catch (err) {
                    toast.error("Couldn't access clipboard. Try again on another device.");
                    console.error("Clipboard fallback failed:", err);
                } finally {
                    document.body.removeChild(tempInput);
                }
            }
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (error?.name !== 'AbortError') {
                toast.error("Sharing failed. Try again?");
                console.error("Error sharing:", error);
            }
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div className="quirky-page">
            <div className="doodle-container">
                <RandomDoodles />
            </div>

            <div className="product-container">
                <div className="product-grid">
                    <div className="images-section">
                        {imageUrls.map((img, index) => (
                            <div
                                key={img}
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-expect-error
                                onClick={() => setSelectedImage(selectedImage === index ? null : index)}
                                className={`image-card ${selectedImage === index ? 'selected' : ''}`}
                            >
                                <Image src={img} alt={`Product view ${index + 1}`} width={500} height={500} referrerPolicy="no-referrer" />
                                <div className="image-border" />
                            </div>
                        ))}
                    </div>

                    <div className="info-section">
                        <div className="info-content">
                            <h1 className={`${fredoka.className} product-title`}>{product.name}</h1>
                            <p className={`${fredoka.className} product-description`}>
                                {formattedDescription.split("\n").map((line, index) => (
                                    <React.Fragment key={index}>{line}<br/></React.Fragment>
                                ))}
                            </p>

                            {/* Action Buttons Row */}
                            <div className="action-buttons">
                                {/* Voting Buttons */}
                                <div className="vote-buttons">
                                    <button
                                        className={`weird-btn ${hasVotedWeird ? 'voted' : ''}`}
                                        onClick={() => updateVoteCount("weird")}
                                    >
                                        {isVoting && !hasVotedWeird ?
                                            <span className="loader"></span> : "Weird"} ({weirdCount})
                                    </button>
                                    <button
                                        className={`useful-btn ${hasVotedUseful ? 'voted' : ''}`}
                                        onClick={() => updateVoteCount("useful")}
                                    >
                                        {isVoting && !hasVotedUseful ?
                                            <span className="loader"></span> : "Useful"} ({usefulCount})
                                    </button>
                                </div>

                                {/* Doodly Share Button with clearer share icon */}
                                {isMobile ? <div>
                                    {isSharing ? (
                                        <span className="loader"></span>
                                    ) : (
                                        <div className="share-icon-container" onClick={shareProduct}
                                             aria-label="Share this product">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="share-icon"
                                            >
                                                <circle cx="18" cy="5" r="3"></circle>
                                                <circle cx="6" cy="12" r="3"></circle>
                                                <circle cx="18" cy="19" r="3"></circle>
                                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                            </svg>
                                            Share
                                        </div>
                                    )}
                                </div> : null}
                            </div>

                            {/* Buy Button */}
                            <a href={product.buyLink} target="_blank" className="buy-button">
                                <ShoppingCart className="buy-icon"/>
                                Grab It from {product.partnerName}! 🤯
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuirkyProductPage;
