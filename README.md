```markdown
# Pythagora Sentiment Analysis

Pythagora Sentiment Analysis is a web application designed to analyze customer feedback using the OpenAI API. It extracts and identifies key information such as topics, trends, pain points, experiences, behaviors, objections, desires, interests, frequent questions, product clarity, psychographics, potential room for improvement, and more. The goal is to empower support, marketing, and sales teams by leveraging this information for increased sales, product, and brand management.

## Overview

The Pythagora Sentiment Analysis tool is built using the following technologies:

- **Node.js**: JavaScript runtime for building the application.
- **Express**: Web server framework for Node.js.
- **MongoDB**: NoSQL database for storing user data, feedback, and analysis results.
- **Mongoose**: ORM for MongoDB.
- **EJS**: Embedded JavaScript templating for rendering views.
- **Bootstrap**: Front-end framework for styling.
- **Vanilla JavaScript**: Plain JavaScript for frontend logic.
- **OpenAI**: Client library for OpenAI API integration.
- **Bcrypt**: Library for hashing passwords.
- **Jsonwebtoken**: Library for creating and verifying JSON Web Tokens.
- **Body-parser**: Middleware to parse incoming request bodies.
- **Dotenv**: Module to load environment variables from a .env file.

### Project Structure

The project structure includes the following key directories and files:

- `data/`: Contains data files such as `emotions.js`.
- `models/`: Defines Mongoose schemas for `Feedback` and `User`.
- `public/`: Contains static assets like CSS, JavaScript files.
- `routes/`: Defines Express routes for authentication, feedback management, and aspect management.
- `services/`: Contains services for OpenAI API integration and validation.
- `views/`: EJS templates for rendering the web pages.
- `.env.example`: Template for environment variables.
- `server.js`: Main server file to set up and run the Express application.

## Features

- **Feedback Analysis**: Analyze customer feedback to extract key information including topics, trends, pain points, and more.
- **Customer Journey Analysis**: Identify key stages in the customer journey and analyze sentiment at each stage.
- **Customer Segmentation**: Segment customers based on their feedback to identify specific needs and preferences.
- **Customer Loyalty and Satisfaction Analysis**: Measure customer loyalty and satisfaction, identifying areas for improvement.
- **Customer Churn Analysis**: Identify factors contributing to customer churn and develop retention strategies.
- **Enhanced Feedback Selection and Sorting**: Use a two-panel layout for feedback selection, sorting, and analysis.
- **Emotion Analysis**: Identify emotions causing specific customer reactions.
- **Aspect-based Sentiment Analysis**: Analyze feedback based on predefined and custom user-defined aspects.
- **Comparison Analysis**: Compare sentiments across different products, features, or brands.
- **Feedback Summary Generation**: Generate summaries of feedback analyses.
- **Profile Management and API Key Configuration**: Manage OpenAI API keys through a user profile page.

## Getting Started

### Requirements

To run this project, you need to have the following set up on your computer:

- Node.js
- MongoDB (local installation or cloud version like MongoDB Atlas)

### Quickstart

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/pythagora-sentiment-analysis.git
   cd pythagora-sentiment-analysis
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Create a `.env` file based on the `.env.example` template and fill in the required values:
     ```
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/pythagora-sentiment-analysis
     SESSION_SECRET=your_session_secret
     ```

4. **Run the application**:
   ```bash
   npm start
   ```

5. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`.

### License

The project is proprietary (not open source). 

```
© 2024. All rights reserved.
```
```
