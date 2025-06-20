# Student Progress Management System

A full-stack MERN application to track and manage student progress with Codeforces integration.

## Application Screenshot

![Application Screenshot](client/public/image.png)

## Features

### Student Management
- Table view of all enrolled students
- CRUD operations for student records
- Export student data as CSV
- View detailed student profiles

### Codeforces Integration
- Track student ratings and contest performance
- Visualize problem-solving statistics
- Daily automatic data synchronization
- Performance metrics and analytics

### Inactivity Monitoring
- Detect inactive students (7+ days without submissions)
- Automated email reminders
- Customizable notification settings

### User Experience
- Responsive design for mobile and tablet
- Light and dark mode toggle
- Interactive data visualization

## Demo Video

Watch the demonstration of this application:

[![Student Progress Management System Demo](https://img.youtube.com/vi/3ju7VED64Ls/0.jpg)](https://www.youtube.com/watch?v=3ju7VED64Ls)

## Tech Stack
- **MongoDB**: Database for storing student and Codeforces data
- **Express.js**: Backend server framework
- **React.js**: Frontend UI library
- **Node.js**: Runtime environment
- **Chart.js**: Data visualization
- **Material-UI**: UI component library

## Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (v4+)
- npm or yarn

### Installation

#### Backend Setup
```bash
cd server
npm install
npm run dev
```

#### Frontend Setup
```bash
cd client
npm install
npm start
```

## Environment Variables

Create a `.env` file in the server directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_for_notifications
EMAIL_PASS=your_email_password
PORT=5000
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Documentation

For detailed information about the API endpoints and how to use them, please refer to the [APIs Documentation](client/public/apis.pdf).

The application provides various APIs for:
- Managing student data
- Integrating with Codeforces
- Configuring application settings
- Running tests and diagnostics
