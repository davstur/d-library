type DCheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "className">;

export function DCheckbox({ id, children, ...props }: DCheckboxProps) {
  const checkbox = (
    <input
      type="checkbox"
      id={id}
      className="h-4 w-4 rounded border-foreground/30 accent-primary focus:ring-primary"
      {...props}
    />
  );

  if (children) {
    return (
      <label htmlFor={id} className="flex items-center gap-2 cursor-pointer select-none">
        {checkbox}
        {children}
      </label>
    );
  }

  return checkbox;
}
