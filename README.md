# LinkToolkit Frontend

[![Vercel](https://deploy-badge.vercel.app/vercel/linktoolkit-ui?style=for-the-badge)](https://linktoolkit.nx7.tech)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

This repository contains the official frontend for LinkToolkit, a modern and feature-rich URL shortening platform. This application is built with **Next.js** and **React**, providing a fast, responsive, and user-friendly interface for interacting with the backend services.

**Live Application:** [**linktoolkit.nx7.tech**](https://linktoolkit.nx7.tech)

**Backend Repository:** [github.com/Sid-op777/linktoolkit-backend](https://github.com/Sid-op777/linktoolkit-backend)

---

## Features

This application provides a user interface for all of LinkToolkit's core features:

*   **Instant URL Shortening:** A clean and simple form for shortening long URLs, with options for custom aliases and link expiration.
*   **QR Code Generation:** Generate a scannable QR code for any link, which is then available for download.
*   **UTM Builder:** An intuitive utility to construct URLs with UTM parameters for campaign tracking.
*   **User Dashboard:** A secure, authenticated area where registered users can view, manage, and see at-a-glance statistics for all their created links.
*   **Detailed Analytics:** For each link, users can view a detailed analytics page with interactive charts displaying clicks over time, top referrers, devices, and geographic locations.
*   **API Key Management:** A dedicated section for users to generate and manage their API keys for programmatic access.

## Tech Stack & Architecture

This frontend is built with a focus on performance, developer experience, and modern best practices.

#### Core Technologies

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Material-UI (MUI)](https://img.shields.io/badge/MUI-5-007FFF?style=for-the-badge&logo=mui&logoColor=white)

#### Libraries & Tools

*   **Data Fetching:** Standard **Fetch API** for seamless communication with the backend.
*   **State Management:** Core React hooks (`useState`, `useEffect`) for managing component and application state.
*   **Data Visualization:** **Recharts** for creating beautiful and interactive analytics charts.
*   **Deployment:** Hosted on **Vercel**, providing a fast and reliable global CDN for an optimal user experience.

<!--
#### Architecture
-->


## Getting Started

Follow these instructions to get the project running on your local machine for development and testing.

### Prerequisites

*   **Node.js v18+**
*   **npm** or **yarn**

### Local Development Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Sid-op777/linktoolkit-ui.git
    cd linktoolkit-ui
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    Create a new file named `.env.local` in the root of the project. This file will tell your local frontend where to find the backend API.
    ```env
    # .env.local

    # URL of the backend API for local development
    BACKEND_BASE_URL=http://localhost:8080
    ```
    *Note: For this to work, the [LinkToolkit Backend](https://github.com/Sid-op777/linktoolkit-backend) must also be running locally on port 8080.*

4.  **Run the development server:**
    ```sh
    npm run dev
    # or
    yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
