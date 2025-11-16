import { Container, Row, Col } from "react-bootstrap";
import TodoList from "../components/TodoList";
import DarkModeToggle from "../components/DarkModeToggle";

function TodoPage() {
  return (
    <Container fluid className="min-vh-100 py-5">
      <Container>
        <div
          className="text-center mb-4 p-3 text-white header-gradient d-flex flex-column justify-content-center align-items-center"
          style={{ minHeight: "200px" }}
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

        <DarkModeToggle />

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
