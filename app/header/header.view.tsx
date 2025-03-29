import Image from "next/image";
import "./header.css";
import Link from "next/link";

export default function HeaderView() {
  return (
    <div className="logo-container">
      <Link
        href="/"
        aria-current="page"
        className="logo-holder w-inline-block w--current"
      >
        <Image
          priority={true}
          src="/images/wow-logo.png"
          width="200"
          height="110"
          alt="logo-image"
          style={{
            transition: "all, transform 200ms",
            transform: "scaleX(1) scaleY(1)",
          }}
        />
      </Link>
    </div>
  );
}
