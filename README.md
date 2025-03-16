# RadiatorForge  

RadiatorForge is a feature-rich platform inspired by Behance, designed to showcase creative projects, enable real-time communication, and foster a vibrant creative community. Built with a modern stack and deployed using AWS infrastructure, RadiatorForge offers a seamless and responsive experience across both desktop and mobile environments.  

## 🚀 Core Features  

### 🎨 Project Showcase & Management  
- Upload and update projects with support for images and videos.  
- Personal profile pages with editable avatars, banners, and profile details.  
- Projects can be:  
  - Liked  
  - Bookmarked  
  - Commented on to show appreciation  
  - Shared with different levels of Creative Commons rights  

---

### 🔎 Powerful Search & Discovery  
- Advanced search across both projects and users.  
- Efficient pagination and real-time updates for smooth browsing.  

---

### 🗨️ Real-Time Messaging  
- Direct messaging between users, allowing creators and employers to connect.  
- Real-time chat using WebSockets for instant communication.  

---

### 👥 User Engagement  
- Follow/unfollow functionality for building connections.  
- Easy access to liked projects, bookmarks, and personal projects.  

---

### ☁️ Optimized Media Handling  
- AWS S3 used for storing project images and videos.  
- CloudFront used for fast and secure content delivery.  
- Images are automatically compressed for faster loading and storage efficiency.  

---

## 🛠️ Tech Stack  

### Frontend  
- **Framework**: Next.js  
- **Styling**: Tailwind CSS  
- **State Management**: React Context  
- **Forms**: React Hook Form  
- **Authentication**: Google OAuth + optional email/password login  
- **Real-time Communication**: Socket.io-client  

### Backend  
- **HTTP Server**: Express  
- **Database**: MongoDB  
- **Caching**: Redis (for fast data retrieval and WebSocket session management)  
- **Real-time Communication**: Socket.io  
- **File Storage**: AWS S3  
- **Security**: Rate limiting and request logging with Winston  

### Infrastructure  
- **Hosting**: AWS EC2  
- **Storage**: AWS S3  
- **CDN**: AWS CloudFront  
- **Infrastructure Management**: AWS CDK  

---

## 🚧 Missing/Planned Features  
- Job boards  
- Premium/paid features  
- Expanded user roles and permissions  

---

## 📌 Setup & Deployment  
1. Clone the repository.  
2. Install dependencies using `npm install`.  
3. Start the development servers:  
   - **Frontend**: `npm run dev` (in `frontend/`)  
   - **Backend**: `npm run dev` (in `backend/`)  
4. Deploy infrastructure using AWS CDK from the `cdk/` folder.  

---

## 🌟 Why RadiatorForge?  
RadiatorForge is built to empower creative professionals by offering a highly responsive and feature-rich platform. The combination of real-time communication, advanced search, and seamless project management makes it a powerful tool for connecting creators and employers.  
