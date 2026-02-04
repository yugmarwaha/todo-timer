import { Container, Row, Col } from "react-bootstrap";
import TodoList from "../components/TodoList";

function TodoPage() {
  return (
    <div className="page-wrapper">
      <Container>
        <div className="page-header">
          <h1>Task Manager</h1>
          <p>Organize your tasks and stay productive.</p>
        </div>

        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            <TodoList />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default TodoPage;
