# SHIROXBR - Fila de Reações

Plataforma para gerenciar fila de vídeos do Instagram e TikTok para reação ao vivo.

## 🚀 Setup Upstash Redis (Persistência)

### Passo 1: Integrar Upstash no Vercel

1. Acesse [https://vercel.com/integrations/upstash](https://vercel.com/integrations/upstash)
2. Clique em **Add Integration**
3. Selecione seu projeto **shiroxTTV**
4. Clique em **Connect**

### Passo 2: Criar Database Redis

1. Após integrar, vá para https://console.upstash.com
2. Clique em **Redis** → **Create Database**
3. Preencha:
   - **Name**: `shirox-queue`
   - **Region**: Escolha a mais próxima (São Paulo)
4. Clique **Create**

### Passo 3: Copiar Credenciais

1. Na página do database, procure por:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
2. Copie essas 2 credenciais

### Passo 4: Adicionar no Vercel

1. Vá para seu projeto no Vercel
2. **Settings** → **Environment Variables**
3. Cole as 2 credenciais:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Selecione **Production** e **Preview**
5. Clique **Add**

### Passo 5: Redeploy

1. Vá para **Deployments**
2. Clique no último deploy
3. Clique em **...**
4. Selecione **Redeploy**

---

## 🎯 Features

✅ Fila de vídeos persistente (Upstash Redis)
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
UPSTASH_REDIS_REST_URL=<sua_url>
UPSTASH_REDIS_REST_TOKEN=<seu_token>
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

**Erro: "Can't connect to Redis"**
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
