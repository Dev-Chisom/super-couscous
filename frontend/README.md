# SignalIQ Frontend

AI-powered investment intelligence platform frontend built with Next.js, React, and TypeScript.

## Features

- 📊 **Real-time Stock Charts** - TradingView Lightweight Charts integration
- 🤖 **AI Signals** - BUY/HOLD/SELL recommendations with explanations
- 📈 **Dashboard** - Top signals, watchlist, and market highlights
- 🌍 **Multi-Market Support** - US (NYSE, NASDAQ) and NGX (Nigerian) stocks
- 📱 **Responsive Design** - Modern, mobile-friendly UI

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components (shadcn/ui style)
- **Charts**: TradingView Lightweight Charts
- **State Management**: Zustand + TanStack Query
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and set your backend API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Dashboard page
│   ├── stocks/            # Stock detail pages
│   └── markets/           # Market listing pages
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── signal-badge.tsx  # Signal display component
│   ├── stock-chart.tsx   # Price chart component
│   └── navbar.tsx        # Navigation component
├── lib/                   # Utilities and services
│   ├── api.ts            # API client
│   ├── store.ts          # Zustand stores
│   └── utils.ts          # Utility functions
└── types/                 # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The frontend expects a FastAPI backend running on the URL specified in `NEXT_PUBLIC_API_URL`. 

See `BACKEND_PROMPT.md` in the root directory for backend API specifications.

## Features in Development

- [ ] Real-time price updates via WebSockets
- [ ] User authentication
- [ ] Portfolio tracking
- [ ] Email/push notifications
- [ ] Advanced filtering and search
- [ ] Dark mode toggle

## License

MIT
