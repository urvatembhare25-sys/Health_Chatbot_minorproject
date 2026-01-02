
# Swasth AI Technical Requirements

This document outlines the requirements for the Swasth AI platform as presented in the research paper.

## 1. Functional Requirements
- **Multilingual Support**: The system must process queries in English, Hindi, Spanish, French, German, Chinese, and Arabic.
- **Semantic Search**: Capability to understand user intent behind paraphrased queries (e.g., mapping "high sugar" to "Diabetes awareness").
- **Voice Interaction**: Integration of browser-based voice recording and AI-driven transcription/intent extraction.
- **Informational Knowledge Base**: Provide symptoms, causes, and prevention methods for common diseases.
- **Safety Safeguards**: Implementation of mandatory medical disclaimers and refusal of diagnostic/prescription requests.

## 2. Technical Requirements
- **Frontend**: React 19+ with Tailwind CSS for a responsive, mobile-first design.
- **NLP Engine**: Google Gemini API (gemini-3-flash-preview) for semantic understanding and generation.
- **Audio Processing**: MediaRecorder API for capturing PCM/WebM audio streams.
- **Environment**: Secure handling of `API_KEY` via environment variables.

## 3. Deployment Requirements
- **Web Server**: Static hosting for the frontend (e.g., Vercel, Netlify) or a Flask-based backend for custom semantic retrieval logic.
- **Connectivity**: Requires active internet access for real-time Gemini API interaction.
- **Permissions**: Browser permission for `microphone` access must be requested.
