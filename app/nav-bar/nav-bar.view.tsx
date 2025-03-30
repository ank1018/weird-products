"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import "./nav-bar.css";

export default function NavBarView() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="navigation-container">
      <nav className="navbar">
        {/* Brand / Logo */}
        {/* <div className="nav-brand">
          <Link href="/" className="nav-link brand-link" onClick={() => setMenuOpen(false)}>
            Wacky Products
          </Link>
        </div> */}
        {/* Desktop Navigation */}
        <div className="nav-desktop">
          <ul className="nav-links">
            <li className="nav-item">
              <Link href="/" className="nav-link">
                Wacky Products
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/json-formatter" className="nav-link">
                JSON Formatter
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/find-my-ip" className="nav-link">
                {"What's My IP & Network?"}
              </Link>
            </li>
          </ul>
        </div>
        {/* Mobile Navigation Toggle */}
        <div className="nav-mobile">
          <button className="menu-toggle" onClick={toggleMenu}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <ul className="mobile-nav-links">
            <li className="nav-item">
              <Link
                href="/"
                className="nav-link"
                onClick={() => setMenuOpen(false)}
              >
                Wacky Products
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/json-formatter"
                className="nav-link"
                onClick={() => setMenuOpen(false)}
              >
                JSON Formatter
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/find-my-ip"
                className="nav-link"
                onClick={() => setMenuOpen(false)}
              >
                {"What's My IP & Network?"}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
