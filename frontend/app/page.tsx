import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 transition-colors selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-zinc-100 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="text-xl font-bold tracking-tight">NotesApp</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold hover:text-indigo-600 transition-colors">Log in</Link>
            <Link 
              href="/signup" 
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 px-6 overflow-hidden">
          {/* Background Blobs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full -z-10 opacity-30 dark:opacity-20 pointer-events-none">
            <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-300 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 rounded-full blur-[120px] animate-pulse delay-700"></div>
          </div>

          <div className="max-w-7xl mx-auto text-center space-y-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              v2.0 is now live
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-500">
              Your thoughts, <br className="hidden md:block" />
              <span className="text-indigo-600">Perfectly Organized.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              The workspace where ideas turn into reality. Simple, fast, and secure note-taking for the modern era.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
              <Link
                href="/signup"
                className="group relative flex h-16 items-center justify-center rounded-2xl bg-indigo-600 px-12 text-lg font-bold text-white shadow-2xl shadow-indigo-500/40 transition-all hover:bg-indigo-500 hover:-translate-y-1 active:scale-95 w-full sm:w-auto overflow-hidden"
              >
                <span className="relative z-10">Start Writing for Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
              </Link>
              <a
                href="#features"
                className="flex h-16 items-center justify-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm px-12 text-lg font-bold transition-all hover:bg-white dark:hover:bg-zinc-800 w-full sm:w-auto"
              >
                Explore Features
              </a>
            </div>

            {/* Dashboard Preview Placeholder */}
            <div className="mt-20 relative max-w-5xl mx-auto rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-3 shadow-2xl backdrop-blur-sm group hover:scale-[1.01] transition-transform duration-700">
              <div className="aspect-[16/10] bg-zinc-100 dark:bg-zinc-800 rounded-2xl overflow-hidden relative border border-zinc-200 dark:border-zinc-800">
                 {/* This would be an image or interactive preview */}
                 <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
                    <div className="grid grid-cols-3 gap-4 w-full p-8 opacity-50">
                       {[1,2,3,4,5,6].map(i => (
                         <div key={i} className="h-40 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800"></div>
                       ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="px-6 py-3 bg-white dark:bg-zinc-900 rounded-full shadow-xl border border-zinc-200 dark:border-zinc-800 font-bold flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Dashboard Preview
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 px-6 bg-zinc-50 dark:bg-zinc-900/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black">Everything you need.</h2>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">Powering your productivity with modern tools.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Blazing Fast", desc: "Built on Hono and Next.js for sub-millisecond responses.", icon: "⚡" },
                { title: "SQLite Powered", desc: "Local-first mindset with cloud persistence for your data.", icon: "📦" },
                { title: "Secure by Default", desc: "End-to-end encrypted sessions and secure password hashing.", icon: "🔒" },
                { title: "Real-time Sync", desc: "Your notes are always up to date across all your devices.", icon: "🔄" },
                { title: "Rich Markdown", desc: "Express yourself with full markdown support and formatting.", icon: "📝" },
                { title: "Dark Mode", desc: "Native dark mode support that's easy on your eyes.", icon: "🌙" }
              ].map((f, i) => (
                <div key={i} className="p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                  <div className="text-4xl mb-6">{f.icon}</div>
                  <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6">
          <div className="max-w-5xl mx-auto rounded-[3rem] bg-indigo-600 p-12 md:p-24 text-center space-y-10 relative overflow-hidden shadow-2xl shadow-indigo-500/20">
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
             <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>
             
             <h2 className="text-4xl md:text-6xl font-black text-white relative z-10">Ready to start <br /> your journey?</h2>
             <p className="text-xl text-indigo-100 max-w-xl mx-auto font-medium relative z-10">Join thousands of thinkers using NotesApp to organize their life.</p>
             <div className="relative z-10 pt-4">
               <Link
                 href="/signup"
                 className="inline-flex h-16 items-center justify-center rounded-2xl bg-white px-12 text-lg font-bold text-indigo-600 shadow-xl hover:bg-zinc-50 hover:scale-105 active:scale-95 transition-all"
               >
                 Get Started for Free
               </Link>
             </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 dark:border-zinc-800 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6 max-w-sm">
             <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <span className="text-lg font-bold tracking-tight">NotesApp</span>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                The world's best note-taking experience. Built with love for developers and designers.
              </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24">
             <div className="space-y-4">
                <h4 className="font-bold">Product</h4>
                <ul className="space-y-2 text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                   <li><a href="#" className="hover:text-indigo-600 transition-colors">Features</a></li>
                   <li><a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a></li>
                   <li><a href="#" className="hover:text-indigo-600 transition-colors">Download</a></li>
                </ul>
             </div>
             <div className="space-y-4">
                <h4 className="font-bold">Company</h4>
                <ul className="space-y-2 text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                   <li><a href="#" className="hover:text-indigo-600 transition-colors">About</a></li>
                   <li><a href="#" className="hover:text-indigo-600 transition-colors">Blog</a></li>
                   <li><a href="#" className="hover:text-indigo-600 transition-colors">Careers</a></li>
                </ul>
             </div>
             <div className="space-y-4">
                <h4 className="font-bold">Social</h4>
                <ul className="space-y-2 text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                   <li><a href="#" className="hover:text-indigo-600 transition-colors">Twitter</a></li>
                   <li><a href="#" className="hover:text-indigo-600 transition-colors">GitHub</a></li>
                   <li><a href="#" className="hover:text-indigo-600 transition-colors">Discord</a></li>
                </ul>
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-100 dark:border-zinc-800 text-sm text-zinc-400 font-medium flex justify-between items-center">
           <p>© 2026 NotesApp. All rights reserved.</p>
           <div className="flex gap-6">
              <a href="#" className="hover:text-zinc-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-zinc-900 transition-colors">Terms</a>
           </div>
        </div>
      </footer>
    </div>
  );
}
