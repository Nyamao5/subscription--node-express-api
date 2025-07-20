# Node + Express Subscription API

This project is a backend API built with Node.js and Express to manage user subscriptions. It integrates with MongoDB for data storage and uses Firebase Authentication for securing endpoints.

## Technologies Used

*   **Node.js:** JavaScript runtime environment.
*   **Express:** Web application framework for Node.js.
*   **MongoDB:** NoSQL database.
*   **Mongoose:** MongoDB object modeling for Node.js.
*   **Firebase Admin SDK:** For verifying Firebase Authentication tokens.
*   **dotenv:** To load environment variables.
*   **express-validator:** For input validation.

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root directory of the project with the following variables:

    ```
    MONGODB_URI=<your_mongodb_connection_string>
    FIREBASE_SERVICE_ACCOUNT_KEY_PATH=<path_to_your_firebase_service_account_key.json>
    PORT=3000 # Or any desired port
    ```

    *   Replace `<your_mongodb_connection_string>` with your MongoDB connection string (e.g., from MongoDB Atlas).
    *   Replace `<path_to_your_firebase_service_account_key.json>` with the actual path to your Firebase service account key file. **Keep this file secure and do not commit it to your repository.**

4.  **Run the API:**

    ```bash
    npm run dev
    ```

    The API should start and connect to your MongoDB database.

## API Endpoints

The API base URL is `/api/subscriptions`. All endpoints are protected by Firebase Authentication middleware.

*   **`POST /api/subscriptions`**
    *   **Description:** Creates a new subscription.
    *   **Authentication:** Required.
    *   **Request Body:** JSON object with subscription details (e.g., `plan`, `startDate`, `endDate`, `status`). The `userId` will be automatically set from the authenticated user's UID.
    *   **Validation:** Validates `plan`, `startDate`, `endDate`, and `status`.
    *   **Response:** The created subscription object.

*   **`GET /api/subscriptions/:id`**
    *   **Description:** Retrieves a single subscription by ID.
    *   **Authentication:** Required.
    *   **Parameters:** `:id` (the subscription ID).
    *   **Validation:** Validates the subscription ID format and ensures the subscription belongs to the authenticated user.
    *   **Response:** The subscription object if found and authorized, otherwise a 404 or 403 error.

*   **`GET /api/subscriptions/user/:userId`**
    *   **Description:** Retrieves all subscriptions for a specific user.
    *   **Authentication:** Required.
    *   **Parameters:** `:userId` (the user ID - this is automatically inferred from the authenticated user's UID, the parameter in the path is not strictly necessary for authorization but kept for routing structure).
    *   **Validation:** Implicitly validated by the authentication middleware ensuring the user exists.
    *   **Response:** An array of subscription objects for the user.

*   **`PUT /api/subscriptions/:id`**
    *   **Description:** Updates a subscription by ID.
    *   **Authentication:** Required.
    *   **Parameters:** `:id` (the subscription ID).
    *   **Request Body:** JSON object with updated subscription details.
    *   **Validation:** Validates the subscription ID format, the request body fields, and ensures the subscription belongs to the authenticated user.
    *   **Response:** The updated subscription object if found and authorized, otherwise a 404 or 403 error.

*   **`PUT /api/subscriptions/cancel/:id`**
    *   **Description:** Cancels a subscription by ID.
    *   **Authentication:** Required.
    *   **Parameters:** `:id` (the subscription ID).
    *   **Validation:** Validates the subscription ID format and ensures the subscription belongs to the authenticated user.
    *   **Response:** The cancelled subscription object if found and authorized, otherwise a 404 or 403 error.

## How it Works

1.  An iOS application makes a request to an API endpoint (e.g., to create a subscription).
2.  The request includes a Firebase ID token in the `Authorization` header.
3.  The request hits the Express server.
4.  The `authMiddleware` intercepts the request and verifies the Firebase ID token using the Firebase Admin SDK.
5.  If the token is valid, the authenticated user's information (including UID) is attached to the request object (`req.user`). If invalid, a 401 or 403 error is returned.
6.  The request proceeds to the relevant route handler.
7.  Input validation middleware (`express-validator`) checks the request body and parameters against predefined rules. If validation fails, a 400 error with validation details is returned.
8.  If validation passes, the request reaches the controller function.
9.  The controller function uses Mongoose to interact with the MongoDB database.
10. For operations like getting, updating, or cancelling a subscription by ID, the controller includes a check to ensure the `userId` of the subscription matches the authenticated user's `req.user.uid` (Authorization).
11. Mongoose performs the requested database operation (create, find, update).
12. The controller sends a response back to the iOS application (e.g., the created/updated subscription object, or an error message).

## Text Diagram

```mermaid
sequenceDiagram
    iOS App->>+API: HTTP Request (with Firebase ID Token)
    API->>+authMiddleware: Verify Token
    authMiddleware->>Firebase Auth: Verify ID Token
    Firebase Auth-->>authMiddleware: Decoded Token or Error
    alt Token Valid
        authMiddleware->>API: Attach User Info to Request
        API->>+Validation Middleware: Validate Input
        alt Input Valid
            Validation Middleware->>API: Proceed to Controller
            API->>+Subscription Controller: Perform Operation
            Subscription Controller->>MongoDB: Mongoose Query
            MongoDB-->>Subscription Controller: Query Result
            Subscription Controller-->>-API: API Response Data
            API-->>-iOS App: HTTP Response (Success)
        else Input Invalid
            Validation Middleware-->>-API: Validation Errors
            API-->>-iOS App: HTTP Response (400 Bad Request)
        end
    else Token Invalid
        authMiddleware-->>-API: Authentication Error
        API-->>-iOS App: HTTP Response (401/403 Error)
    end
```

```text
+------------+
|  iOS App   |
+------------+
      | HTTP Request (with Firebase ID Token)
      v
+------------+
|    API     |
| (Express)  |
+------------+
      | authMiddleware
      v
+------------------+
| Firebase Auth    |
|  (Verify Token)  |
+------------------+
      |
      v
+----------------------+
|  Validation Middleware |
|  (express-validator) |
+----------------------+
      |
      v
+-----------------------+
| Subscription Controller |
+-----------------------+
      |
      v
+------------+
|  MongoDB   |
| (Mongoose) |
+------------+
      |
      v
+------------+
|    API     |
| (Express)  |
+------------+
      | HTTP Response
      v
+------------+
|  iOS App   |
+------------+
```

This README provides a comprehensive overview of your subscription API, its setup, endpoints, and how it processes requests.
