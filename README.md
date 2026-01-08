Virtual Event Management Platform – Backend

A Node.js + Express backend system for managing virtual events, supporting user authentication, event creation, participant registration, and email notifications.
The application uses in-memory data storage and follows RESTful API principles.

--> Tech Stack

        Node.js

        Express.js

        JWT (JSON Web Tokens) – Authentication

        bcrypt – Password hashing

        UUID – Unique ID generation

        In-memory storage (Arrays & Objects)

--> Features

        User Registration & Login

        Secure Authentication using JWT

        Role-based access (Organizer / Attendee)

        Event CRUD operations (Organizer only)

        Event registration for attendees

        In-memory participant management

        Asynchronous email notification simulation

        RESTful API design

--> Project Structure

        src/
        ├── app.js
        ├── server.js
        ├── data/
        │   └── store.js
        ├── middleware/
        │   └── auth.js
        ├── routes/
        │   ├── auth.routes.js
        │   └── event.routes.js
        ├── utils/
        │   └── email.js

--> Installation & Setup

        1️. Clone the Repository
        git clone 
        cd Event_management

        2️. Install Dependencies
        npm install

        3️. Start the Server
        npm start


        Server will run on:

        http://localhost:3000

-->  API Endpoints

    1. Authentication
        Register User

        POST /api/register

        {
        "email": "user@example.com",
        "password": "123456",
        "role": "organizer"
        }

    2. Login User

        POST /api/login

        {
        "email": "user@example.com",
        "password": "123456"
        }

    3. Event Management

        Requires Authorization Header

        Authorization: Bearer <JWT_TOKEN>

        Get All Events

        GET /api/events

        Create Event (Organizer only)

        POST /api/events

        {
        "title": "Tech Conference",
        "date": "2025-02-10",
        "time": "10:00 AM",
        "description": "Node.js Virtual Event"
        }

        Update Event

        PUT /api/events/:id

        Delete Event

        DELETE /api/events/:id

    4. Event Registration
        Register for Event

        POST /api/events/:id/register

        Adds attendee to participant list

        Sends simulated email notification

    5. Email Notification

        Email sending is simulated using asynchronous operations.

        Example console output:

        📧 Email sent to user <userId> for event "Tech Conference"

--> Authentication & Authorization

        Passwords are hashed using bcrypt

        JWT is used for session management

        Role-based access control implemented

        Only organizers can create, update, or delete events

--> Design Decisions

        In-memory data storage used as per assignment requirements

        JWT authentication ensures secure access

        Middleware-based authorization for clean separation of concerns

        Async/await used for handling asynchronous tasks

--> Testing

        APIs can be tested using Postman, Bruno, or Thunder Client

        No external database dependency

        All data resets when the server restarts

--> Limitations

        Data is not persisted (in-memory only)

        No frontend UI included

        Email service is mocked

--> Author: Sumayya, Full-Stack Developer

--> Submission Notes

        Repository is public

        All assignment requirements are implemented

        Project runs successfully using npm start