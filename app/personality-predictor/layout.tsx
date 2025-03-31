import { ReactNode } from "react";
import { metadata, viewport } from "./metadata";

export { metadata, viewport };

export default function PersonalityPredictorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
