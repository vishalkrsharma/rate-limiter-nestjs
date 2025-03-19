# 🚀 NestJS Rate Limiter with Redis

## 📌 Description

This project is a **Rate Limiter** built using **NestJS** and **Redis**. It limits the number of API requests per IP address within a given time frame using NestJS's built-in **ThrottlerModule** and Redis for distributed rate limiting.

## 🎯 Features

- 🛠 **Rate Limiting**: Restricts excessive API calls from a single client.
- 🔥 **Redis Integration**: Uses Redis as a distributed store for managing request limits.
- ⚡ **NestJS Throttler**: Implements rate limiting efficiently.
- 🌍 **Deployed on Render**: Easily deployable and scalable.

---

## 📦 Installation

### 1️⃣ Clone the repository

```sh
git clone https://github.com/YOUR_USERNAME/rate-limiter-nestjs.git
cd rate-limiter-nestjs
```

### 2️⃣ Install dependencies

```sh
pnpm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root directory:

```sh
REDIS_URL=redis://your-redis-instance-url:6379
```

### 4️⃣ Start Redis Locally (Optional, for local development)

Ensure you have Redis installed and running:

```sh
redis-server
```

---

## 🚀 Running the Application

### 1️⃣ Development Mode

```sh
pnpm run start:dev
```

### 2️⃣ Production Mode

```sh
pnpm run build
pnpm run start:prod
```

---

## 🛠 API Endpoints

### 1️⃣ Rate-Limited Endpoint

```http
GET /
```

**Response:**

```json
{
  "message": "This route is rate-limited"
}
```

💡 **Rate Limit:** Only 10 requests per minute allowed per IP.

---

## 🚀 Deploy on Render

### 1️⃣ Push Code to GitHub

```sh
git add .
git commit -m "Initial commit"
git push origin main
```

### 2️⃣ Deploy on [Render](https://render.com)

1. Create a **New Web Service**.
2. Connect to GitHub and select this repository.
3. Set **Build Command**:
   ```sh
   pnpm install && pnpm run build
   ```
4. Set **Start Command**:
   ```sh
   pnpm run start:prod
   ```
5. Add **Environment Variables**:
   ```sh
   REDIS_URL=redis://your-redis-instance-url:6379
   ```
6. Click **Deploy**.

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss.

📧 **Contact:** [your.email@example.com](mailto:your.email@example.com)

---

## 💖 Acknowledgments

- [NestJS](https://nestjs.com/)
- [Redis](https://redis.io/)
- [Render](https://render.com/) for deployment.
