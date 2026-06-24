# Madhav Portfolio — Next.js

A premium, game-style portfolio built with Next.js, Three.js, Framer Motion, and GLSL shaders.

## Stack
- **Framework**: Next.js 14 (App Router)
- **3D / Canvas**: Three.js, WebGL GLSL shader
- **Animation**: Framer Motion, CSS animations
- **Styling**: Tailwind CSS + Vanilla CSS
- **Analytics**: Custom `Analysis.html` served via route handler

## Features
- 🌌 Interactive Three.js neural canvas + GLSL ripple shader
- 🎮 Game-HUD navigation with floating nodes
- 💥 Click shockwave ripple effect
- 🃏 3D card tilt on project cards
- 🔐 Password-protected admin panel
- 📊 Academic analytics dashboard
- ✨ Custom cursor with hover expand
- 🟢 Persistent HUD footer

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file:

```env
ADMIN_PASSWORD=your-secret-password
```

> **Never commit `.env.local`** — it is gitignored.

## Admin Panel

The `/admin` route is protected by a password gate.  
Default local password: set in `.env.local`  
On Vercel: add `ADMIN_PASSWORD` in Project Settings → Environment Variables.

## Deployment

Deployed on **Vercel** with automatic GitHub integration.  
Framework preset: **Next.js** (auto-detected).
