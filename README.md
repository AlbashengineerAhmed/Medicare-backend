# Medicare - Doctor Appointment Booking System

![Medicare Logo](frontend/src/assets/images/logo.png)

Medicare is a comprehensive MERN stack application designed to streamline the process of booking medical appointments. The platform connects patients with healthcare providers, allowing for efficient scheduling, management of medical records, and seamless communication between doctors and patients.

![Doctors](https://github.com/AlbashengineerAhmed/Doctor-Appointment-Booking-MERN-Stack/assets/124532428/db8552ba-4542-4be4-915a-7f54f8964bf3)

![Hero](https://github.com/AlbashengineerAhmed/Doctor-Appointment-Booking-MERN-Stack/assets/124532428/4a80f4e8-6bfc-48de-be26-99250067d161)

## ✨ Features

### For Patients
- **User Authentication**: Secure registration and login system
- **Doctor Search**: Find doctors by name, specialization, or rating
- **Appointment Booking**: Schedule appointments with preferred doctors
- **Profile Management**: Update personal information and medical history
- **Appointment History**: View past and upcoming appointments
- **Reviews & Ratings**: Leave feedback for doctors after consultations

### For Doctors
- **Professional Profile**: Showcase qualifications, experience, and specializations
- **Appointment Management**: View and manage patient appointments
- **Time Slot Management**: Set availability and working hours
- **Patient Records**: Access patient medical history and previous visits
- **Prescription Management**: Create and manage digital prescriptions

### For Administrators
- **User Management**: Oversee both patient and doctor accounts
- **Doctor Verification**: Approve doctor registrations
- **Analytics Dashboard**: Monitor platform usage and performance metrics
- **Content Management**: Update website content and information

## 🛠️ Technology Stack

### Frontend
- **React.js**: UI library for building interactive user interfaces
- **React Router**: For navigation and routing
- **Context API**: For state management
- **Tailwind CSS**: For responsive and modern styling
- **Axios**: For API requests
- **React Icons**: For UI icons
- **React Toastify**: For notifications

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: ODM library for MongoDB
- **JWT**: For secure authentication
- **Bcrypt**: For password hashing
- **Cloudinary**: For image storage and management

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Cloudinary account

### Installation

1. Clone the repository
```bash
git clone https://github.com/AlbashengineerAhmed/medicare.git
cd medicare
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables
   - Create a `.env` file in the backend directory
   - Add the following variables:
```
PORT=8000
DB_URL=mongodb://localhost:27017/doctor
JWT_SECRET_KEY=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

5. Start the backend server
```bash
cd backend
npm run dev
```

6. Start the frontend development server
```bash
cd ../frontend
npm run dev
```

7. Open your browser and navigate to `http://localhost:5173`

## 📝 Code Structure

The project follows a clean, modular architecture:

### Frontend Structure
```
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Doctors/
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── UI/
│   │   └── ...
│   ├── context/
│   ├── hooks/
│   ├── layout/
│   ├── pages/
│   │   ├── Admin/
│   │   ├── Doctor/
│   │   ├── Doctors/
│   │   └── ...
│   ├── routes/
│   ├── services/
│   │   └── api/
│   └── utils/
├── index.html
└── package.json
```

### Backend Structure
```
backend/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
├── validations/
├── index.js
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login a user

### Users
- `GET /api/v1/users/:id` - Get a specific user
- `PUT /api/v1/users/:id` - Update a user
- `DELETE /api/v1/users/:id` - Delete a user

### Doctors
- `GET /api/v1/doctors` - Get all doctors
- `GET /api/v1/doctors/:id` - Get a specific doctor
- `PUT /api/v1/doctors/:id` - Update a doctor
- `DELETE /api/v1/doctors/:id` - Delete a doctor

### Appointments
- `POST /api/v1/appointments` - Create a new appointment
- `GET /api/v1/appointments/doctor/:doctorId` - Get all appointments for a doctor
- `GET /api/v1/appointments/patient` - Get all appointments for a patient
- `PUT /api/v1/appointments/:id/status` - Update appointment status
- `DELETE /api/v1/appointments/:id` - Delete an appointment

### Reviews
- `GET /api/v1/reviews` - Get all reviews
- `POST /api/v1/reviews` - Create a new review

### Admin
- `GET /api/v1/admin/doctors` - Get all doctors (including pending)
- `PUT /api/v1/admin/doctors/:id/status` - Update doctor approval status
- `GET /api/v1/admin/dashboard` - Get dashboard statistics

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting for API endpoints
- CORS protection

## 🌟 Best Practices

- **SOLID Principles**: Code is organized following SOLID design principles
- **Responsive Design**: Mobile-first approach for all UI components
- **Error Handling**: Comprehensive error handling on both frontend and backend
- **Code Splitting**: Lazy loading for improved performance
- **SEO Optimization**: Proper meta tags and document head management

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- [AlbashengineerAhmed](https://github.com/AlbashengineerAhmed)

## 🙏 Acknowledgements

- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cloudinary](https://cloudinary.com/)
