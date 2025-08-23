"use client";

import { signIn } from "next-auth/react";
import { Lock, Shield, Users, Key } from "lucide-react";

interface AuthRequiredProps {
  feature: string;
  onSignIn?: () => void;
}

export default function AuthRequired({ feature, onSignIn }: AuthRequiredProps) {
  const handleSignIn = () => {
    if (onSignIn) {
      onSignIn();
    } else {
      signIn("google");
    }
  };

  return (
    <div className="auth-required">
      <div className="auth-content">
        <div className="auth-icon">
          <Lock className="w-8 h-8" />
        </div>

        <div className="auth-text">
          <h3>Authentication Required</h3>
          <p>Please sign in to {feature}</p>
        </div>

        <div className="auth-features">
          <div className="feature-item">
            <Shield className="w-4 h-4" />
            <span>Secure credential storage</span>
          </div>
          <div className="feature-item">
            <Users className="w-4 h-4" />
            <span>Personal social media accounts</span>
          </div>
          <div className="feature-item">
            <Key className="w-4 h-4" />
            <span>OAuth 2.0 security</span>
          </div>
        </div>

        <button onClick={handleSignIn} className="btn btn-primary">
          Sign In with Google
        </button>
      </div>

      <style jsx>{`
        .auth-required {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          margin: 1.5rem 0;
        }

        .auth-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .auth-icon {
          color: #f59e0b;
          margin-bottom: 0.5rem;
        }

        .auth-text h3 {
          color: #ffffff;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }

        .auth-text p {
          color: #a0aec0;
          margin: 0.5rem 0 1rem 0;
        }

        .auth-features {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin: 1rem 0;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #a0aec0;
          font-size: 0.875rem;
        }

        .btn {
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
}
