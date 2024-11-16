# Pythagora Sentiment Analysis

Pythagora Sentiment Analysis is a web application designed to analyze customer feedback using the OpenAI API. The application extracts and identifies key information such as topics, trends, pain points, experiences, behaviors, objections, desires, interests, frequent questions, product clarity, psychographics, potential room for improvement, and more. The core goal is to empower support, marketing, and sales teams by leveraging this information for increased sales, product, and brand management.

## Overview

The Pythagora Sentiment Analysis application is built using the following technologies:

- **Node.js**: JavaScript runtime for building the application.
- **Express**: Web server framework for Node.js.
- **MongoDB**: NoSQL database for storing user data, feedback, and analysis results.
- **Mongoose**: ORM for MongoDB to manage database operations.
- **EJS**: Templating engine for rendering dynamic web pages.
- **Bootstrap**: Front-end framework for styling.
- **Vanilla JavaScript**: Plain JavaScript for frontend logic.
- **OpenAI**: Client library for integrating with the OpenAI API.
- **Bcrypt**: Library for hashing passwords.
- **JsonWebToken**: Library for creating and verifying JSON Web Tokens.
- **Body-Parser**: Middleware to parse incoming request bodies.
- **Dotenv**: Module to load environment variables from a .env file.

### Project Structure

The project is organized into the following directories and files:

- **data/**: Contains predefined data such as emotions.
- **models/**: Mongoose models for User and Feedback.
- **public/**: Static files including CSS, JavaScript, and images.
- **routes/**: Express routes for handling authentication, feedback, and aspects.
- **services/**: Services for interacting with OpenAI API and validating API keys.
- **views/**: EJS templates for rendering pages.
- **uploads/**: Directory for uploaded CSV files.
- **.env**: Configuration file for environment variables.
- **.env.example**: Example configuration file for environment variables.
- **.gitignore**: Specifies files to be ignored by Git.
- **README.md**: Documentation file.
- **package.json**: Node.js project metadata and dependencies.
- **server.js**: Main server file to start the application.

## Features

The application provides the following features:

1. **Feedback Analysis**: Analyze customer feedback to extract key information such as topics, trends, pain points, experiences, behaviors, objections, desires, interests, frequent questions, product clarity, psychographics, and potential room for improvement.
2. **Customer Journey Analysis**: Identify key stages in the customer journey and analyze sentiment at each stage.
3. **Customer Segmentation**: Segment customers based on their feedback to identify specific needs and preferences.
4. **Customer Loyalty Analysis**: Measure customer loyalty and identify contributing factors to loyalty or disloyalty.
5. **Customer Satisfaction Analysis**: Measure overall customer satisfaction and identify areas for improvement.
6. **Customer Churn Analysis**: Identify factors contributing to customer churn and develop retention strategies.
7. **Emotion Analysis**: Identify emotions causing specific customer reactions, with predefined and custom emotions.
8. **Aspect-based Sentiment Analysis**: Analyze feedback based on predefined and custom user-defined aspects.
9. **Comparison Analysis**: Compare sentiments across different products, features, or brands within a specified time period.
10. **Feedback Summary Generation**: Generate a summary of feedback analyses.
11. **Profile Management**: Manage OpenAI API key through a dedicated profile page.
12. **User Registration and Login**: Simple username and password-based authentication.

## Getting started

### Requirements

To run the project, you need the following technologies/setup on your computer:

- Node.js
- MongoDB (or use a cloud version such as MongoDB Atlas)
- OpenAI API key

### Quickstart

Follow these steps to set up and run the project:

1. **Clone the repository**:
    ```sh
    git clone <repository_url>
    cd pythagora-sentiment-analysis
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Set up environment variables**:
    - Create a `.env` file in the project root based on the `.env.example` file.
    - Add your MongoDB connection string, session secret, and other required environment variables.

4. **Run the application**:
    ```sh
    npm start
    ```

5. **Access the application**:
    - Open your browser and navigate to `http://localhost:3000`.

### License

The project is proprietary (not open source).

```