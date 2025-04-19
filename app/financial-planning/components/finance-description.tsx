// components/FinanceDescription.tsx
import React from "react";

const FinanceDescription: React.FC = () => {
    return (
        <article className="finance-description">
            <header>
                <h1>Finance 101: Definitions, Best Practices, and FAQs</h1>
                <p>
                    Welcome to our comprehensive resource on personal finance. Here you’ll
                    find clear definitions, actionable best practices, and answers to
                    frequently asked questions to help you make informed financial
                    decisions.
                </p>
            </header>

            <section id="definitions">
                <h2>Key Definitions</h2>
                <p>
                    Understanding the basics is the first step toward financial success.
                    Below are some fundamental definitions:
                </p>
                <ul>
                    <li>
                        <strong>Income:</strong> The money you earn from salary, business,
                        or investments.
                    </li>
                    <li>
                        <strong>Expenses:</strong> The costs incurred in daily life such as
                        housing, food, transportation, and utilities.
                    </li>
                    <li>
                        <strong>Savings:</strong> The portion of income that is not spent;
                        these funds are set aside for future use.
                    </li>
                    <li>
                        <strong>Investments:</strong> Financial assets like stocks, bonds, or
                        real estate purchased with the expectation of generating returns.
                    </li>
                    <li>
                        <strong>Debt:</strong> Money owed by an individual, such as loans,
                        credit card balances, or mortgages.
                    </li>
                </ul>
            </section>

            <section id="best-practices">
                <h2>Best Practices for Financial Health</h2>
                <p>Follow these best practices to build a strong financial foundation:</p>
                <ul>
                    <li>Regularly track your income and expenses.</li>
                    <li>Create a realistic budget and stick to it.</li>
                    <li>Prioritize paying down high-interest debt.</li>
                    <li>
                        Build an emergency fund that covers 3–6 months of expenses.
                    </li>
                    <li>Diversify investments to manage risk.</li>
                    <li>
                        Plan for long-term goals such as retirement or major purchases.
                    </li>
                </ul>
            </section>

            <section id="about">
                <h2>About This Site</h2>
                <p>
                    Our website is dedicated to providing you with accurate and timely
                    financial information, expert advice, and useful tools. Whether you
                    are just starting out or planning for a secure future, our resources
                    are designed to empower you to take control of your finances.
                </p>
            </section>

            <section id="faqs">
                <h2>Frequently Asked Questions</h2>
                <dl>
                    <dt>What is a budget?</dt>
                    <dd>
                        A budget is a plan that details expected income and expenses over a
                        set period, helping you manage your money effectively.
                    </dd>
                    <dt>How do I start investing?</dt>
                    <dd>
                        Begin with research on various investment options, such as low-cost
                        index funds or ETFs, and consider consulting a financial advisor.
                    </dd>
                    <dt>Why is an emergency fund important?</dt>
                    <dd>
                        An emergency fund provides financial security in unexpected events,
                        ensuring that you have money available for urgent needs.
                    </dd>
                    <dt>What are common financial mistakes?</dt>
                    <dd>
                        Common pitfalls include overspending, neglecting savings,
                        accumulating high-interest debt, and failing to plan for future
                        goals.
                    </dd>
                </dl>
            </section>

            <footer>
                <p>&copy; {new Date().getFullYear()} Finance 101. All rights reserved.</p>
            </footer>

            <style jsx>{`
        .finance-description {
          font-family: Arial, sans-serif;
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
          color: #333;
          line-height: 1.6;
        }
        .finance-description header {
          text-align: center;
          margin-bottom: 20px;
        }
        .finance-description h1 {
          font-size: 2rem;
          margin-bottom: 10px;
        }
        .finance-description p {
          font-size: 1rem;
          margin-bottom: 10px;
        }
        .finance-description section {
          margin-bottom: 30px;
        }
        .finance-description section h2 {
          font-size: 1.5rem;
          color: #0070f3;
          margin-bottom: 10px;
          border-bottom: 2px solid #0070f3;
          padding-bottom: 5px;
        }
        .finance-description ul {
          list-style: disc;
          margin-left: 20px;
        }
        .finance-description dl {
          margin: 0;
        }
        .finance-description dl dt {
          font-weight: bold;
          margin-top: 10px;
        }
        .finance-description dl dd {
          margin-left: 20px;
          margin-bottom: 10px;
        }
        .finance-description footer {
          text-align: center;
          font-size: 0.9rem;
          color: #888;
          border-top: 1px solid #ddd;
          padding-top: 10px;
          margin-top: 30px;
        }
      `}</style>
        </article>
    );
};

export default FinanceDescription;
