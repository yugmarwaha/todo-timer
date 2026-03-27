import Timer from "../components/Timer";
import Quotes from "../components/Quotes";
import TaskSelector from "../components/TaskSelector";

function TimerPage() {
  return (
    <div className="page-wrapper fade-in">
      <div className="container">
        <div className="page-header">
          <h1>Productivity Timer</h1>
          <p>Set a timer and stay focused on what matters.</p>
        </div>

        <div className="timer-layout">
          <div>
            <Timer />
            <div className="mt-4">
              <Quotes />
            </div>
          </div>

          <div>
            <TaskSelector />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimerPage;
