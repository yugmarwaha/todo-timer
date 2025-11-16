import { Container, Row, Col } from "react-bootstrap";
import Timer from "../components/Timer";
import DarkModeToggle from "../components/DarkModeToggle";

function TimerPage() {
  return (
    <Container fluid className="min-vh-100 py-5">
      <Container>
        <div
          className="text-center mb-4 p-3 text-white header-gradient d-flex flex-column justify-content-center align-items-center"
          style={{ minHeight: "200px" }}
        >
          <h1 className="display-3 fw-bold mb-3">
            <span style={{ fontSize: "3rem" }}>⏰</span> Timer
          </h1>
          <p
            className="lead mb-0"
            style={{ fontSize: "1.2rem", opacity: 0.95 }}
          >
            Focus on your tasks with our Pomodoro timer
          </p>
        </div>

        <DarkModeToggle />

        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            <Timer />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default TimerPage;
