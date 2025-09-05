<div align="center">
   <img width=100% src="https://capsule-render.vercel.app/api?type=waving&height=100&color=gradient&reversal=true" />
</div>

<p align="center">
  <img src="readme assets/mew_big.png" alt="MewChat Logo" width="120" />
</p>

<h3 align="center">
  🐾 MewChat – A secure real-time chat app with email OTP signup and instant messaging
  <img src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif" width="28">
</h3>

<p align="center">
  <a href="https://github.com/aditya-2145/mewchat">
    <img src="https://readme-typing-svg.herokuapp.com?lines=Real-time+Chat+App;Email+OTP+Signup;Secure+Messaging;MERN+Stack+%26+Socket.IO&center=true&width=500&height=45&color=36BCF7&vCenter=true&pause=1000">
  </a>
</p>

<p align="center">
  <a href="https://github.com/aditya-2145/mewchat">
    <img src="https://visitor-badge.laobi.icu/badge?page_id=your-username.mewchat" alt="visitors">
  </a>
</p>

---

## ✨ About MewChat  

MewChat is a **real-time chat application** built with the **MERN stack** and **Socket.IO**.  
It ensures **secure onboarding with Email OTP verification** and provides a smooth instant messaging experience.  

---

## 🛠️ Tech Stack  

#### ⚡ Frontend  
- React.js (Context API)  
- Axios  
- TailwindCSS  

#### ⚙️ Backend  
- Node.js + Express.js  
- MongoDB + Mongoose  
- JWT + bcrypt (Authentication)  
- Nodemailer (Email OTP)  

#### 🔗 Real-time  
- Socket.IO  

#### ☁️ Cloud  
- Cloudinary (for profile pictures)  

---

## 🔄 Signup Workflow  

<p align="center">
  <img src="readme assets/signup-flow.png" alt="Signup Workflow" width="80%">
</p>

```mermaid
flowchart TD
    A[User enters email & password] --> B[Backend generates OTP]
    B --> C[Send OTP via Email]
    C --> D[User enters OTP in UI]
    D --> E[Verify OTP]
    E -->|Valid| F[Create Account ✅]
    E -->|Invalid| G[Reject ❌]
```
---

## 📸 Screenshots  

<p align="center">
  <img src="readme assets/login.png" width="45%" alt="Login Page" />
  <img src="readme assets/otp.png" width="45%" alt="otp-verify" />
</p>

<p align="center">
  <img src="readme assets/profile.png" width="45%" alt="Profile" />
  <img src="readme assets/chat.png" width="45%" alt="chat" />
</p>

---

## ⚙️ Installation & Setup  

```bash
# Clone the repository
git clone https://github.com/your-username/mewchat.git
cd mewchat

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 🔧 Environment Variables  

Create `.env` inside `server/` with:  
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### ▶️ Run the App  

```bash
# Start backend
cd server
npm run dev

# Start frontend
cd client
npm start
```

App runs at: **http://localhost:5000** 🎉  

---

## 🔮 Future Enhancements  
- ✅ Group chats  
- 🌙 Dark mode  
- 📞 Voice & Video calls  

---

## 📜 License  
This project is licensed under the **MIT License**.  

---

<div align="center">
   <b>🐾 MewChat – Chat made secure & simple!</b>
</div>
