import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journey | Anchor Mill Group",
  description:
    "Explore integrated resilience, protection, and performance for UHNW families, family offices, and global executives.",
};

export default function JourneyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
