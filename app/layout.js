import './globals.css';

export const metadata = {
  title: 'SHIROXBR — Fila de Reações',
  description: 'Envie vídeos do Instagram e TikTok para o Shirox reagir na live!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="page-container">
          {children}
          <footer className="footer">
            <p>Desenvolvido por <a href="https://instagram.com/jneto.01" target="_blank" rel="noopener noreferrer">jneto.01</a></p>
          </footer>
        </div>
      </body>
    </html>
  );
}
