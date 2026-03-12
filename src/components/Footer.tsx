export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-white/5 py-8">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Alex Johnson. Built with Next.js & TypeScript.
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <span>Made with</span>
            <span className="text-red-400">♥</span>
            <span>and lots of coffee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
