# 🚀 JobBoard Frontend

Web3 decentralized job board platform for freelance missions built on Ethereum.

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** - Build tool
- **Wagmi v2** - React hooks for Ethereum
- **Viem** - TypeScript Interface for Ethereum
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI components
- **React Hook Form** - Form management

## 📁 Project Architecture

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/          # shadcn/ui components
│   │   ├── layout/      # Layout components (Header, Footer)
│   │   └── job/         # Job-related components (JobCard, JobList, Dialogs)
│   ├── hooks/
│   │   └── contracts/   # Custom hooks for smart contract interactions
│   ├── lib/
│   │   ├── wagmi.ts     # Wagmi configuration
│   │   └── contracts.ts # Contract ABI and address
│   ├── types/
│   │   └── job.ts       # TypeScript type definitions
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
```

## 🏃 Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

## 📝 Smart Contract

The frontend interacts with the JobBoard smart contract deployed on Ethereum.
Contract source code is located in `/backend/contracts/`.
