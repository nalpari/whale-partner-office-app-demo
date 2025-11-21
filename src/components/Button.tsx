interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export default function Button({ children, onClick, variant = "primary" }: ButtonProps) {
  return (
    <button 
      className={variant === "primary" ? "btn-primary" : "btn-secondary"}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
