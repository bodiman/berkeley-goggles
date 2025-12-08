# Elo Check

A mobile beauty ranking application using the Bradley-Terry statistical model for scientifically accurate attractiveness percentiles.

## Project Structure

```
elo_check/
├── backend/          # Node.js/Express API server
├── mobile/           # React Native mobile app
├── shared/           # Shared TypeScript types and utilities
│   ├── types/        # Shared type definitions
│   └── utils/        # Shared utility functions
└── docs/             # Documentation
```

## Features

- **Scientific Accuracy**: Bradley-Terry model for statistically valid percentiles
- **Quality Control**: AI-powered content moderation
- **Gender Balance**: Separate male/female comparison pools
- **Privacy-First**: Comprehensive privacy controls and ethical considerations
- **Real-time Rankings**: Live percentile updates based on peer comparisons

## Development

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- PostgreSQL
- Redis
- Expo CLI (for mobile development)

### Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see `.env.example` files)

3. Start development servers:
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