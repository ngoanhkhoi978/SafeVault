<div align="center">

# 🛡️ SafeVault

**Encrypt and decrypt your data locally in the browser.**

Built with Argon2id + AES-256-GCM. No servers. No uploads. No tracking.

[![License: MIT](https://img.shields.io/badge/License-MIT-A78BFA.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6.svg)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg)](https://vite.dev)

[English](#-overview) · [Tiếng Việt](#-tổng-quan)

</div>

---

## ✨ Overview

SafeVault is a modern web application for encrypting and decrypting data **entirely in the browser**. All encryption and decryption happens on the client side — no backend, no database, no data ever leaves your machine.

Designed to feel like a **real product** rather than a technical demo, inspired by modern startup tools like Linear, Arc Browser, and Raycast.

---

## 🌐 Demo

SafeVault is available online:

> https://safe-vault-sigma.vercel.app/

---

## 🎯 Features

| Feature | Description |
|---------|-------------|
| 🔐 **Text Encryption** | Enter text → encrypt with password → get base64 ciphertext |
| 📄 **File Encryption** | Upload or drag & drop any file → encrypt → download `.enc` file |
| 🔓 **Text Decryption** | Paste ciphertext → enter password → recover original text |
| 📂 **File Decryption** | Upload `.enc` file → enter password → download original file |
| 🌙 **Dark Mode** | Auto-detects OS theme, manual toggle, persisted to localStorage |
| 📋 **Copy & Download** | Copy results to clipboard or download as file |
| 🖱️ **Drag & Drop** | Drag files directly into the upload zone |
| ⚡ **Processing Time** | Measures and displays encryption / decryption duration |

---

## 🔒 Security

### Key Derivation — Argon2id

Argon2id is the winner of the [Password Hashing Competition](https://www.password-hashing.net/), designed to resist brute-force attacks using GPUs and ASICs.

| Parameter | Value |
|-----------|-------|
| Algorithm | Argon2id |
| Memory Cost | 65,536 KB (64 MB) |
| Iterations | 3 |
| Parallelism | 1 |
| Output Length | 32 bytes |

### Encryption — AES-256-GCM

AES-256-GCM provides authenticated encryption (confidentiality + integrity), widely used in TLS, IPSec, and modern security systems.

| Parameter | Value |
|-----------|-------|
| Algorithm | AES-256-GCM |
| Salt | 16 bytes (random per encryption) |
| IV | 12 bytes (random per encryption) |
| Key Source | Derived from Argon2id |

Salt and IV are generated using `crypto.getRandomValues()` (Web Crypto API).

### Security Guarantees

- ✅ **Zero-knowledge** — No server ever receives your data
- ✅ **No network requests** — The app makes zero outbound requests
- ✅ **Strong KDF** — Argon2id with 64 MB memory cost resists brute-force effectively
- ✅ **Authenticated encryption** — AES-256-GCM ensures both confidentiality and integrity
- ✅ **Unique salt + IV** — Every encryption uses freshly random salt and IV
- ✅ **Native crypto** — Uses the browser's Web Crypto API, not a pure JS library

### File Format

Encrypted `.enc` files use a custom binary format:

```
┌──────────┬─────────┬──────────┬──────────┬─────────────┐
│  "SAFE"  │  "01"   │   Salt   │    IV    │ Ciphertext  │
│ 4 bytes  │ 2 bytes │ 16 bytes │ 12 bytes │  Variable   │
└──────────┴─────────┴──────────┴──────────┴─────────────┘
```

- **Magic Header** `SAFE` — Identifies SafeVault files
- **Version** `01` — Supports future format upgrades
- The original filename is encrypted inside the ciphertext payload and restored on decryption

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [React 19](https://react.dev) | UI Framework |
| [TypeScript](https://www.typescriptlang.org) | Type Safety (Strict Mode) |
| [Vite 8](https://vite.dev) | Build Tool |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling |
| [Framer Motion](https://www.framer.com/motion) | Animation |
| [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) | AES-256-GCM Encryption |
| [argon2-browser](https://github.com/nicolo-ribaudo/nicolo-ribaudo) | Argon2id Key Derivation (WASM) |
| [Lucide React](https://lucide.dev) | Icons |

**Not used:** Backend, Database, Cloud Storage, third-party APIs.

---

## 📁 Project Structure

```
safevault/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx                     # Entry point
│   ├── App.tsx                      # App shell (Header → Tabs → Workspace → Footer)
│   ├── index.css                    # Design system + component styles
│   ├── vite-env.d.ts                # TypeScript declarations
│   ├── lib/
│   │   ├── crypto.ts                # 🔐 Argon2id + AES-256-GCM engine
│   │   ├── crypto.types.ts          # Type definitions
│   │   ├── theme.tsx                # Theme context + useTheme hook
│   │   └── utils.ts                 # Utility functions
│   └── components/
│       ├── Header.tsx               # Logo, tagline, theme toggle, GitHub
│       ├── Footer.tsx               # Security badge, credits
│       ├── ThemeToggle.tsx           # Animated sun/moon toggle
│       ├── TabNav.tsx               # Encrypt/Decrypt + Text/File tabs
│       ├── encrypt/
│       │   ├── EncryptText.tsx      # Text encryption workspace
│       │   └── EncryptFile.tsx      # File encryption workspace
│       ├── decrypt/
│       │   ├── DecryptText.tsx      # Text decryption workspace
│       │   └── DecryptFile.tsx      # File decryption workspace
│       └── ui/
│           ├── Button.tsx           # Button variants
│           ├── Input.tsx            # Labeled input with error state
│           ├── PasswordInput.tsx    # Password with visibility toggle
│           ├── Textarea.tsx         # Styled textarea
│           ├── DropZone.tsx         # Drag & drop file upload
│           └── Toast.tsx            # Toast notification system
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) >= 18
- npm >= 9

### Installation

```bash
# Clone the repository
git clone https://github.com/ngoanhkhoi978/safevault.git
cd safevault

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Production Build

```bash
npm run build
```

Output is in the `dist/` folder. Deploy to any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages, etc.).


### Preview Production Build

```bash
npm run preview
```

---

## 🎨 Design

### Philosophy

- ✅ Modern startup product feel (Linear, Arc Browser, Raycast)
- ✅ Minimal, generous whitespace, beautiful typography
- ✅ Soft pastel purple palette (#A78BFA)
- ✅ Subtle Framer Motion animations
- ❌ No cybersecurity / hacker / terminal aesthetic
- ❌ No rainbow gradients, excessive glow effects
- ❌ No AI dashboard look

### Color Palette

| Token | Light | Dark |
|-------|-------|------|
| Primary | `#A78BFA` | `#A78BFA` |
| Secondary | `#C4B5FD` | `#C4B5FD` |
| Accent | `#F0ABFC` | `#F0ABFC` |
| Background | `#FFFFFF` | `#09090B` |
| Surface | `#FAFAFC` | `#18181B` |
| Border | `#E5E7EB` | `#27272A` |
| Text | `#18181B` | `#F4F4F5` |
| Text Muted | `#71717A` | `#A1A1AA` |

### Motion Design

| Element | Animation |
|---------|-----------|
| Page Transition | Fade in + Y offset 12px |
| Button Hover | Scale 1.02 |
| Button Tap | Scale 0.98 |
| Tab Indicator | Spring layout animation |
| Toast | Slide up + Fade in |
| Workspace Switch | Fade + Y offset with AnimatePresence |

---

## 📖 Usage

### Encrypt Text

1. Select **Encrypt** → **Text** tab
2. Enter the text you want to encrypt
3. Enter and confirm your password
4. Click **Encrypt**
5. Copy the ciphertext or download as a file

### Encrypt File

1. Select **Encrypt** → **File** tab
2. Drag & drop or select a file
3. Enter and confirm your password
4. Click **Encrypt File**
5. Download the `.enc` file

### Decrypt

1. Select **Decrypt** → **Text** or **File** tab
2. Paste ciphertext or upload the `.enc` file
3. Enter the password used during encryption
4. Click **Decrypt**
5. Get your original data back

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an [issue](https://github.com/ngoanhkhoi978/safevault/issues) or submit a pull request.

1. Fork the repository
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: description"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License © 2026 [ngoanhkhoi978](https://github.com/ngoanhkhoi978)

---

---

<div align="center">

# 🇻🇳 Tiếng Việt

</div>

## ✨ Tổng quan

SafeVault là ứng dụng web mã hóa dữ liệu hoạt động **hoàn toàn trên trình duyệt**. Mọi quá trình mã hóa và giải mã đều diễn ra phía client — không có backend, không có database, không upload bất kỳ dữ liệu nào lên Internet.

Ứng dụng được thiết kế với tiêu chí **sản phẩm thực tế**, lấy cảm hứng từ Linear, Arc Browser và Raycast.


---



## 🎯 Tính năng chính

| Tính năng | Mô tả |
|-----------|-------|
| 🔐 **Mã hóa văn bản** | Nhập text → mã hóa bằng mật khẩu → nhận ciphertext (base64) |
| 📄 **Mã hóa file** | Upload hoặc kéo thả file → mã hóa → tải file `.enc` |
| 🔓 **Giải mã văn bản** | Paste ciphertext → nhập mật khẩu → nhận lại text gốc |
| 📂 **Giải mã file** | Upload file `.enc` → nhập mật khẩu → tải file gốc |
| 🌙 **Dark Mode** | Tự động nhận diện theme OS, chuyển đổi thủ công, lưu localStorage |
| 📋 **Copy & Download** | Sao chép kết quả hoặc tải xuống dưới dạng file |
| 🖱️ **Drag & Drop** | Kéo thả file trực tiếp vào vùng upload |
| ⚡ **Thời gian xử lý** | Đo và hiển thị thời gian mã hóa / giải mã |

---

## 🚀 Cài đặt và chạy

```bash
# Clone repository
git clone https://github.com/ngoanhkhoi978/safevault.git
cd safevault

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build
```

---

## 📖 Hướng dẫn sử dụng

### Mã hóa văn bản

1. Chọn tab **Encrypt** → **Text**
2. Nhập văn bản cần mã hóa
3. Nhập mật khẩu và xác nhận mật khẩu
4. Nhấn **Encrypt**
5. Copy ciphertext hoặc tải xuống file

### Mã hóa file

1. Chọn tab **Encrypt** → **File**
2. Kéo thả hoặc chọn file cần mã hóa
3. Nhập mật khẩu và xác nhận mật khẩu
4. Nhấn **Encrypt File**
5. Tải xuống file `.enc`

### Giải mã

1. Chọn tab **Decrypt** → **Text** hoặc **File**
2. Paste ciphertext hoặc upload file `.enc`
3. Nhập mật khẩu đã sử dụng khi mã hóa
4. Nhấn **Decrypt**
5. Nhận lại dữ liệu gốc

---

<div align="center">

**Designed & Developed by [ngoanhkhoi978](https://github.com/ngoanhkhoi978)**

</div>