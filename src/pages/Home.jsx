import { Container } from "react-bootstrap";
import Quotes from "../components/Quotes";
import DarkModeToggle from "../components/DarkModeToggle";

function Home() {
  return (
    <Container fluid className="min-vh-100 py-5">
      <Container>
        <div
          className="text-center mb-4 p-3 text-white header-gradient d-flex flex-column justify-content-center align-items-center"
          style={{ minHeight: "200px" }}
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
