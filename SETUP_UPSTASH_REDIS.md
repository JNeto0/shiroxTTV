# 🚀 Setup Upstash Redis - Passo a Passo

Siga estes passos para ativar a persistência de dados no seu projeto com Upstash Redis.

---

## PASSO 1: Integrar Upstash no Vercel

1. Vá para **https://vercel.com/integrations/upstash**
2. Clique em **Add Integration**
3. Selecione seu projeto **shiroxTTV**
4. Clique em **Connect**
5. Authorize a integração

---

## PASSO 2: Criar Database Redis no Upstash

1. Após integrar, vá para **https://console.upstash.com**
2. Faça login (use sua conta Google/GitHub)
3. Clique em **Redis** (no menu lateral)
4. Clique em **Create Database**
5. Preencha:
   - **Name**: `shirox-queue`
   - **Region**: Escolha a mais próxima (São Paulo ou us-east-1)
   - **Type**: Serverless Redis
6. Clique **Create**

---

## PASSO 3: Copie as Credenciais

Depois que o database for criado:

1. Procure por **REST API** (tab superior)
2. Copie exatamente:
   - `UPSTASH_REDIS_REST_URL` (a URL inteira)
   - `UPSTASH_REDIS_REST_TOKEN` (o token)

**Exemplo:**
```
UPSTASH_REDIS_REST_URL=https://xxx-xxx-xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AxxxYYYzzz...
```

---

## PASSO 4: Adicione as Variáveis no Vercel

1. Vá para seu projeto no Vercel: **https://vercel.com/dashboard**
2. Clique em seu projeto **shiroxTTV**
3. Vá para **Settings** (engrenagem no topo)
4. Procure **Environment Variables** (menu lateral esquerdo)
5. Para cada variável:
   - Clique **Add New**
   - Nome: `UPSTASH_REDIS_REST_URL`
   - Valor: Cole a URL copiada
   - Selecione **Production** e **Preview**
   - Clique **Add**
6. Repita para a segunda variável (`UPSTASH_REDIS_REST_TOKEN`)

Você deve ter:
- ✅ UPSTASH_REDIS_REST_URL
- ✅ UPSTASH_REDIS_REST_TOKEN

---

## PASSO 5: Redeploy o Projeto

1. Na página do projeto Vercel, vá para **Deployments** (tab superior)
2. Encontre o último deploy (mais recente)
3. Clique nos **3 pontinhos** (...)
4. Selecione **Redeploy**
5. Confirme

Aguarde o deploy terminar (leva 2-3 minutos). Status deve ficar verde.

---

## PASSO 6: Teste!

1. Vá para seu site (https://shiroxttv.vercel.app)
2. Teste enviando um vídeo
3. **Recarregue a página** (F5 ou Ctrl+R)
4. O vídeo deve estar lá! ✅

Se desaparecer, as credenciais ainda não foram conectadas.

---

## ⚠️ Troubleshooting

**Problema: "Não consigo adicionar as variáveis"**
- Certifique-se de estar em **Settings**, não em **Environment**
- Selecione **Production** ao adicionar

**Problema: "Vídeos ainda desaparecem após recarregar"**
- Verifique se o deploy completou (aguarde 5 minutos)
- Limpe o cache do navegador (Ctrl+Shift+Delete)
- Tente novamente

**Problema: "Site mostra erro 500"**
- Verifique as variáveis de ambiente estão corretas
- Volte aos **Deployments**
- Clique no deploy com erro
- Procure a aba **Logs** para ver o erro

**Problema: "Conexão recusada ao Upstash"**
- Verifique se a URL está completa
- Verifique se o token está correto
- Teste a conexão em: https://console.upstash.com

---

## 📞 Dúvidas?

Se travou em algum passo:
1. Tire um screenshot
2. Descreva aonde está travado
3. Compartilhe comigo

Estou pronto para ajudar!
