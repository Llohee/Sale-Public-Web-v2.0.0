export default async function EndUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
      {children}
    </div>
  );
}
