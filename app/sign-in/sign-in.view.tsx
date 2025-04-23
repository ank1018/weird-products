// SignIn.jsx
import React from 'react';
import './sign-in.css';
import { signIn as NextAuthSignIn } from 'next-auth/react';

interface SignInProps {
    signIn: typeof NextAuthSignIn;
}

const SignIn = ({ signIn }: SignInProps) => {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Habit Tracker</h1>
                    <p>Sign in to track your daily habits and build consistency</p>
                </div>

                <div className="auth-buttons">
                    <button
                        onClick={() => signIn('google')}
                        className="google-sign-in-button"
                    >
                        <span className="button-icon">
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path fill="currentColor" d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.787-1.676-4.139-2.701-6.735-2.701-5.522 0-10 4.478-10 10s4.478 10 10 10c8.396 0 10.245-7.804 9.465-12.428l-9.465 0.761z" />
                            </svg>
                        </span>
                        Sign in with Google
                    </button>
                </div>

                <div className="auth-footer">
                    <p>By signing in, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;