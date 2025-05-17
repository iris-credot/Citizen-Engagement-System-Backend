# Citizen Engagement System – Backend

A Node.js + Express REST API for managing citizen engagement processes including user accounts, complaints, responses, categories, agencies, and notifications. Built with MongoDB and JWT authentication.

---

## 📂 Project Structure


- `/Controllers` – Business logic for each module
- `/Middleware` – Auth, validation, and utility middlewares
- `/Error` – Handles all kinds of errors (NotFound, BadRequest, etc.)
- `/Models` – Mongoose schemas (User, Complaint, Agency, etc.)
- `/Routes` – Express route handlers
- `/uploads` – For user images
- `/index.js` – Initializes database, routes, and Swagger documentation

yaml
Copy
Edit

---

## 🚀 Features

- ✅ JWT-based Authentication (Citizens, Admins, Agencies)
- ✅ Role-based access control
- ✅ Complaint and Response Management
- ✅ Agency & Category Administration
- ✅ Notification System (Database + Email)
- ✅ Secure password reset and OTP verification
- ✅ Swagger API Documentation

---

## 🔧 Tech Stack

- **Node.js**
- **Express**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **Multer** for file uploads
- **Swagger** for API documentation
- **Nodemailer** for sending emails

---

## 🔐 Authentication Roles

| Role         | Description                        |
|--------------|------------------------------------|
| Super Admin  | Full access to all resources       |
| Agency Admin | Handles complaints and responses   |
| Citizen      | Can submit and track complaints    |

---

## 📦 Installation

1. **Clone the repo**

```bash
git clone git@github.com:yourusername/Citizen-Engagement-System-Backend.git
cd Citizen-Engagement-System-Backend
Install dependencies

bash
Copy
Edit
npm install
Setup .env

env
Copy
Edit
PORT=5000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
AUTH_EMAIL=you@example.com
EMAIL_SERVICE=eg.gmail
AUTH_PASS=your_email_password
CLOUD_NAME=your_cloud_name
API_SECRET=your_api_key_from_cloudinary
SECRET_KEY=your_secret_key



Start the server

bash
Copy
Edit
npm run dev



## 📘 **API Documentation**

🔗 **Swagger Documentation**: [https://citizen-engagement-system-backend.onrender.com/api-system](https://citizen-engagement-system-backend.onrender.com/api-system)


bash
Copy
Edit

Use the Swagger UI to test all routes for modules like User, Complaint, Response, Category, Notification, and Agency.

🛠️ Scripts
Command	Description
npm run dev	Start in development mode
npm start	Start in production mode

🧪 Testing 
Use Postman or Insomnia to test the endpoints manually, or import the Swagger JSON into Swagger Editor.

🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.

📄 License
This project is licensed under the MIT License.


## 👨‍💻 Author

Developed by **Iris Credot**  
📧 tetairiscredot@gmail.com  

💡 Tips
✅ Keep your .env file private.

✅ Always run npm run dev during development.

✅ Ensure MongoDB is running locally or use a cloud DB like MongoDB Atlas.

yaml
Copy
Edit

---

✅ **Next Step**:  
Save this as `README.md` in the root of your backend project.








