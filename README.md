# RepConnect 💬

A real-time, full-stack messaging application that connects users quickly, securely, and seamlessly.

## ✨ Key Features

- **Real-time Messaging:** Send and receive messages with ultra-low latency.
- **Secure Authentication:** Secure login integrated via Google OAuth2.
- **Status Management:** Display user active status (online/offline).
- **User-friendly Interface:** Modern, responsive design across multiple devices.

## 🛠 Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express (or NestJS)
- **Database:** MongoDB
- **Authentication:** Google OAuth2
- **Real-time:** Socket.io / Pusher

## 🚀 Getting Started

Follow the steps below to set up the development environment on your local machine.

### Prerequisites

- Node.js (version 18.x or higher)
- MongoDB (or MongoDB Atlas URI)
- Git

### Installation Steps

1. **Clone the repository:**

```bash
   git clone https://github.com/Duyrep/repconnect.git
   cd repronnect
```

2. **Install dependencies:**

```bash
   pnpm install
```

3. **Set up environment variables:**
   Create a `.env.development` file in the root directory and set its values to be the same as those in the `.env.example` file.

4. **Run the application:**

```bash
   pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the result.

## 📄 License

Distributed under the MIT License.
