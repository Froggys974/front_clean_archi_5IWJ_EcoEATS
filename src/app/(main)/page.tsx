import Header from "@/components/home/Header";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full flex-col items-center justify-between sm:items-start">
        <Header title="Une petite faim ?" subtitle="En quelques clics, trouvez des repas proches de chez vous" />
      </main>
    </div>
  );
}

