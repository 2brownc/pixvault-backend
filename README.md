# Pixvault: A MERN Stock Image Website

- [Open Pixvault App](https://pixvault.pages.dev/)

Pixvault is a robust stock image website built with the MERN stack (MongoDB, Express, React, and Node.js) for a seamless user experience. It empowers users to view, manage, and download images, making it ideal for designers, bloggers, and anyone seeking exceptional visuals.

**This is the backend repo.** Check out the [frontend repo](/2brownc/pixvault-frontend).

**Frontend (React):**

- The React frontend makes requests to the backend API endpoints using the Axios library.
- These endpoints enable various functionalities like:
  - User login and authentication
  - Image search based on keywords or categories
  - Downloading and liking images

**Backend (Node.js):**

- The Node.js backend handles these API requests using the Express.js framework.
- Based on the requested endpoint, the backend would:
  - Authenticate user by interfacing with the Auth0 API.
  - Communicate with the MongoDB database to perform actions like image retrieval and updating for preferences.
  - Finally process various requests and generate a response in JSON format. This response could include the requested data like image details or user information.

**REST API Interaction:**

The communication between frontend and backend follows the REST architectural style.

## Key Features

- **Typescript:** Enhances code maintainability, type safety, and developer experience.
- **Secure Authentication:** Leverages Auth0 for secure user login and authorization, ensuring data privacy and trust.
- **React Redux State Management:** Provides a centralized state management solution for a predictable and efficient user interface.
- **Mantine UI Integration:** Offers a modern and responsive design framework for an intuitive user experience.

## Getting Started

1. **Prerequisites:** Node.js (version 18 or later) and npm (Node Package Manager) are required. You can download them from the official Node.js website: [https://nodejs.org/en](https://nodejs.org/en).

2. **Clone the Repository:** Open your terminal and navigate to your desired project directory. Then, run the following command to clone this repository:

   ```bash
   git clone https://github.com/2brownc/pixvault-backend.git
   ```

3. **Install Dependencies:** Navigate to the project directory and install the required dependencies using npm:

   ```bash
   cd pixvault-backend
   npm install
   ```

4. **Environment Variables:** Create a `.env.local` file in the project root directory and configure the following environment variables:

   ```
     OPENVERSE_CLIENT_ID
     OPENVERSE_CLIENT_SECRET

     MONGODB_URI

     AUTH0_AUDIENCE
     AUTH0_ALGORITHM
     AUTH0_ISSUER_BASE_URL

     ANONAUTH_SECRET #anonymous auth using JWT

     CORS_ORIGIN_SERVER #for CORS

   ```

5. **Start the Development Server:** Run the following command to start the development server:

```bash
npm start
```

This will launch the app at `http://localhost:3000` in your browser.

## Deployment

Instructions on deploying Pixvault to a production environment will be added in a future update.
