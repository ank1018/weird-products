"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import "./portfolio.css";

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState("profile");
  // const [, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // setIsScrolling(true);

      const sections = ["profile", "skills", "experience", "education"];

      // Find which section is currently in view
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
          }
        }
      });

      // Debounce the scroll event
      setTimeout(() => {
        // setIsScrolling(false);
      }, 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="portfolio-container">
      <Head>
        <title>Ankur Singh | Software Development Engineer</title>
        <meta
          name="description"
          content="Portfolio of Ankur Singh, Software Development Engineer"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="google-adsense-page-ads-disabled" content="true" />
      </Head>

      <nav className="navbar">
        <a href={"/"} className="nav-logo">AS</a>
        <ul className="nav-links">
          <li>
            <a
              href="#profile"
              className={activeSection === "profile" ? "active" : ""}
            >
              Profile
            </a>
          </li>
          <li>
            <a
              href="#skills"
              className={activeSection === "skills" ? "active" : ""}
            >
              Skills
            </a>
          </li>
          <li>
            <a
              href="#experience"
              className={activeSection === "experience" ? "active" : ""}
            >
              Experience
            </a>
          </li>
          <li>
            <a
              href="#education"
              className={activeSection === "education" ? "active" : ""}
            >
              Education
            </a>
          </li>
        </ul>
        <div className="nav-contact">
          <a href="mailto:writetoankurs@gmail.com" className="contact-button">
            Contact Me
          </a>
        </div>
      </nav>

      <header className="header">
        <div className="header-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="header-content">
          <div className="header-text">
            <h1>Ankur Singh</h1>
            <h2>
              Software Development Engineer 3
            </h2>
            <p className="header-tagline">
              Building cutting-edge software solutions that transform user
              experiences
            </p>
            <div className="header-buttons">
              <a href="#experience" className="primary-button">
                View My Work
              </a>
              <a
                  href="mailto:writetoankurs@gmail.com"
                  className="secondary-button"
              >
                Get In Touch
              </a>
              <a
                  href="https://drive.google.com/uc?export=download&id=1A5ZhnmwBVQCRP2qFgDv-IpJoUBZ-GLI6"
                  className="primary-button"
              >
                Download Resume
              </a>

            </div>
          </div>
          <div className="header-profile">
            <div className="profile-avatar">
              {/* Replace with your actual image */}
              <div className="avatar-placeholder">AS</div>
            </div>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-number">8+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat">
                <span className="stat-number">20+</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="stat">
                <span className="stat-number">15+</span>
                <span className="stat-label">Technologies</span>
              </div>
            </div>
          </div>
        </div>
        <div className="header-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,128L48,133.3C96,139,192,149,288,176C384,203,480,245,576,229.3C672,213,768,139,864,128C960,117,1056,171,1152,176C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </header>

      <main>
        <section id="profile" className="profile-section reveal-section">
          <h2 className="section-title">
            Profile <span className="section-line"></span>
          </h2>
          <div className="profile-content">
            <div className="profile-summary">
              <p>
                Seasoned Software Developer with{" "}
                <span className="highlight">8+ years of experience</span> in
                building cutting-edge software solutions. Skilled in
                development, user interface design, and process automation, I
                consistently deliver high-quality solutions that optimize user
                experiences and streamline operations.
              </p>
              <p>
                With a track record of successfully completing diverse projects
                and achieving exceptional results, I bring strong analytical
                skills and a collaborative approach to every endeavor.
              </p>
            </div>
            <div className="profile-cards">
              <div className="profile-card">
                <div className="card-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                </div>
                <h3>Web Development</h3>
                <p>
                  Building responsive, scalable web applications with modern
                  frameworks
                </p>
              </div>
              <div className="profile-card">
                <div className="card-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="2"
                      y="3"
                      width="20"
                      height="14"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                <h3>Mobile Development</h3>
                <p>
                  Creating native and hybrid mobile applications with React
                  Native
                </p>
              </div>
              <div className="profile-card">
                <div className="card-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3>Team Leadership</h3>
                <p>
                  Leading cross-functional teams to deliver high-quality
                  solutions
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="skills-section reveal-section">
          <h2 className="section-title">
            Technical Skills <span className="section-line"></span>
          </h2>

          <div className="skills-container">
            <div className="skill-category">
              <h3>Languages & Frameworks</h3>
              <div className="skill-pills">
                <span className="skill-pill">JavaScript</span>
                <span className="skill-pill">ReactJS</span>
                <span className="skill-pill">React Native</span>
                <span className="skill-pill">Android</span>
                <span className="skill-pill">Redux</span>
                <span className="skill-pill">Angular</span>
                <span className="skill-pill">NextJS</span>
                <span className="skill-pill">Node.js</span>
                <span className="skill-pill">HTML</span>
                <span className="skill-pill">CSS</span>
                <span className="skill-pill">MEAN</span>
                <span className="skill-pill">TypeScript</span>
                <span className="skill-pill">MongoDB</span>
                <span className="skill-pill">SQL</span>
                <span className="skill-pill">GIT</span>
                <span className="skill-pill">GitHub Actions</span>
              </div>
            </div>

            <div className="skill-category">
              <h3>DevOps & Tools</h3>
              <div className="skill-pills">
                <span className="skill-pill">AWS</span>
                <span className="skill-pill">Webpack</span>
                <span className="skill-pill">Jest</span>
                <span className="skill-pill">Jenkins</span>
                <span className="skill-pill">Docker</span>
                <span className="skill-pill">S3</span>
                <span className="skill-pill">Amazon EC2</span>
                <span className="skill-pill">Datadog</span>
                <span className="skill-pill">Kubernetes</span>
                <span className="skill-pill">New Relic</span>
                <span className="skill-pill">Sentry</span>
              </div>
            </div>

            <div className="skill-category">
              <h3>Specializations</h3>
              <div className="skill-pills">
                <span className="skill-pill">Design Systems</span>
                <span className="skill-pill">Performance Optimization</span>
                <span className="skill-pill">CI/CD</span>
                <span className="skill-pill">Payment Gateway Integration</span>
                <span className="skill-pill">Video Infrastructure</span>
                <span className="skill-pill">Ad Tech</span>
              </div>
            </div>
          </div>

          <div className="expertise-grid">
            <div className="expertise-item">
              <div className="expertise-meter">
                <div className="meter-fill" style={{ width: "95%" }}></div>
              </div>
              <div className="expertise-label">Front-end Development</div>
            </div>
            <div className="expertise-item">
              <div className="expertise-meter">
                <div className="meter-fill" style={{ width: "90%" }}></div>
              </div>
              <div className="expertise-label">React Ecosystem</div>
            </div>
            <div className="expertise-item">
              <div className="expertise-meter">
                <div className="meter-fill" style={{ width: "85%" }}></div>
              </div>
              <div className="expertise-label">Mobile Development</div>
            </div>
            <div className="expertise-item">
              <div className="expertise-meter">
                <div className="meter-fill" style={{ width: "88%" }}></div>
              </div>
              <div className="expertise-label">Performance Optimization</div>
            </div>
            <div className="expertise-item">
              <div className="expertise-meter">
                <div className="meter-fill" style={{ width: "92%" }}></div>
              </div>
              <div className="expertise-label">CI/CD & DevOps</div>
            </div>
            <div className="expertise-item">
              <div className="expertise-meter">
                <div className="meter-fill" style={{ width: "80%" }}></div>
              </div>
              <div className="expertise-label">System Architecture</div>
            </div>
          </div>
        </section>

        <section id="experience" className="experience-section reveal-section">
          <h2 className="section-title">
            Professional Experience <span className="section-line"></span>
          </h2>

          <div className="timeline">
            {/* SDE3 – 2024 to Present */}
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="job-header">
                  <h3>Fancode by Dreamsports</h3>
                  <span className="job-title">
                    Software Development Engineer 3
                  </span>
                  <span className="job-period">July 2023 – Present</span>
                </div>
                <div className="job-achievements">
                  <div className="achievement">
                    <h4>Leadership & Architecture</h4>
                    <ul className="job-responsibilities">
                      <li>
                        Led a cross-functional team to design, develop, and
                        deliver high-quality, scalable web and mobile
                        applications.
                      </li>
                      <li>
                        Architected and implemented scalable front-end systems
                        for eCommerce, ad tech, and video infrastructure.
                      </li>
                    </ul>
                  </div>
                  <div className="achievement">
                    <h4>Business Impact</h4>
                    <ul className="job-responsibilities">
                      <li>
                        Developed and optimized ad tech solutions to drive
                        monetization and maximize revenue.
                      </li>
                      <li>
                        Implemented seamless payment solutions to optimize user
                        experiences.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* SDE2 – 2022 to 2024 */}
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="job-header">
                  <h3>Fancode by Dreamsports</h3>
                  <span className="job-title">
                    Software Development Engineer 2
                  </span>
                  <span className="job-period">July 2021 – July 2023</span>
                </div>
                <div className="job-achievements">
                  <div className="achievement">
                    <h4>Technical Innovation</h4>
                    <ul className="job-responsibilities">
                      <li>
                        Enhanced video infrastructure by improving live
                        streaming performance and reducing latency.
                      </li>
                      <li>
                        Implemented CI/CD pipelines to automate build, testing,
                        and deployment processes.
                      </li>
                    </ul>
                  </div>
                  <div className="achievement">
                    <h4>Business Impact</h4>
                    <ul className="job-responsibilities">
                      <li>
                        Improved SEO and search rankings through PWAs with
                        enhanced discoverability.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* SDE1 – 2020 to 2022 */}
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="job-header">
                  <h3>Fancode by Dreamsports</h3>
                  <span className="job-title">
                    Software Development Engineer 1
                  </span>
                  <span className="job-period">Apr 2020 – July 2021</span>
                </div>
                <div className="job-achievements">
                  <div className="achievement">
                    <h4>Foundational Contributions</h4>
                    <ul className="job-responsibilities">
                      <li>
                        Designed and implemented a reusable front-end design
                        system, reducing development time by 30%.
                      </li>
                      <li>
                        Optimized application performance through code
                        splitting, chunking, lazy loading, and SSR.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="job-header">
                  <h3>iProgrammer Solutions Private Limited</h3>
                  <span className="job-title">Frontend Developer</span>
                  <span className="job-period">Oct 2018 - March 2020</span>
                </div>
                <div className="job-achievements">
                  <ul className="job-responsibilities">
                    <li>
                      Developed Gonogo product - Loan origination system for
                      banks and financial institutes (HDFC and ABFL).
                    </li>
                    <li>
                      Optimized Angular application to reduce first load time
                      from over 60 seconds to under 3 seconds.
                    </li>
                    <li>
                      Implemented DNM, MRDN, Liabilities Systems, and Service
                      Digitization for Yes Bank.
                    </li>
                    <li>Implemented payload encryption for all projects.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="job-header">
                  <h3>AbyM Technology</h3>
                  <span className="job-title">Frontend Developer</span>
                  <span className="job-period">March 2016 - Sept 2020</span>
                </div>
                <div className="job-achievements">
                  <ul className="job-responsibilities">
                    <li>
                      Developed and designed UI for inventory management system
                      used for buying and selling building materials.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="education" className="education-section reveal-section">
          <h2 className="section-title">
            Education <span className="section-line"></span>
          </h2>

          <div className="education-cards">
            <div className="education-card">
              <div className="education-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
                </svg>
              </div>
              <div className="education-details">
                <h3>Bachelors of Engineering</h3>
                <p className="education-field">
                  Electronics and Telecommunication
                </p>
                <p className="education-institution">
                  DY Patil College of Engineering
                </p>
                <p className="education-location">Pune University</p>
              </div>
            </div>

            <div className="education-card">
              <div className="education-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <div className="education-details">
                <h3>HSC, SSC</h3>
                <p className="education-institution">Army Public School</p>
                <p className="education-location">Ranchi</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="cta-section">
        <div className="cta-content">
          <h2>Interested in working together?</h2>
          <p>
            I&apos;m always open to discussing new projects, opportunities and
            partnerships.
          </p>
          <a href="mailto:writetoankurs@gmail.com" className="primary-button">
            Get In Touch
          </a>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-info">
            <div className="footer-logo">Ankur Singh</div>
            <p>Software Development Engineer based in Mumbai, India.</p>
          </div>
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="#profile">Profile</a>
              </li>
              <li>
                <a href="#skills">Skills</a>
              </li>
              <li>
                <a href="#experience">Experience</a>
              </li>
              <li>
                <a href="#education">Education</a>
              </li>
            </ul>
          </div>
          <div className="footer-contact">
            <h3>Contact</h3>
            <p>+91-9730969960</p>
            <p>writetoankurs@gmail.com</p>
            <p>Mumbai, India</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Ankur Singh. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
