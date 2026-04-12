"use client";

import * as React from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../primitives/tooltip";

interface DTooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
}

export function DTooltip({ content, children }: DTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
}
