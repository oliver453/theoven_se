// src/components/providers/ToastProvider.tsx
"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'rgb(0 0 0 / 0.9)',
          border: '2px solid rgb(75 85 99 / 0.5)',
          color: 'white',
          backdropFilter: 'blur(8px)',
        },
        className: 'border-2',
        duration: 5000,
      }}
      theme="dark"
      richColors
    />
  );
}