# 🚀 Setup Vercel KV - Passo a Passo

Siga estes passos para ativar a persistência de dados no seu projeto.

---

## PASSO 1: Acesse o Vercel Dashboard

1. Vá para **https://vercel.com/dashboard**
2. Faça login com sua conta
3. Procure por um projeto chamado **shiroxTTV** (ou crie um se não tiver)
4. Clique nele para abrir

---

## PASSO 2: Crie um Database KV

1. Na página do projeto, procure a aba **Storage** (ou **Databases**)
2. Clique em **Create Database** ou **+ Create**
3. Escolha **Vercel KV**
4. Preencha:
   - **Name**: `shirox-queue`
   - **Region**: Escolha a mais próxima do Brasil (São Paulo/us-east-1)
5. Clique **Create**

---

## PASSO 3: Copie as Credenciais

Depois que o KV for criado, você verá um painel com as credenciais:

```
KV_URL=redis://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=xxx
KV_REST_API_READ_ONLY_TOKEN=xxx
```

**Copie exatamente como aparecem** (você pode clicar em "Copy")

---

## PASSO 4: Adicione as Variáveis no Vercel

1. Na página do projeto, vá para **Settings** (engrenagem no topo)
2. Procure **Environment Variables** (no menu lateral esquerdo)
3. Cole cada uma das 4 variáveis:
   - Cole o nome (ex: `KV_URL`)
   - Cole o valor
   - Selecione **Production** e **Preview**
   - Clique **Add**
4. Repita para as 4 variáveis

Você deve ter:
- ✅ KV_URL
- ✅ KV_REST_API_URL
- ✅ KV_REST_API_TOKEN
- ✅ KV_REST_API_READ_ONLY_TOKEN

---

## PASSO 5: Redeploy o Projeto

1. Vá para aba **Deployments** (no topo)
2. Encontre o último deploy (mais recente)
3. Clique nos 3 pontinhos **...**
4. Selecione **Redeploy**
5. Confirme

Aguarde o deploy terminar (leva 2-3 minutos).

---

## PASSO 6: Teste!

Vá para seu site (https://shiroxttv.vercel.app) e teste:

1. ✅ Enviar um vídeo
2. ✅ Verificar que aparece na fila
3. ✅ Atualizar a página (o vídeo permanece!)

Se o vídeo sumiu, é porque as credenciais ainda não foram conectadas.

---

## ⚠️ Troubleshooting

**Problema: "Não consigo salvar as variáveis"**
- Certifique-se de estar em **Settings**, não em **Environment**
- Selecione **Production** ao adicionar

**Problema: "Vídeos ainda desaparecem"**
- Verifique se o deploy completou (status verde)
- Limpe o cache do navegador (Ctrl+Shift+Delete)
- Tente novamente

**Problema: "Sites mostra erro"**
- Volte aos **Deployments**
- Clique no deploy com erro
- Procure a aba **Logs** para ver o erro
- Compartilhe o erro comigo se não conseguir resolver

---

## 📞 Dúvidas?

Se travou em algum passo:
1. Screnshot do que vê
2. Descreva aonde está travado
3. Compartilhe comigo

Estou pronto para ajudar!
