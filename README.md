# 🏬 SuperMall – Multi-Vendor Shopping Platform

<p align="center">
  <!-- 🔥 Add your animated banner here -->
  <!-- Example ↓ (change path when you upload your banner) -->
  <img src="assets/banner.gif" width="100%" />
</p>

SuperMall is a modern multi-vendor shopping platform where shops can upload products, manage inventory, publish offers, and customers can browse by category, floor and shop — with complete cart + checkout flow.

---

## 🚀 Features

### 👤 User
- Browse products by Category
- Browse products by Floor
- Shop wise listing
- Add to cart
- Checkout
- Order history
- Order detail popup
- User profile
- Update photo
- Update name
- Firebase Auth

### 🏬 Shop Owner
- Shop dashboard
- Add products
- Edit / delete products
- Manage offers
- Stock management
- View orders

### 🛠 Admin
- Admin dashboard
- Manage shops
- Manage categories
- Manage floors
- View analytics

---

## 🧰 Tech Stack

**Frontend**
- Next.js
- React
- TailwindCSS
- Context API
- Lucide Icons

**Backend**
- Firebase Firestore
- Firebase Auth
- Firebase Storage

---

## 📁 Folder Structure

supermall/
│
├─ app/
├─ components/
├─ contexts/
├─ lib/
│ ├─ firestore/
│ ├─ firebase.js
└─ public/



---

## 🛎 Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/mahiman1506/supermall.git

cd supermall
npm install

## CREATE .env file
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

## Start development
npm run dev

## open browser
http://localhost:3000

