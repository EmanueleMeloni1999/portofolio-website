# 🎨 Emanuele Meloni - Portfolio

Portfolio professionale per **3D Rigger | Pipeline TD | Technical Animator**

**Live Demo**: [Il tuo dominio]

## ✨ Features

- 🎬 Showreel protetta con autenticazione backend
- 📱 Design responsive (mobile, tablet, desktop)
- ⚡ Performance ottimizzate
- 🔒 Sicurezza: password hashate, rate limiting
- 🎯 SEO-friendly
- ♿ Accessibile

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla)
- Responsive design con CSS Grid/Flexbox
- Animazioni CSS custom

**Backend:**
- Vercel Serverless Functions (Node.js)
- SHA-256 password hashing
- In-memory rate limiting

**Deploy:**
- Vercel (hosting + serverless)
- GitHub (version control)
- Custom domain support

## 🚀 Local Development

1. **Clone repository:**
   ```bash
   git clone https://github.com/tuousername/portfolio.git
   cd portfolio
   ```

2. **Open in browser:**
   ```bash
   # Opzione 1: Python
   python -m http.server 8000

   # Opzione 2: Node.js
   npx serve
   ```

3. **Test API locale** (richiede Vercel CLI):
   ```bash
   npm install -g vercel
   vercel dev
   ```

## 🔐 Setup Showreel Authentication

Vedi [SETUP_SHOWREEL_AUTH.md](SETUP_SHOWREEL_AUTH.md) per la guida completa.

**Quick Start:**

1. Deploy su Vercel
2. Genera hash password:
   ```bash
   node generate-password-hash.js "TuaPassword123"
   ```
3. Aggiungi env variables su Vercel:
   - `SHOWREEL_PASSWORD_HASH`
   - `SHOWREEL_VIDEO_ID`
4. Re-deploy

## 📁 Project Structure

```
portfolio/
├── api/
│   └── verify-showreel.js    # Serverless function per auth
├── assets/
│   ├── images/               # Immagini statiche
│   ├── sprites/              # Sprite animations
│   └── documents/            # CV, docs
├── data/
│   ├── projects.json         # Progetti professionali
│   ├── career.json           # Esperienze lavorative
│   ├── teaching.json         # Teaching experiences
│   ├── personal-work.json    # Progetti personali
│   └── skills.json           # Skills e software
├── scripts/
│   ├── main.js               # Main JavaScript
│   └── interactions.js       # UI interactions
├── styles/
│   └── main.css              # Tutti gli stili
├── index.html                # Homepage
├── vercel.json               # Vercel configuration
└── generate-password-hash.js # Utility per hash password
```

## 🔒 Security

- ✅ Password hashate (SHA-256)
- ✅ Rate limiting (5 tentativi / 15 min)
- ✅ HTTPS (Vercel auto-SSL)
- ✅ Environment variables (no secrets in code)
- ✅ Server-side validation
- ✅ CORS configurato

## 📝 License

© 2026 Emanuele Meloni. All rights reserved.

## 📧 Contact

- Email: emanuele.meloni1999@gmail.com
- LinkedIn: [linkedin.com/in/emanuelemeloni99](https://www.linkedin.com/in/emanuelemeloni99/)
- IMDb: [Emanuele Meloni](https://www.imdb.com/it/name/nm14947573/)

---

Made with ❤️ by Emanuele Meloni
