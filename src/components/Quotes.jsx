import { useState, useEffect } from "react";

const quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
  {
    text: "You miss 100% of the shots you don't take.",
    author: "Wayne Gretzky",
  },
  {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
  },
  {
    text: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt",
  },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
  },
];

function Quotes() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        padding: "1.5rem 2rem",
        borderRadius: "12px",
        background: "var(--accent-subtle)",
        border: "1px solid var(--border-color)",
        textAlign: "center",
        transition: "all 0.3s ease",
      }}
    >
      <blockquote
        style={{
          fontSize: "1rem",
          fontStyle: "italic",
          color: "var(--text-secondary)",
          margin: 0,
          marginBottom: "0.5rem",
          lineHeight: 1.6,
        }}
      >
        &ldquo;{currentQuote.text}&rdquo;
      </blockquote>
      <cite
        style={{
          fontSize: "0.85rem",
          color: "var(--text-muted)",
          fontWeight: 600,
          fontStyle: "normal",
        }}
      >
        &mdash; {currentQuote.author}
      </cite>
    </div>
  );
}

export default Quotes;
