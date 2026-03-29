import './globals.css';

export const metadata = {
  title: 'SHIROXBR — Fila de Reações',
  description: 'Envie vídeos do Instagram e TikTok para o Shirox reagir na live!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
