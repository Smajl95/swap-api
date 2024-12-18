# Swap-API

## Overview

This project is an API built with Node.js, Express, and MongoDB for managing users and orders. The API allows users to register, authenticate, create, retrieve, and delete orders. It includes authentication using JWT (JSON Web Tokens) and password encryption via bcrypt.

The goal of the project is to provide a backend service that allows users to interact with orders and manage their data securely.

## Features

### User Management
- **User Registration (POST /api/register)**: Create a new user with first name, last name, email, and password.
- **User Login (POST /api/login)**: Authenticate a user by email and password, returning a JWT token upon successful authentication.
- **Get User Profile (GET /api/:id)**: Retrieve user details by their unique ID.
- **Update User (PUT /api/:id)**: Update user information (e.g., name, email).
- **Delete User (DELETE /api/:id)**: Delete a user by their unique ID.

### Order Management
- **Create Order (POST /api/orders)**: Create a new order with items, total price, and a reference to the user who created it.
- **Get All Orders (GET /api/orders)**: Retrieve a list of all orders.
- **Get Order by ID (GET /api/orders/:id)**: Retrieve an order by its unique ID.
- **Get Order by Filter (GET /api/orders/startDate and endDate or by OrderID)**: Retrieve an order by its unique ID.
- **Delete Order (DELETE /api/orders/:id)**: Delete an order by its unique ID.

## Installation

To get started with this project, follow these steps:

### Clone the repository:

```bash
git clone https://github.com/Smajl95/swap-api.git


To get started with this project, follow these steps:

### Clone the repository:

```bash
git clone https://github.com/Smajl95/swap-api.git
Navigate into the project directory:
bash
Copy code
cd project-name
Install dependencies:
bash
Copy code
npm install
Set up MongoDB:
Ensure you have MongoDB installed and running locally, or use a cloud service like MongoDB Atlas.
Configure the MongoDB connection in the .env file.

Create a .env file in the root directory and add the following:

env
Copy code
PORT=5000
MONGODB_URI=mongodb://localhost:27017/yourdbname
JWT_SECRET=your_jwt_secret
Run the server:
bash
Copy code
npm start
The server will start running on http://localhost:5000.

API Documentation
Authentication
POST /api/register
Request body:

json
Copy code
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
Response: 201 Created on success with user details.

POST /api/login
Request body:

json
Copy code
{
  "email": "john.doe@example.com",
  "password": "password123"
}
Response: 200 OK with JWT token on success.

User Routes
GET /api/:id
Retrieves user details by ID.

PUT /api/:id
Request body (JSON):

json
Copy code
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@newemail.com"
}
Updates the user details.

DELETE /api/:id
Deletes the user by ID.

Order Routes
POST /api/orders
Request body (JSON):

json
Copy code
{
  "userId": "user_id_here",
  "items": [
    {
      "productId": "product_id_here",
      "quantity": 2
    }
  ],
  "totalPrice": 50
}
Creates a new order.

GET /api/orders
Retrieves all orders.

GET /api/orders/:id
Retrieves a specific order by ID.

DELETE /api/orders/:id
Deletes the order by ID.

Deployment
This API can be deployed on platforms such as:

Heroku
Vercel
Render
Follow the deployment guide of the chosen platform to deploy this project to production.

License
This project is licensed under the MIT License - see the LICENSE.md file for details.








