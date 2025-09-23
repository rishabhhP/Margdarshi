# MargDarshi - Indian Railways Traffic Management System

A professional, responsive web application for Indian Railways traffic management with a government-grade dashboard UI.

## Features

- **Real-time Dashboard**: Live train tracking, railway map, and AI recommendations
- **Multi-language Support**: Full i18n support for English and Hindi
- **Dark/Light Mode**: Complete theme switching capability
- **Block Occupancy Timeline**: Gantt-style timeline showing 60-minute track occupancy
- **AI Recommendations**: Smart suggestions with accept/rethink/override actions
- **Decision Logging**: Complete audit trail of all decisions
- **KPI Dashboard**: Performance metrics and analytics
- **What-if Simulation**: Scenario testing and impact analysis
- **Push Notifications**: Real-time alerts and notifications

## Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Charts**: Recharts (with fallbacks)
- **Maps**: Leaflet (with fallbacks)
- **State Management**: React Context API
- **Storage**: LocalStorage (production), PostgreSQL (development)

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd margdarshi-railway-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Deployment to Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy to Netlify:
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Deploy

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, Theme, Language)
├── data/              # Mock data and constants
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── services/          # API and database services
└── index.css          # Global styles and Tailwind imports
```

## Key Components

- **Dashboard**: Main dashboard with three-panel layout
- **TrainList**: Live train tracking component
- **RailwayMap**: Interactive railway network map
- **AIRecommendations**: AI-powered suggestions with actions
- **BlockOccupancy**: Gantt-style timeline for track occupancy
- **TopNavigation**: Main navigation with user controls

## Features in Detail

### Multi-language Support (i18n)
- Complete English/Hindi translation
- Context-based language switching
- All UI elements, labels, and messages are translated

### AI Recommendations
- Accept: Approve the recommendation
- Rethink: Send back to optimizer for alternatives
- Override: Reject with reason (removes suggestion)
- Push Notifications: Send alerts to relevant personnel

### Block Occupancy Timeline
- 60-minute forward view
- 5-minute interval columns
- Color-coded status (Free/Reserved/Occupied)
- Train type indicators
- Real-time updates

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Horizontal scrolling for timeline on mobile

## Environment Variables

For production deployment, the app uses localStorage for data persistence. For development with database integration, you can configure:

- Database connection strings
- API endpoints
- Authentication tokens

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.
