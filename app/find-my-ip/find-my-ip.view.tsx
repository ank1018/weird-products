"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Copy, Check } from "lucide-react";
import { UAParser } from "ua-parser-js";
import NavBarView from "../nav-bar/nav-bar.view";
import Footer from "../footer/footer.view";
import GoogleAd from "../google-ads/google-ads.view";
import "./find-my-ip.css";

export default function FindMyIpPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ipInfo, setIpInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Add custom class on mount
    document.body.classList.add("findmyip-route-body");
    return () => {
      // Remove custom class on unmount
      document.body.classList.remove("findmyip-route-body");
    };
  }, []);

  useEffect(() => {
    const fetchIpInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();

        // Fetch additional details using the ipapi service.
        const detailsResponse = await fetch(
          `https://ipapi.co/${data.ip}/json/`
        );
        const detailsData = await detailsResponse.json();

        // Parse the user agent into a human readable format.
        const parser = new UAParser(navigator.userAgent);
        const browserParsed = parser.getResult();

        // Get network info, if available.
        const connection =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (navigator as any).connection ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (navigator as any).mozConnection ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (navigator as any).webkitConnection;
        const network = connection
          ? {
              effectiveType: connection.effectiveType,
              downlink: connection.downlink,
              rtt: connection.rtt,
              saveData: connection.saveData,
            }
          : {};

        setIpInfo({
          ip: data.ip,
          ...detailsData,
          browser: navigator.userAgent,
          browserParsed,
          network,
        });
        setLoading(false);
      } catch (err) {
        setError(
          `Unable to fetch IP information. Please try again later.${err}`
        );
        setLoading(false);
      }
    };

    fetchIpInfo();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="background">
      <Head>
        <title>
          Find My IP Address | Detailed Browser, Network & Location Information
        </title>
        <meta
          name="description"
          content="Discover your public IP address along with comprehensive details about your location, browser, and network connection. Learn about your country, region, city, and more to understand your online footprint and enhance your digital privacy."
        />
        <meta
          name="keywords"
          content="IP address, find my IP, browser information, network details, online privacy, IP lookup, location, device info, internet security"
        />
        <meta
          property="og:title"
          content="Find My IP Address | Detailed Browser, Network & Location Information"
        />
        <meta
          property="og:description"
          content="Use our free tool to discover your public IP address and get in-depth details about your location, browser, and network connection."
        />
        <meta
          property="og:image"
          content="/static/images/ip-address-preview.png"
        />
        <meta property="og:url" content="https://yourwebsite.com/find-my-ip" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <NavBarView />

      <div className="findmyip-layout">
        {/* Left Ad */}
        <div className="left-ad">
          <GoogleAd slot={"4077644091"} />
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="findmyip-card">
            <h1 className="findmyip-title">Find My IP Address</h1>

            {loading ? (
              <div className="findmyip-loading">
                <div className="loader"></div>
                <p>Detecting your IP address...</p>
              </div>
            ) : error ? (
              <div className="findmyip-error">
                <p>{error}</p>
              </div>
            ) : (
              <>
                <div className="ip-header">
                  <h2>
                    Your IP Address:
                    <span className="ip-value">{ipInfo.ip}</span>
                    <button
                      className="copy-btn"
                      onClick={() => copyToClipboard(ipInfo.ip)}
                      title="Copy to clipboard"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </h2>
                </div>

                {/* IP Information Section */}
                <div className="info-section">
                  <h3>IP Information</h3>
                  <div className="ip-table-wrapper">
                    <table className="ip-table">
                      <thead>
                        <tr>
                          <th>Property</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Country</td>
                          <td>
                            {ipInfo.country_name} ({ipInfo.country_code})
                          </td>
                        </tr>
                        <tr>
                          <td>Region</td>
                          <td>{ipInfo.region}</td>
                        </tr>
                        <tr>
                          <td>City</td>
                          <td>{ipInfo.city}</td>
                        </tr>
                        <tr>
                          <td>Postal Code</td>
                          <td>{ipInfo.postal || "N/A"}</td>
                        </tr>
                        <tr>
                          <td>Latitude/Longitude</td>
                          <td>
                            {ipInfo.latitude}, {ipInfo.longitude}
                          </td>
                        </tr>
                        <tr>
                          <td>Timezone</td>
                          <td>{ipInfo.timezone}</td>
                        </tr>
                        <tr>
                          <td>UTC Offset</td>
                          <td>{ipInfo.utc_offset}</td>
                        </tr>
                        <tr>
                          <td>Currency</td>
                          <td>
                            {ipInfo.currency_name} ({ipInfo.currency})
                          </td>
                        </tr>
                        <tr>
                          <td>Languages</td>
                          <td>{ipInfo.languages}</td>
                        </tr>
                        <tr>
                          <td>ASN</td>
                          <td>{ipInfo.asn}</td>
                        </tr>
                        <tr>
                          <td>Organization</td>
                          <td>{ipInfo.org}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Map Section */}
                {ipInfo.latitude && ipInfo.longitude && (
                  <div className="info-section">
                    <h3>Location Map</h3>
                    <div className="map-container">
                      <iframe
                        width="100%"
                        height="300"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight={0}
                        marginWidth={0}
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                          Number(ipInfo.longitude) - 0.05
                        }%2C${Number(ipInfo.latitude) - 0.05}%2C${
                          Number(ipInfo.longitude) + 0.05
                        }%2C${
                          Number(ipInfo.latitude) + 0.05
                        }&amp;layer=mapnik&amp;marker=${ipInfo.latitude}%2C${
                          ipInfo.longitude
                        }`}
                        title="Location Map"
                      ></iframe>
                    </div>
                  </div>
                )}

                {/* Browser Information Section */}
                <div className="info-section">
                  <h3>Browser Information</h3>
                  <div className="ip-table-wrapper">
                    <table className="ip-table">
                      <thead>
                        <tr>
                          <th>Property</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Browser</td>
                          <td>
                            {ipInfo.browserParsed.browser.name}{" "}
                            {ipInfo.browserParsed.browser.version}
                          </td>
                        </tr>
                        <tr>
                          <td>Engine</td>
                          <td>
                            {ipInfo.browserParsed.engine.name}{" "}
                            {ipInfo.browserParsed.engine.version}
                          </td>
                        </tr>
                        <tr>
                          <td>OS</td>
                          <td>
                            {ipInfo.browserParsed.os.name}{" "}
                            {ipInfo.browserParsed.os.version}
                          </td>
                        </tr>
                        <tr>
                          <td>Device</td>
                          <td>
                            {ipInfo.browserParsed.device.model || "Desktop"}
                          </td>
                        </tr>
                        <tr>
                          <td>Raw User Agent</td>
                          <td>{ipInfo.browser}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Network Information Section */}
                <div className="info-section">
                  <h3>Network Information</h3>
                  <div className="ip-table-wrapper">
                    <table className="ip-table">
                      <thead>
                        <tr>
                          <th>Property</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Effective Connection Type</td>
                          <td>{ipInfo.network.effectiveType || "N/A"}</td>
                        </tr>
                        <tr>
                          <td>Downlink</td>
                          <td>
                            {ipInfo.network.downlink
                              ? ipInfo.network.downlink + " Mb/s"
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>Round Trip Time</td>
                          <td>
                            {ipInfo.network.rtt
                              ? ipInfo.network.rtt + " ms"
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>Save Data</td>
                          <td>
                            {ipInfo.network.saveData === undefined
                              ? "N/A"
                              : ipInfo.network.saveData
                              ? "Yes"
                              : "No"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="ip-note">
                  <p>
                    Your IP address is your unique identifier on the internet.
                    This information is generally visible to websites you visit.
                  </p>
                </div>

                {/* Expanded Description for SEO */}
                <div className="info-section seo-description">
                  <h3>About This Tool</h3>
                  <p>
                    This free online tool helps you quickly determine your
                    public IP address and provides comprehensive details about
                    your location, browser, and network connection. By
                    displaying information such as your country, region, city,
                    postal code, and even your device details, it empowers you
                    to understand your online footprint better. Whether you are
                    troubleshooting network issues, seeking insights into your
                    digital privacy, or simply curious about your connection
                    quality, our tool offers a user-friendly interface with
                    accurate, real-time data. Explore additional features like
                    an interactive map showing your approximate location and
                    detailed browser information that is parsed for readability.
                    Enhance your online security by knowing more about the
                    digital environment in which you operate.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Ad */}
        <div className="right-ad">
          <GoogleAd slot={"4077644091"} />
        </div>
      </div>
      <GoogleAd slot={"4077644091"} className="ad-bottom" />
      <Footer />
    </div>
  );
}
