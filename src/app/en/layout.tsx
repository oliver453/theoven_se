import { englishMetadata } from "../metadata";
import type { Metadata } from "next";

export const metadata: Metadata = englishMetadata;

export default function EnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}