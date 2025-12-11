# Travel Buddy - Backend

## Live URL
Currently running locally at: `http://localhost:5000`  
(Replace with your deployed backend URL once available)

**Travel Buddy** is a modern, responsive, and interactive web application built with Node js, express js, typescript, postgreSQL, prisma. It allows users to explore travel plans, join trips, leave reviews, and manage their profile seamlessly.

---

## Features
- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, User, Super Admin)
- **Travel Plan Management**
  - CRUD operations for travel plans
  - Visibility control (public/private)
  - Search & filtering by destination, date, travel type
- **Join Requests**
  - Send, accept, reject, and cancel travel plan join requests
  - List of participants for each plan
  - Prevent joining own plans or duplicate requests
- **Reviews & Feedback**
  - Users can review each other after completing a travel plan
  - Ratings & comments stored per user per plan
- **Payments & Subscriptions**
  - Stripe integration for subscription management


## Technology Stack
- **Language & Runtime:** TypeScript, Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT
- **Payment Gateway:** Stripe
- **Error Handling:** Custom error middleware
- **Validation:** Zod (optional) or express-validator
- **Environment Management:** dotenv

## Setup & Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/travel-buddy-backend.git
cd travel-buddy-backend
```

2. Install dependencies:
```bash
npm install
```

3. Install dependencies:
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/travelbuddy
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

4. Generate Prisma client & migrate database:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. Start the development server:
```bash
npm run dev
```

src/
├─ app/
│  ├─ modules/
│  │  ├─ auth/
│  │  ├─ travel-plan/
│  │  ├─ join-request/
│  │  └─ review/
│  ├─ middlewares/
│  └─ utils/
├─ config/
├─ generated/ 
└─ server.ts