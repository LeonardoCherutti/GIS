export default function AppFooter() {
  return (
    <footer className="py-4 px-6 bg-surface border-t border-border text-center">
      <p className="text-sm text-muted-fg">
        G.I.S. Gestao Inteligente em Saude &copy; {new Date().getFullYear()}
      </p>
    </footer>
  )
}
