import Link from "next/link";
import "./see-all-products-cta.css";

export default function SeeAllProductsCtaView() {
    return (
        <div className="see-all-products-container">
            <Link href="/" className="see-all-products-button">
                <div className="see-all-products">
                    <span>See All Products</span>
                </div>
            </Link>
        </div>
    )
}
