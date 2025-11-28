import { Container } from "react-bootstrap";
import Timer from "../components/Timer";
import "./TimerPage.css";

function TimerPage() {
  return (
    <div className="timer-page">
      <Container>
        <div className="timer-hero">
          <h1 className="timer-title">
            <span className="timer-icon">⏰</span>
            Pomodoro Timer
          </h1>
          <p className="timer-subtitle">Stay focused, stay productive</p>
        </div>

        <div className="timer-container">
          <Timer showHero={true} />
        </div>
      </Container>
    </div>
  );
}

export default TimerPage;
