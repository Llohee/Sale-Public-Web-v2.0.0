import { EndUserLayoutClient } from "@/share/layout/end-user/layout";

export default function EndUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EndUserLayoutClient>{children}</EndUserLayoutClient>;
}
