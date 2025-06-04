import Header from "~/components/Header";
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
      <Header />
      <div className="flex h-screen flex-col items-center justify-center">
        {children}
      </div>
    </main>
  );
}
