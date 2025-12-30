import './common.css';

const ErrorDisplay = ({ message }) => (
  <div className="universal-error">
    <h3>Something went wrong</h3>
    <p>{message || "We couldn't load the data."}</p>
  </div>
);

export default ErrorDisplay;