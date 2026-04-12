export function DSlider(props: Omit<React.ComponentProps<"input">, "type" | "className">) {
  return (
    <input
      type="range"
      className="w-full accent-primary"
      {...props}
    />
  );
}
