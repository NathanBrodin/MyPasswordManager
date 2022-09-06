import logo from '../logo.svg';
import './Options.css';

export default function Options() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Options not developed yet
        </p>
        <a
          className="App-link"
          href="https://github.com/NathanBrodin/MyPasswordManager"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to MyPasswordManager Github
        </a>
      </header>
    </div>
  );
}
