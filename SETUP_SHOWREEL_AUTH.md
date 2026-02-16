# 🔐 Setup Showreel Authentication

Questa guida ti aiuta a configurare il sistema di autenticazione backend per la showreel.

## 📋 Prerequisiti

- Account GitHub (già lo hai)
- Account Vercel (gratuito): https://vercel.com/signup
- Node.js installato (opzionale, solo per generare hash localmente)

## 🚀 Setup Passo-Passo

### 1. Deploy su Vercel

1. **Vai su Vercel**: https://vercel.com
2. **Clicca "Import Project"**
3. **Connetti il tuo repository GitHub**
4. **Seleziona il repo del portfolio**
5. **Clicca "Deploy"** (prima volta senza env variables va bene)

### 2. Genera l'Hash della Password

**Opzione A - Locale (se hai Node.js):**

```bash
node generate-password-hash.js "TuaPasswordSegreta123!"
```

**Opzione B - Online:**

Usa questo tool: https://emn178.github.io/online-tools/sha256.html
- Input: la tua password desiderata
- Output: copia l'hash generato

**Opzione C - Browser Console:**

```javascript
// Apri DevTools (F12) → Console → Incolla questo:
async function generateHash(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    console.log('Hash:', hashHex);
}

generateHash('TuaPasswordQui');
```

### 3. Configura Variabili d'Ambiente su Vercel

1. **Vai su Vercel Dashboard** → Il tuo progetto
2. **Settings** → **Environment Variables**
3. **Aggiungi queste variabili:**

| Name                      | Value                                           |
|---------------------------|-------------------------------------------------|
| `SHOWREEL_PASSWORD_HASH`  | (l'hash generato nello step 2)                  |
| `SHOWREEL_VIDEO_ID`       | `yk6dA3tnU8g` (o il tuo video ID YouTube)       |

4. **Environment**: Seleziona `Production`, `Preview`, `Development` (tutte e 3)
5. **Clicca "Save"**

### 4. Re-deploy

1. **Deployments** → Clicca sui tre puntini dell'ultimo deploy
2. **Redeploy** (questo applica le env variables)
3. Attendi che il deploy finisca (~30 secondi)

### 5. Configura Dominio Personalizzato (Opzionale)

1. **Settings** → **Domains**
2. **Add Domain** → Inserisci il dominio che hai acquistato
3. Segui le istruzioni per configurare i DNS

Vercel ti darà:
- Record A o CNAME da aggiungere nel pannello del tuo domain provider
- SSL automatico (HTTPS gratuito)

## 🧪 Testare il Sistema

1. Vai sul sito deployato
2. Clicca sul bottone "ShowReel"
3. Inserisci la password
4. Se corretta → il video si carica
5. Se errata → mostra errore

### Test Rate Limiting

Prova a inserire password errata 6 volte consecutive:
- Dopo 5 tentativi falliti riceverai errore "Too many attempts"
- Dovrai aspettare 15 minuti prima di riprovare

## 🔒 Sicurezza Implementata

✅ **Password hashata** - La password non è mai salvata in chiaro
✅ **Rate limiting** - Max 5 tentativi ogni 15 minuti per IP
✅ **HTTPS** - Comunicazione criptata (auto con Vercel)
✅ **Env variables** - Segreti mai committati su GitHub
✅ **Server-side validation** - Nessun check client-side

## 📝 Note Importanti

- **La password NON è più hardcoded nel codice**
- **L'hash è irreversibile** - se perdi la password originale, devi generare un nuovo hash
- **Rate limiting è in-memory** - si resetta ad ogni deploy (per un uso base va bene)
- **YouTube video rimane tecnicamente pubblico** - ma l'ID è nascosto dal codice

## 🆘 Troubleshooting

### "Server configuration error"
- Le env variables non sono configurate correttamente
- Verifica che `SHOWREEL_PASSWORD_HASH` sia presente su Vercel
- Fai re-deploy

### "Too many attempts"
- Hai superato 5 tentativi falliti
- Aspetta 15 minuti o usa una VPN/rete diversa
- In sviluppo: riavvia il server locale

### "Connection error"
- Problema di rete o API non raggiungibile
- Controlla che `/api/verify-showreel` sia deployato correttamente
- Verifica in DevTools → Network tab

## 🎯 Prossimi Passi (Opzionali)

Per rendere il sistema ancora più robusto:

1. **Database per logging**
   - Traccia accessi (timestamp, IP anonimizzato)
   - Monitoring tentativi falliti

2. **Vimeo invece di YouTube**
   - Controllo completo sulla privacy
   - Domain whitelist
   - Nessun embed non autorizzato

3. **2FA o Magic Link**
   - Invio link temporaneo via email
   - Autenticazione senza password

4. **Analytics Dashboard**
   - Quante persone accedono
   - Quando viene visto il reel

---

**Fatto! 🎉** Il tuo sistema di autenticazione è pronto.

Per domande: controlla i log su Vercel Dashboard → Deployments → Function Logs
