# SHIROXBR - Fila de Reações

Plataforma para gerenciar fila de vídeos do Instagram e TikTok para reação ao vivo.

## 🚀 Setup Vercel KV (Persistência)

### Passo 1: Criar Database KV no Vercel

1. Acesse [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecione seu projeto **shiroxTTV**
3. Vá para a aba **Storage**
4. Clique em **Create** → **KV**
5. Nome: `shirox-queue`
6. Copie as credenciais

### Passo 2: Adicionar Variáveis de Ambiente

1. Na página do projeto, vá para **Settings** → **Environment Variables**
2. Adicione estas 4 variáveis (copie do painel KV):
   - `KV_URL`
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

3. Também adicione localmente no arquivo `.env.local`

### Passo 3: Deploy

```bash
npm install
npm run build
vercel deploy
```

Ou empurre o commit:
```bash
git add .
git commit -m "Setup Vercel KV"
git push origin master
```

## 🎯 Features

✅ Fila de vídeos persistente (Vercel KV)
✅ Suporte Instagram & TikTok
✅ Player integrado
✅ Marcar como reagido
✅ Expiração automática (3 dias)
✅ Sincronização em tempo real
✅ Interface responsiva

## 📝 Estrutura

```
app/
├── page.js          # Página principal (React)
├── layout.js        # Configuração
├── globals.css      # Estilos
└── api/
    └── videos/
        └── route.js # API (GET/POST/PATCH/DELETE)
```

## 🔧 Comandos

```bash
# Desenvolvimento local
npm run dev

# Build para produção
npm run build

# Iniciar servidor
npm start

# Lint
npm run lint
```

## 📊 API Endpoints

- `GET /api/videos` - Listar todos os vídeos
- `POST /api/videos` - Enviar novo vídeo
- `PATCH /api/videos` - Marcar como reagido
- `DELETE /api/videos` - Remover vídeo

## ⚙️ Variáveis de Ambiente

Adicionar no `.env.local`:

```env
KV_URL=<sua_url_kv>
KV_REST_API_URL=<sua_api_url>
KV_REST_API_TOKEN=<seu_token>
KV_REST_API_READ_ONLY_TOKEN=<seu_token_readonly>
```

## 🎨 Customização

Estilos CSS em `app/globals.css` com variáveis:
- `--purple: #9146FF` (cor principal)
- `--cyan: #00F5FF` (destaque)
- `--red: #FF4040` (ação perigosa)

## 📱 Responsivo

- ✅ Desktop
- ✅ Tablet
- ✅ Mobile

## 🆘 Troubleshooting

**Erro: "Can't reach KV"**
- Verifique variáveis de ambiente
- Redeploy no Vercel

**Vídeos desaparecem**
- Expiram após 3 dias (TTL padrão)
- Edite `TTL_SECONDS` em `app/api/videos/route.js`

**TikTok não carrega**
- Verifique se o link é válido
- Alguns vídeos privados podem não funcionar

## 📄 Licença

MIT
