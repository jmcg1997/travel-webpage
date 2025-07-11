# 📘 Devlog – Travel Bucket List Web Page

This document outlines the weekly development process, reflections, and technical learnings behind the **Travel Bucket List Web Page**, a full-stack travel management platform created as the Capstone Project for a Software Development Bootcamp.

---

## 🗓️ Week 1: Planning & Architecture

### ✅ Tasks Completed

* Defined the core concept: an app for users to manage and explore travel destinations.
* Outlined MVP and stretch features.
* Designed database models: `User`, `Destination`, `Favorite`, and `CityPlaces`.
* Sketched frontend structure: React pages, modals, and reusable components.
* Chose tech stack: React, Express.js, MongoDB, Tailwind CSS, and third-party APIs.

### 🔍 Challenges

* Narrowing scope without losing value.
* Designing a flexible schema that supports image uploads, user favorites, and city-based search.

### 💡 Learnings

* Value of designing clear data models before coding.
* How to approach a modular folder structure from the start.

---

## 🗓️ Week 2: Backend & API Integration

### ✅ Tasks Completed

* Built Express routes for `auth`, `destinations`, `favorites`, `quote`, `nearby`, and `geocode`.
* Integrated JWT authentication.
* Configured MongoDB Atlas and tested CRUD routes with Thunder Client.
* Connected to external APIs:

  * **Unsplash**: for fetching images of destinations.
  * **OpenTripMap**: to get nearby attractions for Explore module.
* Validated input data on the backend with custom middleware.

### 🔍 Challenges

* Handling Unsplash limits and optimizing fetch logic.
* Structuring API logic into clean controller files.

### 💡 Learnings

* Securing APIs with environment variables using `.env` files.
* Writing robust error handling and clean controller-service separation.

---

## 🗓️ Week 3: Frontend Development

### ✅ Tasks Completed

* Created React pages:

  * `Register`, `Login`, `Profile`, `Home`, `Explore`, `Destinations`, `UploadPhoto`, `ForgotPassword`, `ResetPassword`, etc.
* Added conditional rendering and protected routes using React Router and context.
* Built reusable components: `Navbar`, `Loader`, `DestinationCard`, `DestinationForm`, `PhotoModal`.
* Developed responsive design with Tailwind CSS.
* Connected frontend with backend via Axios (with token interceptor).
* Integrated toast notifications with `react-hot-toast`.

### 🔍 Challenges

* Ensuring file uploads worked cross-platform.
* Maintaining responsive UI with Tailwind grid and conditional classNames.

### 💡 Learnings

* Best practices for Axios interceptor configuration.
* Clean handling of form input and state management with `useState` and `useEffect`.

---

## 🗓️ Week 4: Final Polish & Deployment

### ✅ Tasks Completed

* Refactored: removed unused files (e.g., `UserContext`, `SuccessModal`, `ConfirmModal`).
* Reorganized components and modals into logical folders.
* Created custom views for password reset and email verification simulation.
* Deployed frontend and backend separately using **Render**.
* Wrote and refined `README.md` and `DEVLOG.md`.
* Conducted user testing to validate all flows.

### 🔍 Challenges

* Route mismatches on initial load (`/` going to NotFound).
* Final UI tweaks to ensure mobile responsiveness.
* API rate limits during Explore testing.

### 💡 Learnings

* Deploying full-stack apps using Render free tier.
* Importance of testing on clean environments (empty localStorage, new accounts).

---

## ✍️ Reflections

This capstone project consolidated everything I learned throughout the bootcamp:

* How to plan and deliver a full-stack app end to end.
* Connecting third-party APIs to enrich user experience.
* Building user authentication with real-world security measures.
* Writing clean, modular, and maintainable code.
* Handling edge cases and errors gracefully.

This was the most comprehensive project I’ve developed so far. I’m proud of the result and excited to expand its features in the future.

---

## ⏰ Submission

**Due Date:** July 13, 2025 @ 11:59 PM
**Delivered:** ✅ Live app deployed and repository submitted

---

## 🔗 Links

* 🔴 **Live Demo**: [https://travel-webpage.onrender.com](https://travel-webpage.onrender.com)
* 📂 **GitHub Repo**: [https://github.com/jmcg1997/travel-webpage](https://github.com/jmcg1997/travel-webpage)

---

## ✅ Next Steps (Post-Bootcamp)

- Implement dark mode toggle and theme saving
- Public profile sharing and user interactions
- Public sharing of destinations and photo galleries
- Social login integration (Google, GitHub)
- Continuous Deployment with GitHub Actions
- Add test coverage with Jest or Vitest
- Refactor API layer with retry and fallback logic
- Add offline support with Progressive Web App (PWA) features
- Allow users to customize profile backgrounds (color themes or image upload)
- Expand Explore categories:
  - Lodging (where to sleep)
  - Restaurants (where to eat)
  - Local events (concerts, festivals, sports, etc.)

## 🌐 Medium to Long-Term Vision

Introduce advanced social features and user-generated content:

- Follow or friend other users
- Like, comment on, and share destinations and galleries
- Public and private messaging between users
- Share short-form content (similar to Instagram Reels or TikToks)

---

🙏 Special Thanks

A heartfelt thank you to **Gurneesh Singh**, my instructor, for his guidance, feedback, and unwavering support throughout the bootcamp. His mentorship played a key role in helping me complete this project and grow as a developer.

Gratitude also to **Circuit Stream** for providing a structured, hands-on learning environment that empowered me to develop real-world applications and strengthen my full-stack development skills.

Thanks as well to all instructors and peers for their support and feedback during this journey. 🙌

