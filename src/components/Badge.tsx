interface BadgeProps {
  label: string;
  variant?: "active" | "inactive";
}

export default function Badge({ label, variant = "active" }: BadgeProps) {
  return (
    <div className={`badge ${variant === 'active' ? 'badge-active' : 'badge-inactive'}`}>
      {label}
    </div>
  );
}
