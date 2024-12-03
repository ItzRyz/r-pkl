import type { Metadata } from "next";
export const metadata: Metadata = {
  title: {
    default: "Group",
    template: "%s",
  },
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
