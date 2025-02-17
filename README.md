# SoloMvp

This is a full stack web application built with Node.js for the backend and React for the frontend. The application uses Knex.js for database queries and PostgreSQL as the database.

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd fullstack-web-app
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. Start the frontend application:
   ```
   cd frontend
   npm start
   ```

### Database Setup

- Configure your PostgreSQL database in `backend/src/db/knexfile.js`.
- Run migrations to set up the database schema:
  ```
  cd backend
  npx knex migrate:latest
  ```

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.