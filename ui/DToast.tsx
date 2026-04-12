"use client";

import { Toaster } from "../primitives/sonner";

export function DToast() {
  return (
    <Toaster
      position="top-center"
      offset={56}
      duration={5000}
      toastOptions={{
        className: "font-sans",
      }}
    />
  );
}
