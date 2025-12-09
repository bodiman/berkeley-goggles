# Berkeley Goggles

Berkeley Goggles - A social beauty ranking application where you rate others and discover your ranking in the community.

## Project Structure

```
berkeley_goggles/
├── backend/          # Node.js/Express API server
├── mobile/           # React Native mobile app
├── shared/           # Shared TypeScript types and utilities
│   ├── types/        # Shared type definitions
│   └── utils/        # Shared utility functions
└── docs/             # Documentation
```

## Features

- **Community-Driven**: Rate others and get rated by the community
- **Quality Control**: AI-powered content moderation
- **Gender Balance**: Separate male/female comparison pools
- **Privacy-First**: Comprehensive privacy controls and ethical considerations
- **Real-time Rankings**: Live ranking updates based on peer ratings

## Development

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- PostgreSQL
- Redis
- Expo CLI (for mobile development)

### Getting Started

#### Quick Setup

```bash
# Clone the repository
git clone https://github.com/your-username/berkeley-goggles.git
cd berkeley-goggles

# Run the setup script
./scripts/setup-dev.sh

# Start development servers
npm run dev
```

#### Manual Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Backend
cp backend/.env.development backend/.env

# Frontend
cp web/.env.example web/.env.local
```

3. Setup database:
```bash
cd backend
npm run db:generate
npm run db:push
cd ..
```

4. Start development servers:
```bash
npm run dev
```

### Available Scripts

- `npm run dev` - Start both backend and mobile development servers
- `npm run build` - Build both backend and mobile for production
- `npm run test` - Run all tests
- `npm run lint` - Lint all code
- `npm run typecheck` - Type check all TypeScript code

## Architecture

### Backend (Node.js/Express)
- RESTful API with TypeScript
- PostgreSQL database with Prisma ORM
- Redis for caching and sessions
- AWS S3 for photo storage
- JWT authentication

### Mobile (React Native/Expo)
- React Navigation v6
- Zustand for state management
- React Query for API calls
- Reanimated for animations

### Shared
- TypeScript interfaces and types
- Shared utility functions
- Common validation schemas

## License

MIT