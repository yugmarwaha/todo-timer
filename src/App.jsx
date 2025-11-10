import { Container, Row, Col } from "react-bootstrap";
import Timer from "./components/Timer";
import TodoList from "./components/TodoList";
import "./App.css";

function App() {
  return (
    <Container fluid className="min-vh-100 py-5">
      <Container>
        <div className="text-center mb-5 p-5 text-white header-gradient">
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

        <Row className="g-4 justify-content-center">
          <Col lg={3} md={4} sm={12} className="order-1">
            <Timer />
          </Col>
          <Col lg={6} md={8} sm={12} className="order-2">
            <TodoList />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default App;
