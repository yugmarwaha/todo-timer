import { Container, Row, Col } from "react-bootstrap";
import TodoList from "../components/TodoList";

function TodoPage() {
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
            background: "var(--card-bg)",
            borderRadius: "8px",
            boxShadow: "var(--card-shadow)",
            color: "var(--text-primary)",
          }}
        >
          <h1 className="display-3 fw-bold mb-3">
            <span style={{ fontSize: "2rem" }}>📝</span> Todo List
          </h1>
          <p
            className="lead mb-0"
            style={{ fontSize: "1.2rem", opacity: 0.95 }}
          >
            Organize your tasks and stay productive
          </p>
        </div>

        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            <TodoList />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default TodoPage;
