                                                                      KalaConnect
👇👇👇👇👇👇👇👇👇👇👇👇👇🤘🤘🤘🤘🤘

KalaConnect is a modern platform that bridges tradition and technology, empowering artisans and creators to showcase their work with the help of AI-driven tools. It provides a digital marketplace and community where artists can easily list, promote, and sell their creations.

✨ Features
Current

Next.js + TypeScript base app

Tailwind CSS styling setup

Firebase integration planned (auth, hosting, DB)

Deployment on Render for easy hosting

Planned

AI-powered product listing generator

Artist profile pages

Smart recommendations & analytics for artisans

Integrated marketplace for craft sales

Responsive UI for mobile and desktop

Authentication (Google, email, etc.)

⚙️ Setup Instructions

Clone the repo

git clone https://github.com/dhruvsoran/Kalaconnect.git
cd Kalaconnect


Install dependencies

npm install
# or
yarn install


Environment variables

Create a .env.local file in the root directory.

Add Firebase keys and other secrets here.

Example (.env.example):

NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here


Run locally

npm run dev


App will be available at: http://localhost:3000

Build for production

npm run build
npm start

🛠 Tech Stack

Frontend: Next.js
 with React

Language: TypeScript

Styling: Tailwind CSS

Backend / DB: Firebase
 (planned)

Hosting: Render
 / Firebase Hosting

🚀 Deployment
🔹 Render (Production Deployment)

Push your project to GitHub.

Go to Render
.

Create a new Web Service → connect your GitHub repo.

Choose environment: Node.

Add environment variables in the Render Dashboard (from .env.local).

Set build & start commands:

Build command:

npm install && npm run build


Start command:

npm start


Deploy → Render will automatically build & host your app.

Your app will be live at:
👉 https://kalaconnect.onrender.com/

🔹 Firebase (Optional / Alternative)

Install Firebase CLI:

npm install -g firebase-tools


Login:

firebase login


Deploy:

firebase deploy
