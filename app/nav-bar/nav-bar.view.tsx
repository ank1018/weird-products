"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, LogIn, LogOut, User } from "lucide-react";
import SignInDialog from '../sign-in/sign-in-dialog';
import './nav-bar.css'
import { useSession, signOut } from "next-auth/react";

export default function NavBarView() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const { data: session } = useSession();
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const toggleDropdown = (category: string | null) => {
    setActiveDropdown(activeDropdown === category ? null : category);
  };

  // Organized navigation items by category
  const navItems = {
    utilities: [
      { name: "Habit Tracker", path: "/habit-tracker" },
      { name: "JSON Formatter", path: "/json-formatter" },
      { name: "What's My IP & Network?", path: "/find-my-ip" },
      { name: "Financial Planning", path: "/financial-planning" },
    ],
    games: [
      { name: "Find The Animal", path: "/find-the-animal" },
      { name: "Catch The Shapes", path: "/shadow-shapes" },
    ],
    tools: [
      { name: "Check Your Personality", path: "/personality-predictor" },
    ]
  };

  return (
    <div className="navigation-container">
      <nav className="navbar">
        {/* Brand / Logo - always visible */}
        <div className="nav-brand">
          <Link href="/" className="nav-link brand-link" onClick={() => setMenuOpen(false)}>
            WoW
          </Link>
        </div>



        <div className="left-section">
          {/* Desktop Navigation with Dropdowns */}
          <div className="nav-desktop">
            <ul className="nav-links">
              {Object.entries(navItems).map(([category, items]) => (
                <li key={category} className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle"
                    onClick={() => toggleDropdown(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                    <ChevronDown className={`dropdown-icon ${activeDropdown === category ? 'rotated' : ''}`} size={16} />
                  </button>
                  {activeDropdown === category && (
                    <ul className="dropdown-menu">
                      {items.map((item) => (
                        <li key={item.path} className="dropdown-item">
                          <Link
                            href={item.path}
                            className="dropdown-link"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
          {/* Mobile Navigation Toggle */}
          <div className="nav-mobile">
            <button className="menu-toggle" onClick={toggleMenu}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div className="navbar-actions">
            {!session ? (
              <button
                className="sign-in"
                onClick={() => setShowSignInDialog(true)}
                aria-label="Sign in"
              >
                <LogIn size={20} />
                <span className="nav-desktop">Sign in</span>
              </button>
            ) : (
              <div className="user-dropdown">
                <button className="dropdown-toggle" aria-haspopup="true" aria-expanded="false" onClick={() => toggleDropdown('profile')}>
                  <User size={20} />
                  <span className="nav-desktop">{session.user?.name || 'User'}</span>
                  <ChevronDown size={16} className="dropdown-icon nav-desktop" />
                </button>
                {activeDropdown === 'profile' && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      Welcome, {session.user?.name}
                    </div>
                    <div className="dropdown-header">
                      <Link
                        href={'/habit-tracker'}
                        onClick={() => setActiveDropdown(null)}
                      >
                        Habit Tracker
                      </Link>
                    </div>
                    <div className="dropdown-header">
                      <Link
                        href={'/financial-planning'}
                        onClick={() => setActiveDropdown(null)}
                      >
                        Financial Planning
                      </Link></div>
                    <button onClick={() => signOut()} className="dropdown-item sign-out-button">
                      <LogOut size={16} />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu with Accordion-style Dropdowns */}
      {menuOpen && (
        <div className="mobile-menu">
          <ul className="mobile-nav-links">
            <li className="nav-item">
              <Link
                href="/"
                className="nav-link"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>

            {Object.entries(navItems).map(([category, items]) => (
              <li key={category} className="mobile-dropdown">
                <button
                  className="mobile-dropdown-toggle"
                  onClick={() => toggleDropdown(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                  <ChevronDown className={`dropdown-icon ${activeDropdown === category ? 'rotated' : ''}`} size={16} />
                </button>

                {activeDropdown === category && (
                  <ul className="mobile-dropdown-menu">
                    {items.map((item) => (
                      <li key={item.path} className="mobile-dropdown-item">
                        <Link
                          href={item.path}
                          className="mobile-dropdown-link"
                          onClick={() => setMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <SignInDialog
        isOpen={showSignInDialog}
        onClose={() => setShowSignInDialog(false)}
      />
    </div>
  );
}
