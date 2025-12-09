# Cashflow Vision - Expense Tracker

Cashflow Vision is a comprehensive expense tracking application built with the MERN stack. It helps users monitor their spending, categorize expenses, and gain insights into their financial habits.

## Features (Phase 1 - Core)

- **Expense Management**: Add, view, edit, and delete expenses
- **Categorization**: Organize expenses into predefined categories (Food, Transport, Shopping, Bills, Entertainment, Healthcare, Other)
- **Dashboard**: View total expenses, expense count, and category breakdown
- **Responsive UI**: Clean, intuitive interface that works on all devices
- **Data Persistence**: Expenses stored in MongoDB database

## Tech Stack

- **Frontend**: React, Vite, JavaScript, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODE
- **API**: RESTful API endpoints
- **HTTP Client**: Axios for API calls

## Project Structure

```
CashflowVision/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
└── backend/
    ├── models/
    ├── routes/
    ├── controllers/
    ├── config/
    ├── server.js
    ├── package.json
    └── .env
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Backend Setup

1. Navigate to the backend directory: `cd CashflowVision/backend`
2. Install dependencies: `npm install`
3. Create a `.env` file with the following content:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/cashflowvision
   ```
4. Start the server: `npm run dev`

### Frontend Setup

1. Navigate to the frontend directory: `cd CashflowVision/frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## API Endpoints

- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/:id` - Get specific expense
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

## Development Branches

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/phase-2-enhancements` - Phase 2 features (Income tracking, budgets, etc.)
- `feature/phase-3-advanced` - Phase 3 features (Authentication, cloud sync, etc.)
- `feature/phase-4-analytics` - Phase 4 features (Analytics and insights)

## Project Roadmap

### Phase 1: Core Features (Complete)
- ✅ Expense entry and management
- ✅ Basic dashboard and categories
- ✅ Data persistence with MongoDB
- ✅ Responsive UI

### Phase 2: Enhancement Features (Planned)
- Income tracking
- Budget setting and alerts
- Recurring expenses
- Receipt images
- Multi-currency support
- Export data functionality

### Phase 3: Advanced Features (Planned)
- User authentication and authorization
- Cloud sync across devices
- Spending goals and targets
- Bill reminders and notifications
- Split expenses with family/friends

### Phase 4: Analytics and Intelligence (Planned)
- Spending pattern visualization
- Predictive analytics
- Financial health scoring
- Cost optimization suggestions
- AI-powered insights

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.