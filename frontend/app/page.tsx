import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950 px-4">
      <main className="flex flex-col items-center text-center max-w-4xl space-y-12">
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold text-2xl">N</span>
          </div>
          <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">NotesApp</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1]">
            Capture your thoughts, <br />
            <span className="text-indigo-600">beautifully.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-zinc-600 dark:text-zinc-400">
            The next generation note-taking app. Simple, fast, and elegantly designed for modern thinkers.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/login"
            className="flex h-14 items-center justify-center rounded-2xl bg-indigo-600 px-10 text-lg font-semibold text-white shadow-xl shadow-indigo-500/20 transition-all hover:bg-indigo-500 hover:-translate-y-1 active:scale-95"
          >
            Get Started
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            className="flex h-14 items-center justify-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-10 text-lg font-semibold text-zinc-900 dark:text-zinc-50 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            Learn More
          </a>
        </div>

        <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-8 text-zinc-400 dark:text-zinc-600 font-medium text-sm">
          <div className="flex flex-col items-center gap-2">
            <span className="text-zinc-900 dark:text-zinc-50 text-xl font-bold">100%</span>
            <span>Secure</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-zinc-900 dark:text-zinc-50 text-xl font-bold">Fast</span>
            <span>Sync</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-zinc-900 dark:text-zinc-50 text-xl font-bold">Cloud</span>
            <span>Based</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-zinc-900 dark:text-zinc-50 text-xl font-bold">Free</span>
            <span>Always</span>
          </div>
        </div>
      </main>
    </div>
  );
}
