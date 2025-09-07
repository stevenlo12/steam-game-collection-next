# SteamDB - Steam Game Discovery Platform

A modern web application for discovering Steam games, tracking prices, and exploring gaming content. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Game Discovery**: Browse and search through Steam games
- **Price Tracking**: Monitor game prices and discounts
- **Pagination**: Efficient browsing with paginated results
- **Steam Integration**: Direct links to Steam store pages
- **Responsive Design**: Optimized for all devices
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Frontend**: Next.js 12, React, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **State Management**: React Hooks
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ukrida-steamdb
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:120/api
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment

### Vercel Deployment

1. **Install Vercel CLI**:

```bash
npm i -g vercel
```

2. **Deploy to Vercel**:

```bash
vercel
```

3. **Set Environment Variables** in Vercel Dashboard:

   - Go to your project settings
   - Add `NEXT_PUBLIC_API_BASE_URL` with your production API URL

4. **Automatic Deployments**:
   - Connect your GitHub repository to Vercel
   - Every push to main branch will trigger automatic deployment

### Manual Deployment

1. **Build the application**:

```bash
npm run build
```

2. **Start production server**:

```bash
npm start
```

## 🔧 Configuration

### Environment Variables

| Variable                   | Description  | Default                    |
| -------------------------- | ------------ | -------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | API base URL | `http://localhost:120/api` |

### API Endpoints

The application expects the following API endpoints:

- `GET /api/games` - List games with pagination
- `GET /api/games/:id` - Get game details
- `GET /api/games/search` - Search games
- `GET /api/games/category` - Filter by category
- `GET /api/games/free` - Free games
- `GET /api/games/sale` - Games on sale

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Pagination.tsx   # Pagination component
│   ├── loader.tsx       # Loading component
│   └── input.tsx        # Input components
├── pages/              # Next.js pages
│   ├── index.tsx       # Home page
│   ├── game/[id].tsx   # Game detail page
│   └── _app.tsx        # App wrapper
├── services/           # API services
│   └── api.ts          # Game service
├── styles/             # Global styles
│   ├── globals.css     # Global CSS
│   └── Home.module.css # Component styles
└── redux/              # State management
    ├── store.ts        # Redux store
    ├── reducers/       # Reducers
    └── sagas/          # Redux sagas
```

## 🎨 UI Components

- **Game Cards**: Display game information with Steam integration
- **Pagination**: Navigate through game collections
- **Game Details**: Comprehensive game information page
- **Responsive Footer**: Light-themed footer with links

## 🔗 API Integration

The application integrates with a custom API that provides Steam game data. The API should return data in the following format:

```typescript
interface GamesResponse {
  games: Game[];
  total: number;
  limit: number;
  offset: number;
}

interface Game {
  id: number;
  steamId: string;
  title: string;
  description: string;
  headerImage: string;
  price: string;
  // ... other properties
}
```

## 🚀 Performance Optimizations

- **Image Optimization**: Next.js Image component with proper domains
- **Code Splitting**: Automatic code splitting by Next.js
- **SWC Minification**: Fast compilation and minification
- **Static Generation**: Where possible for better performance

## 🔒 Security

- **Security Headers**: Configured in `next.config.js`
- **CORS**: Proper cross-origin request handling
- **Environment Variables**: Secure configuration management

## 📝 Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "type-check": "tsc --noEmit"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Steam for game data
- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Tailwind CSS for styling utilities

---

**Note**: This application is not affiliated with Valve Corporation or Steam. It's a third-party tool for Steam game discovery and price tracking.
