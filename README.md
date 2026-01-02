
# Swasth AI: Multilingual Semantic Search Health Awareness Chatbot

Swasth AI is an advanced, multilingual, semantic search-based health awareness platform. It is designed to provide reliable, language-independent medical information through an intuitive conversational interface, leveraging the power of Generative AI.

![Swasth AI Logo](https://img.icons8.com/fluency/96/heart-monitor.png)

## 🌟 Key Features

- **Semantic Intent Understanding**: Moves beyond keyword matching to understand the context and intent of health-related queries (e.g., recognizing "sugar problem" as "Diabetes").
- **Multilingual Support**: Real-time assistance in 7+ languages, including English, Hindi, Spanish, French, German, Chinese, and Arabic.
- **Voice Input Integration**: Allows users to describe symptoms or ask questions verbally for increased accessibility.
- **Disease Awareness**: Provides comprehensive information on symptoms, causes, and preventive measures for various conditions.
- **Secure & Private**: Does not store identifiable health records; focus on informational awareness.
- **Interactive UI**: A modern, responsive interface built with React and Tailwind CSS.

## 🛠️ Tech Stack

- **Frontend**: React (v19)
- **Styling**: Tailwind CSS
- **AI Core**: Google Gemini API (`@google/genai`)
- **Icons**: FontAwesome
- **Fonts**: Plus Jakarta Sans

## 🚀 Getting Started

### Prerequisites

- Node.js installed on your machine.
- A Google Gemini API Key.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/swasth-ai.git
   cd swasth-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory and add your API key:
   ```env
   API_KEY=your_google_gemini_api_key_here
   ```

4. **Run the application**
   ```bash
   npm start
   ```

## 📖 How It Works

1. **User Input**: Users can type or use voice commands to ask about health conditions.
2. **Processing**: The system uses the Google Gemini `gemini-3-flash-preview` model to process the query.
3. **Semantic Retrieval**: The AI interprets the intent, regardless of the language or phrasing used.
4. **Response**: The bot provides structured information focusing on awareness and prevention.

## ⚠️ Disclaimer

**Swasth AI is an informational tool for health awareness only.** It does not provide medical diagnosis, professional advice, or treatment. Users should always seek the advice of a qualified healthcare professional with any questions regarding a medical condition.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*Developed for the purpose of enhancing public health awareness and accessibility through modern AI technologies.*
