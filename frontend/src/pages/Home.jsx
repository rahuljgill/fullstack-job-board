import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-text-primary">
      <Navbar />

      {/* Hero */}
      <section className="bg-ui-light py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">
            Find your next <span className="text-brand">dream job</span>
          </h1>
          <p className="text-lg max-w-2xl">
            Browse thousands of opportunities from top companies and apply in
            one click.
          </p>
        </div>
      </section>
    </div>
  );
}
