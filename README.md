# AgriVision

### Unified AI-Powered Farm Intelligence Platform

AgriVision is a farmer-focused digital platform that brings **crop monitoring, livestock management, farm records, weather insights and AI-assisted advisory** into one place.

The idea is simple: a farmer should not have to use different tools for every problem on the farm.

AgriVision connects the information already available about a farm and turns it into a clear workflow:

**Observe → Analyze → Understand → Act → Record**

---

## Problem

Marginal farmers often face problems related to crop health, livestock, weather and farm records at the same time.

However, these services are usually fragmented.

A farmer may need:

* One tool for identifying crop diseases
* Another source for weather information
* Separate records for livestock
* Manual notebooks for farm history
* Different channels for agricultural advice

This makes it difficult to understand the complete situation of the farm and decide what action should be taken.

AgriVision addresses this fragmentation through a **single farm-level intelligence platform**.

---

## Our Solution

AgriVision creates a digital view of the farmer's entire farm.

It combines:

* Crop information
* AI-assisted crop image analysis
* Disease history
* Livestock records
* Weather information
* Farm activities
* Previous observations
* Tasks and alerts

The system can then use this context to provide useful, understandable recommendations.

Instead of simply saying:

> "Disease detected."

AgriVision aims to answer:

> **What changed? Why does it matter? What should I do next?**

---

# Key Features

## 1. Phone OTP Authentication

Farmers can securely access the platform using their mobile number.

### Features

* Phone number login
* OTP verification
* Persistent sessions
* Logout
* Profile management
* New-user farm setup
* Secure user-level data access

Authentication is designed around phone usage instead of requiring farmers to remember another password.

---

## 2. Farm Dashboard

The dashboard gives the farmer a quick overview of the farm.

It brings together:

* Overall farm health
* Crop health
* Livestock status
* Weather
* Active alerts
* Tasks
* Recent activities
* AI advisories

The objective is to answer the most important questions quickly:

**Is my farm healthy?**

**What needs attention?**

**Why?**

**What should I do next?**

---

## 3. Farm Digital Twin

AgriVision provides an interactive representation of the farm.

Fields and farm areas can be selected to view their information.

For each field, the farmer can see:

* Crop
* Field area
* Health score
* Disease risk
* Growth stage
* Last scan
* Irrigation information
* Expected yield
* Historical observations

This creates a digital memory of the farm instead of keeping information scattered across different places.

---

## 4. AI Crop Vision

The AI Vision module allows farmers to upload a crop image from their phone.

Supported crops can include:

* Tomato
* Potato
* Onion
* Chilli
* Brinjal
* Okra
* Cabbage
* Cauliflower
* Spinach
* Pea
* Carrot
* Cucumber
* Bottle Gourd
* Bitter Gourd
* Pumpkin
* Beans
* Corn
* Rice
* Wheat
* Mustard
* Cotton

The system can analyze an image for:

* Crop identification
* Possible disease/condition
* Confidence
* Severity
* Estimated affected area
* Visible symptoms
* Suggested next steps

### Analysis Flow

```text
Crop Image
    ↓
Image Quality Check
    ↓
Crop Identification
    ↓
Condition Analysis
    ↓
Confidence + Severity
    ↓
Affected Area
    ↓
Farm Context
    ↓
Advisory
```

AI results are treated as **AI-assisted observations**, not confirmed agricultural diagnoses.

Low-confidence results can request another image or expert verification.

---

## 5. Disease Progression Tracking

A single image only shows the current situation.

AgriVision also keeps previous observations so the farmer can understand how a condition is changing.

For example:

```text
Day 1     →     Day 4     →     Day 8

 8%              14%             23%
affected         affected        affected
area             area            area
```

The system can show:

* Previous scans
* Affected-area changes
* Severity changes
* Health score trends
* Treatments recorded
* Weather context

This helps the farmer understand **progression rather than only detection**.

---

## 6. Livestock Management

AgriVision also manages livestock records from the same platform.

Supported animals can include:

* Cow
* Buffalo
* Goat
* Sheep
* Chicken

Each animal can have its own profile containing:

* Animal ID
* Type
* Age
* Weight
* Health status
* Vaccination records
* Observations
* Health history

The goal is to replace scattered livestock records with a structured digital history.

---

## 7. AI-Assisted Livestock Observation

Farmers can upload livestock images for AI-assisted visual observations.

The system can provide:

* Animal type
* Visible observations
* Confidence
* Risk indication
* Suggested follow-up

The application clearly distinguishes AI observations from professional veterinary diagnosis.

For health concerns requiring professional attention, the system should encourage consultation with a qualified veterinarian.

---

## 8. Weather Intelligence

Weather information is connected with the farm context.

The system can display:

* Current temperature
* Humidity
* Rain probability
* Wind
* UV
* Precipitation
* Forecast information

Instead of showing weather as an isolated widget, AgriVision can use it as another signal for farm-level advisory.

Example:

```text
High humidity
      +
Rain forecast
      +
Existing fungal-risk condition
      ↓
Higher monitoring priority
```

The system presents this as a risk indication rather than a guaranteed prediction.

---

## 9. AI Farm Assistant

AgriVision includes a context-aware AI Assistant.

It is designed to work with the farmer's own farm information.

The assistant can use relevant context such as:

* Current crops
* Recent crop scans
* Disease history
* Livestock records
* Weather
* Tasks
* Farm timeline
* Previous observations

Example:

**Farmer:**

> Why is my tomato health going down?

Instead of giving a generic response, the assistant can use recent farm information to explain possible reasons.

It can also suggest actions such as:

* Inspect a field
* Review a recent scan
* Create a task
* Check weather
* Review previous observations

AI-generated actions should require user confirmation before changing farm records.

---

## 10. Advisory System

The Advisory section converts farm signals into understandable actions.

Advisories can be generated from:

* Crop observations
* AI scans
* Weather
* Disease progression
* Livestock records
* Farm history

Example:

```text
HIGH PRIORITY

Tomato field requires inspection.

Reason:
Affected area has increased in recent scans.

Recommended:
Inspect nearby plants and review
the previous treatment record.
```

The farmer can:

* View evidence
* Create a task
* Mark advisory as handled
* Ask AI for more information

---

## 11. Real-Time Alerts

Important events can generate alerts.

Examples:

* Disease condition detected
* Disease risk increased
* Weather-related risk
* Inspection overdue
* Livestock vaccination reminder
* Task overdue
* Important advisory

Alerts are connected to their source so the farmer can understand **why the alert was generated**.

---

## 12. Task Management

Recommendations should not remain only as notifications.

The farmer can convert them into tasks.

Example:

```text
Task:
Inspect North Field

Priority:
High

Reason:
Disease progression

Status:
Todo
```

Task states:

* Todo
* In Progress
* Completed
* Overdue

This creates a direct connection between:

**AI insight → farmer action**

---

## 13. Farm Timeline

The timeline keeps a chronological history of important farm events.

Example:

```text
08:42  Crop scanned

09:10  Condition detected

09:18  Treatment recorded

11:30  Irrigation completed

14:20  Weather alert

18:00  AI advisory generated
```

Every important event can be opened to view additional details.

---

## 14. Analytics

The Analytics section converts farm records into useful trends.

Metrics can include:

* Crop health
* Disease frequency
* Disease progression
* Yield estimates
* Treatment history
* Livestock health
* Task completion
* Farm activity

Time ranges:

* 7 days
* 30 days
* 90 days
* Season

Charts are based on farm records rather than static dashboard values.

---

# Farmer-Friendly Design

AgriVision is designed for real-world rural conditions.

## Simple Mode

Simple Mode reduces complex information into clear states:

```text
GOOD

WATCH

ACTION NEEDED
```

The interface uses:

* Large touch targets
* Simple navigation
* Clear language
* Mobile-first layouts
* Hindi and English support

The architecture can be extended to additional regional languages.

---

# Offline-First Approach

Connectivity can be unreliable in rural areas.

AgriVision is designed around an offline-first approach.

When offline, users can continue to access previously synchronized information and create supported observations or tasks.

Changes can be queued and synchronized when connectivity returns.

```text
ONLINE
   ↓
Local + Cloud

OFFLINE
   ↓
Local Data
   ↓
Queued Changes
   ↓
Internet Restored
   ↓
Automatic Sync
```

The interface communicates the current state:

* Offline
* Syncing
* Synced

---

# Real-Time Data

The platform is designed to use real-time data updates.

For example:

```text
AI Scan
   ↓
Disease Record Created
   ↓
Crop Health Updated
   ↓
Alert Generated
   ↓
Timeline Updated
   ↓
Dashboard Updated
```

The farmer does not need to manually refresh the entire dashboard to see related updates.

---

# Technology Stack

## Frontend

* Next.js
* TypeScript
* React
* Tailwind CSS
* shadcn/ui
* Lucide Icons
* Recharts

## Backend

* Python
* FastAPI
* REST APIs

## Authentication

* Firebase Authentication
* Phone OTP

## Database

* Firebase Firestore

## Storage

* Firebase Storage

## AI

* Multimodal AI API
* Gemini / compatible AI provider
* AI-assisted image analysis
* Context-aware AI Assistant

## Weather

* External weather API

## Notifications

* Firebase Cloud Messaging

---

# System Architecture

```text
                    FARMER
                       │
             ┌─────────┴─────────┐
             │                   │
          MOBILE               WEB
             │                   │
             └─────────┬─────────┘
                       ↓
                AGRIVISION APP
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
      Firebase      FastAPI       Storage
       Auth         Backend       & Images
          │            │
          │      ┌─────┼─────┐
          │      ↓     ↓     ↓
          │     AI   Weather Tasks
          │      │     │     │
          └──────┴─────┴─────┘
                       ↓
                FARM CONTEXT
                       ↓
             ┌─────────┴─────────┐
             ↓                   ↓
         ADVISORY              ALERT
             ↓                   ↓
             └─────────┬─────────┘
                       ↓
                FARMER ACTION
                       ↓
                  FARM HISTORY
```

---

# Database Structure

Core entities include:

```text
User
 └── Farms

Farm
 ├── Fields
 ├── Crops
 ├── Livestock
 ├── Observations
 ├── Disease Detections
 ├── Treatments
 ├── Advisories
 ├── Alerts
 ├── Tasks
 ├── Timeline Events
 └── AI Conversations
```

The architecture is designed so each authenticated user can only access the farms and records they are authorized to access.

---

# Security

Security considerations include:

* Firebase Authentication
* Firestore security rules
* Storage security rules
* Server-side AI API calls
* Environment variables for secrets
* Input validation
* File upload validation
* Authentication-based authorization
* User-level farm data isolation

API keys must never be exposed in the frontend.

---

# AI Safety

AI is used as an assistance layer, not as an unquestionable source of truth.

The application uses:

* Confidence thresholds
* Image quality checks
* Structured AI responses
* Farm context
* Clear uncertainty messaging
* Human/expert verification where appropriate

The system should never present an AI observation as a guaranteed agricultural or veterinary diagnosis.

---

# Project Structure

A suggested structure:

```text
agrivision/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   └── types/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── ai/
│   │
│   └── requirements.txt
│
├── firebase/
│   ├── firestore.rules
│   ├── storage.rules
│   └── indexes.json
│
├── .env.example
├── README.md
└── LICENSE
```

---

# Getting Started

## Prerequisites

Make sure you have:

* Node.js
* npm
* Python 3.10+
* Firebase project
* AI API key
* Weather API key

---

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/agrivision.git
cd agrivision
```

---

## 2. Install frontend dependencies

```bash
cd frontend
npm install
```

---

## 3. Install backend dependencies

```bash
cd ../backend
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux/macOS

```bash
source venv/bin/activate
```

Then:

```bash
pip install -r requirements.txt
```

---

# Environment Variables

Create the required environment files using `.env.example` as the reference.

Example:

```env
GEMINI_API_KEY=your_api_key
WEATHER_API_KEY=your_api_key

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
```

Never commit real credentials.

---

# Run the Frontend

```bash
cd frontend
npm run dev
```

The frontend will run on the local development server.

---

# Run the Backend

```bash
cd backend
uvicorn app.main:app --reload
```

The FastAPI backend will start in development mode.

---

# Core User Flow

```text
Phone OTP Login
       ↓
Farm Setup
       ↓
Dashboard
       ↓
Add Crop / Livestock
       ↓
AI Crop Scan
       ↓
AI Analysis
       ↓
Disease / Condition
       ↓
Severity + Confidence
       ↓
Farm History + Weather
       ↓
Advisory
       ↓
Alert / Task
       ↓
Timeline
       ↓
Future Observation
       ↓
Progression Tracking
```

---

# Example AI Scan

```text
Crop:
Tomato

Possible Condition:
Early Blight

Confidence:
94%

Severity:
Moderate

Affected Area:
18%

Risk:
Medium

Recommended:
Inspect nearby plants and monitor
the field over the next few days.
```

The actual result depends on the image and configured AI model.

---

# Example AI Assistant

### Farmer

```text
Why is my tomato health going down?
```

### Agri Assistant

```text
Your recent tomato observations show
an increase in affected leaf area.

The latest scan indicates a higher
level of visible symptoms compared
with the previous observation.

I recommend inspecting the nearby
plants and reviewing the previous
treatment record.
```

The assistant is designed to use the farm's available context instead of responding only from a generic knowledge base.

---

# Why AgriVision Is Different

Most agricultural applications focus on one specific feature.

AgriVision focuses on the **connection between features**.

```text
Crop Image
    +
Previous Observations
    +
Weather
    +
Crop History
    +
Farm Activities
    ↓
Farm Context
    ↓
Better Advisory
```

The important part is not just detecting a disease.

The important part is remembering what happened before and helping the farmer decide what to do next.

---

# Innovation

### Farm Context Layer

The core differentiator is the farm context layer.

Every new observation can become part of the farm's history.

This allows the system to move from:

**One-time AI prediction**

to:

**Continuous farm intelligence.**

---

# Expected Impact

AgriVision aims to help farmers:

* Detect potential crop problems earlier
* Maintain organized farm records
* Monitor crop health over time
* Keep structured livestock records
* Understand weather-related risks
* Convert recommendations into tasks
* Access farm information from one place
* Make better-informed decisions

The system is designed to measure real outcomes during pilot deployment rather than making unsupported claims about percentage improvements.

Potential evaluation metrics include:

* AI observation agreement with expert assessment
* Advisory usage
* Repeat usage
* Response time
* Number of digital farm records maintained
* Task completion
* Offline synchronization success
* Low-confidence detection rate

---

# Future Scope

AgriVision can be extended with:

* Regional language support
* Voice-first interaction
* IoT soil sensors
* Weather stations
* Smart irrigation integration
* Expert consultation
* Government agriculture services
* Satellite/remote-sensing data
* More crop and disease models
* Advanced yield forecasting
* Edge AI for low-connectivity environments

---

# Smart India Hackathon 2026

AgriVision is developed for:

**Smart India Hackathon 2026**

### Problem Statement

**Unified AI Agri-Vision Platform for Crop Advisory and Livestock Management**

### Category

**Software**

---

# Team

### AgriVision Team

**Lalit Kumar** — Team Lead

**Parul Agrawal**

**Muskan Jindal**

**Kashish Tiwari**

**Vishal Meena**

**Akanksha Kataria**

---

# Project Vision

We want to make farm technology less fragmented and more useful.

A farmer should not need to understand five different applications to understand their own farm.

AgriVision brings the information together and turns it into something more practical:

**What happened?**

**Why does it matter?**

**What should I do next?**

---

## Built with purpose for farmers.

**AgriVision — One intelligent system for your entire farm.**

---
