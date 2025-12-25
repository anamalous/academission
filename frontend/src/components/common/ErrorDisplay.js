import './common.css';

const ErrorDisplay = ({ message, onRetry }) => (
  <div className="universal-error">
    <h3>Something went wrong</h3>
    <p>{message || "We couldn't load the data."}</p>
    {onRetry && (
      <button onClick={onRetry} className="retry-btn">
        Try Again
      </button>
    )}
  </div>
);

export default ErrorDisplay;