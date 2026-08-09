export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-2xl px-5 py-8 text-sm text-muted">
        <p>© {year} 个人博客.</p>
      </div>
    </footer>
  );
}
