import React from 'react';
import './find-my-ip-description.css';
import GoogleAd from '../google-ads/google-ads.view';

const FindMyIpDescription: React.FC = () => {
  return (
    <div className="description-container">
      <div className="description-card">
        <h2>What is an IP Address?</h2>
        
        <div className="description-section">
          <h3>Understanding IP Addresses</h3>
          <p>
            An IP (Internet Protocol) address is a unique identifier assigned to
            every device connected to the internet. It&apos;s like your device&apos;s digital
            address, allowing it to communicate with other devices and access online
            services.
          </p>
        </div>

        <div className="description-section">
          <h3>How IP Addresses Work</h3>
          <p>
            Your IP address typically shows your general location (city/region) and
            internet service provider. It doesn&apos;t reveal personal information like
            your name or exact address.
          </p>
        </div>

        <div className="description-section">
          <h3>IPv4 vs IPv6</h3>
          <p>
            IPv4 uses 32-bit addresses (like 192.168.1.1) while IPv6 uses 128-bit
            addresses (like 2001:0db8:85a3:0000:0000:8a2e:0370:7334). IPv6 was
            created to provide more addresses as IPv4 addresses were running out.
          </p>
        </div>

        <div className="description-section">
          <h3>Privacy and Security</h3>
          <p>
            While your IP address doesn&apos;t directly reveal your identity, it can be
            used to track your online activity. Using a VPN or proxy can help mask
            your IP address for increased privacy.
          </p>
        </div>

        <div className="description-note">
          <p>
            Note: Your IP address is automatically detected by our tool. No personal
            information is stored or shared.
          </p>
        </div>

        <GoogleAd slot={"2296640639"} className="ad-top" />
      </div>
    </div>
  );
};

export default FindMyIpDescription;
