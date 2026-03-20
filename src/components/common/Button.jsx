import "./Button.css";

export default function Button({ children, variant = "primary", size = "md", onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn btn--${variant} btn--${size} ${className}`}
    >
      {children}
    </button>
  );
}
