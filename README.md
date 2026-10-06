# Bartender's Companion 🍸

A full-stack cocktail recipe app built with React, Node.js, Express and MongoDB. Browse and search recipes, save favorites, add your own, and find out what you can mix with the ingredients you have at the bar.

<img width="1920" height="1032" alt="HomePage" src="https://github.com/user-attachments/assets/798f81f1-cbf1-4f01-9906-aac689901a6c" />

## Features

- **Browse and search** cocktail recipes with live, debounced search
- **"What can I make?"**: pick the ingredients you have and see which cocktails you can make right now, and which ones are missing just a single ingredient
- **User accounts** with registration, login and persistent sessions (JWT)
- **Favorites**: save cocktails to a personal list
- **Add, edit and delete your own recipes** with dynamic ingredient and step fields
- **Ownership enforced on the server**: you can only change recipes you created
- Responsive dark UI

  
## Screenshots
 
| Cocktail details | What can I make? |
|---|---|
| <img width="1920" height="1032" alt="Details" src="https://github.com/user-attachments/assets/4c54c930-cf44-45f5-a3a7-33ec63562d9d" /> | <img width="1920" height="1032" alt="WhatCanIMake" src="https://github.com/user-attachments/assets/ec814ee0-6283-459d-9cdd-381e15e43dcc" /> |

| Add a recipe | Favorites |
|---|---|
| <img width="1920" height="1032" alt="Add" src="https://github.com/user-attachments/assets/09118603-4a6c-4fac-8368-d5540478cc6b" /> | <img width="1920" height="1032" alt="Favorite" src="https://github.com/user-attachments/assets/7f30ee3d-2473-4595-94b3-b3e77d6dc3cb" /> |

## Getting started
 
### Prerequisites
 
- Node.js 18 or newer
- A MongoDB database: a local MongoDB server or a free MongoDB Atlas cluster
### 1. Clone the repository
 
```bash
git clone https://github.com/Alex7509/bartenders-companion.git
cd bartenders-companion
```
 
### 2. Set up the backend
 
```bash
cd server
npm install
```
 
Create a `.env` file in `server/` (use `.env.example` as a template):
 
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/bartenders-companion
JWT_SECRET=replace-with-a-long-random-string
```
 
Fill the database with sample data and start the server:
 
```bash
npm run seed
npm run dev
```
 
> ⚠️ `npm run seed` **deletes** all existing cocktails and ingredients before inserting the sample data, and clears every user's favorites. Do not run it against a database that holds data you want to keep.
 
The API runs on `http://localhost:5000`. Check `http://localhost:5000/api/health`.
 
### 3. Set up the frontend
 
In a second terminal:
 
```bash
cd client
npm install
```
 
Create a `.env` file in `client/` (use `.env.example` as a template):
 
```
VITE_API_URL=http://localhost:5000/api
```
 
Start the app:
 
```bash
npm run dev
```
 
Open `http://localhost:5173`.


