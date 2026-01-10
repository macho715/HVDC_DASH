# HVDC Dashboard Frontend

The frontend application for the HVDC Logistics Dashboard, build with Next.js 15.

## 📱 Mobile & PWA Features
This project is optimized for mobile devices and can be installed as a PWA.
- **Mobile View**: Automatically detects mobile devices and switches to a touch-optimized UI.
- **PWA**: Installable on iOS and Android home screens.
- **Offline Support**: Basic offline capabilities via service workers.

For detailed mobile instructions, see [MOBILE_GUIDE.md](./MOBILE_GUIDE.md).

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase Project Setup

### Installation

```bash
npm install
```

### Development Server

Run the standard development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### 📱 Mobile Development

To test on real mobile devices connected to the same Wi-Fi network:

```bash
# Expose to local network (0.0.0.0)
npm run dev:mobile
```

Then access via your computer's IP address (e.g., `http://192.168.1.XX:3000`).

## 🛠 Project Structure

- `src/app`: App Router pages and API routes.
- `src/components`: React components.
  - `Mobile*.tsx`: Mobile-specific components.
- `public`: Static assets including PWA icons and manifest.

## 📦 Building for Production

```bash
npm run build
npm start
```
