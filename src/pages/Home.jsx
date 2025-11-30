import { Container } from "react-bootstrap";
import Quotes from "../components/Quotes";
import DarkModeToggle from "../components/DarkModeToggle";

function Home() {
  return (
    <Container
      fluid
      className="min-vh-100 pb-5"
      style={{ background: "var(--bg-primary)" }}
    >
      <Container className="pt-5">
        <div
          className="text-center mb-4 p-3 d-flex flex-column justify-content-center align-items-center"
          style={{
            minHeight: "200px",
            background: "#FFFFFF",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            color: "#374151",
          }}
        >
          <h1 className="display-3 fw-bold mb-3">
            <span style={{ fontSize: "3rem" }}>⏰</span> Todo Timer App
          </h1>
          <p
            className="lead mb-0"
            style={{ fontSize: "1.2rem", opacity: 0.95 }}
          >
            Boost your productivity with focused time management
          </p>
        </div>

        <DarkModeToggle />

        <Quotes />
      </Container>
    </Container>
  );
}

export default Home;
