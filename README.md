# Pythagora Sentiment Analysis

Pythagora Sentiment Analysis is a web application designed to analyze customer feedback using the OpenAI API. It extracts and identifies key information such as topics, trends, pain points, experiences, behaviors, objections, desires, interests, frequent questions, product clarity, psychographics, potential room for improvement, and more. The goal is to empower support, marketing, and sales teams by leveraging this information for increased sales, product, and brand management.

## Overview

The application is built using the following technologies:
- **Backend**: Node.js with Express framework
- **Database**: MongoDB with Mongoose ORM
- **Frontend**: EJS for templating, Bootstrap for styling, and vanilla JavaScript for frontend logic
- **API Integration**: OpenAI API for sentiment analysis

### Project Structure
- **`models/`**: Contains Mongoose models for User and Feedback.
- **`public/`**: Contains static assets like CSS, JS, and images.
- **`routes/`**: Contains route definitions for authentication, feedback management, and aspect management.
- **`services/`**: Contains services for OpenAI API integration and validation.
- **`views/`**: Contains EJS templates for rendering the frontend.
- **`data/`**: Contains predefined data like emotions.
- **`uploads/`**: Contains uploaded CSV files for feedback import.

## Features

1. **Feedback Analysis**:
   - Analyze customer feedback to extract key information.
   - Identify key stages in the customer journey and analyze sentiment at each stage.
   - Segment customers based on their feedback.
   - Measure customer loyalty and satisfaction.
   - Identify factors contributing to customer churn.
   - Enhanced feedback selection and sorting with a dual-panel layout.

2. **Emotion Analysis**:
   - Identify emotions causing specific customer reactions.
   - Support for predefined and custom emotions.

3. **Aspect-based Sentiment Analysis**:
   - Analyze feedback based on predefined and custom user-defined aspects.

4. **Comparison Analysis**:
   - Compare sentiments across different products, features, or brands.

5. **Feedback Summary Generation**:
   - Generate summaries by sending feedback analyses to the OpenAI API.

6. **Profile Management and API Key Configuration**:
   - Users can set and update their OpenAI API key through a dedicated profile page.

## Getting started

### Requirements

- Node.js
- MongoDB (local installation or cloud version like MongoDB Atlas)

### Quickstart

1. **Clone the repository**:
   ```sh
   git clone <repository-url>
   cd pythagora-sentiment-analysis
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Set up environment variables**:
   - Create a `.env` file based on the provided `.env.example` file.
   - Set the required environment variables (`DATABASE_URL`, `SESSION_SECRET`, etc.).

4. **Run the application**:
   ```sh
   npm start
   ```

5. **Access the application**:
   - Open your browser and go to `http://localhost:3000`

### License

The project is open source, licensed under the MIT License. See the [LICENSE](LICENSE).

Copyright © 2024 Pythagora-io.