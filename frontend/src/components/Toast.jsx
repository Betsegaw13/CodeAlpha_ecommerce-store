import { CheckIcon } from "./Icons";

function Toast({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="toast" role="status">
      <span className="toast-check">
        <CheckIcon />
      </span>

      <span>{message}</span>
    </div>
  );
}

export default Toast;