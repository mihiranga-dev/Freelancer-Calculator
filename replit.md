# Freelance Earnings Calculator

## Overview

A freelance earnings calculator web application that helps users calculate their take-home pay after platform fees and convert amounts to different currencies using real-time exchange rates. The app features a dark-themed minimalist UI with smooth animations and stores calculation history for authenticated users.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state caching and synchronization
- **Styling**: Tailwind CSS with custom dark theme, shadcn/ui component library (New York style)
- **Animations**: Framer Motion for smooth layout transitions and entry animations
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: Type-safe API routes defined in `shared/routes.ts` using Zod schemas
- **Authentication**: Replit Auth integration with OpenID Connect, session-based with PostgreSQL session store
- **Server Entry**: Single entry point at `server/index.ts` that handles both API routes and static file serving

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Tables**:
  - `sessions`: Session storage for authentication (required for Replit Auth)
  - `users`: User profiles with Replit Auth integration
  - `calculations`: Calculation history linked to users
- **Migrations**: Drizzle Kit with `db:push` command for schema synchronization

### Authentication Flow
- Replit Auth using OpenID Connect protocol
- Session management with `connect-pg-simple` for PostgreSQL session storage
- Protected routes use `isAuthenticated` middleware
- User data automatically synced from Replit profile on login

### Key Design Patterns
- **Monorepo Structure**: Client (`client/`), server (`server/`), and shared code (`shared/`) in single repository
- **Type Sharing**: Zod schemas in `shared/` directory provide type safety across frontend and backend
- **API Route Definitions**: Centralized in `shared/routes.ts` with request/response schemas
- **Storage Interface**: `IStorage` interface in `server/storage.ts` abstracts database operations

## External Dependencies

### Third-Party APIs
- **Exchange Rates API**: `https://open.er-api.com/v6/latest/USD` - Free API for real-time currency exchange rates, cached for 1 hour

### Database
- **PostgreSQL**: Required for data persistence, configured via `DATABASE_URL` environment variable

### Authentication
- **Replit Auth**: OpenID Connect integration requiring `ISSUER_URL`, `REPL_ID`, and `SESSION_SECRET` environment variables

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migration tools
- `@tanstack/react-query`: Server state management
- `framer-motion`: Animation library
- `zod`: Runtime type validation
- `passport` / `openid-client`: Authentication handling
- `express-session` / `connect-pg-simple`: Session management