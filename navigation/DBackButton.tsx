import * as React from "react";
import { DButton } from "../ui/DButton";
import { ArrowLeft } from "lucide-react";

interface DBackButtonProps {
  href: string;
  label?: string;
  /**
   * Link component to use for navigation. Defaults to a plain <a> tag.
   * Pass Next.js `Link` from "next/link" when used in a Next.js project.
   */
  linkComponent?: React.ComponentType<{
    href: string;
    children: React.ReactNode;
    "aria-label"?: string;
  }>;
}

const DefaultLink = ({
  href,
  children,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  "aria-label"?: string;
}) => (
  <a href={href} {...props}>
    {children}
  </a>
);

export function DBackButton({
  href,
  label,
  linkComponent: LinkComp = DefaultLink,
}: DBackButtonProps) {
  return (
    <DButton variant="subtle" size="icon" asChild>
      <LinkComp href={href} aria-label={label || "Go back"}>
        <ArrowLeft className="h-5 w-5" />
      </LinkComp>
    </DButton>
  );
}
