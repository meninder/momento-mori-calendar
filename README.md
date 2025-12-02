# MomentoMori Calendar

A web application that visualizes life as a grid of weekly circles. Each circle represents one week of life, with filled circles showing weeks already lived and empty circles representing the future. The visualization displays 90 years across two columns of 45 years each.

## Project Setup

**Dependencies:** Node.js & npm

**Install dependencies:**
```bash
npm i
```

**Start development server:**
```bash
npm run dev
```
The app will be available at `http://localhost:8080`

**Build for production:**
```bash
npm run build
```

**Lint code:**
```bash
npm run lint
```

## Technologies

- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **React** - UI framework
- **shadcn-ui** - Component library built on Radix UI
- **Tailwind CSS** - Styling
- **date-fns** - Date calculations
- **React Router** - Client-side routing

## Features

- Interactive weekly calendar visualization
- Hover tooltips showing date ranges and age for each week
- Settings panel to input your birthday
- Responsive two-column layout
- Animated circle rendering
- Visual decade separators every 10 years

## Deployment

The project is configured for GitHub Pages deployment:

1. Build the project: `npm run build`
2. Push to `master` branch
3. GitHub Pages serves from the `docs/` directory

The app is currently hosted at GitHub Pages.