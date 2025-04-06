import React from "react";
import "./find-the-animal-description.css";
import GoogleAd from "../google-ads/google-ads.view";

const Description: React.FC = () => {
  return (
    <div className="description-container">
      <div className="description-content">
        <GoogleAd slot={"2296640639"} format="horizontal" />
        
        <h2>🐾 How to Play</h2>
        <ul>
          <li>
            Click <strong>Start Game</strong> to begin.
          </li>
          <li>Move your finger or cursor around the screen to get hints.</li>
          <li>
            The sound gets <strong>louder and faster</strong> as you get closer to
            the hidden animal.
          </li>
          <li>Click to guess the animal&apos;s location.</li>
          <li>
            You only get <strong>5 guesses</strong> — choose wisely!
          </li>
        </ul>

        <GoogleAd slot={"8071302378"} format="in-article" />

        <h2>❓ FAQ</h2>
        <h4>Why can't I hear any sound?</h4>
        <p>
          Ensure you've tapped once to enable audio. Mobile browsers block
          autoplay without interaction.
        </p>

        <h4>Is this playable on mobile?</h4>
        <p>
          Absolutely! Drag your finger to scan and tap to guess — just like you
          would with a mouse.
        </p>

        <h4>What happens when I find the animal?</h4>
        <p>
          You'll see a funny doodle pop up, hear a celebration sound, and get
          confetti!
        </p>

        <h4>Can I play again?</h4>
        <p>
          Yes! Just hit <strong>New Game</strong> or <strong>Try Again</strong>{" "}
          after the round ends.
        </p>

        <GoogleAd slot={"5420878871"} format="horizontal" />
      </div>

      <div className="description-sidebar">
        <GoogleAd slot={"1046729025"} format="vertical" />
        <GoogleAd slot={"5092951097"} format="vertical" />
      </div>
    </div>
  );
};

export default Description;
