import { useState, useEffect } from "react";

function Quotes() {
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

  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 10000); // Change quote every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        background: "var(--card-bg)",
        borderRadius: "20px",
        boxShadow: "var(--card-shadow)",
        padding: "2rem",
        textAlign: "center",
        marginBottom: "2rem",
        transition: "all 0.5s ease",
      }}
    >
      <blockquote
        style={{
          fontSize: "1.25rem",
          fontStyle: "italic",
          color: "var(--text-primary)",
          margin: 0,
          marginBottom: "1rem",
          lineHeight: 1.4,
        }}
      >
        "{currentQuote.text}"
      </blockquote>
      <cite
        style={{
          fontSize: "1.05rem",
          color: "var(--text-secondary)",
          fontWeight: "600",
        }}
      >
        — {currentQuote.author}
      </cite>
    </div>
  );
}

export default Quotes;
