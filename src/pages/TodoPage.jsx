import TodoList from "../components/TodoList";

function TodoPage() {
  return (
    <div className="page-wrapper fade-in">
      <div className="container">
        <div className="page-header">
          <h1>Task Manager</h1>
          <p>Organize your tasks and stay productive.</p>
        </div>

        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <TodoList />
        </div>
      </div>
    </div>
  );
}

export default TodoPage;
