# CreativeConnect 🎨

[![Next.js](https://img.shields.io/badge/Next.js-15.0.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-4.21.1-lightgrey?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.8.0-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![AWS](https://img.shields.io/badge/AWS-S3%20|%20EC2%20|%20CDK-orange?style=flat-square&logo=amazon-aws)](https://aws.amazon.com/)

A modern portfolio platform for creative professionals built with the latest web tech stack. Share your work, connect with peers, and get discovered by employers!

![CreativeConnect Preview](https://via.placeholder.com/800x400)

## 🚀 Features

### 👤 For Creators
- **Project Showcase** - Upload high-quality images and videos to showcase your creative work
- **Profile Customization** - Build your personal brand with a fully customizable profile
- **Analytics** - Track who's viewing and engaging with your work
- **Discovery** - Get your projects seen by the right people

### 👀 For Viewers
- **Explore Feed** - Discover amazing creative work from talented individuals
- **Bookmarks** - Save projects you love for later inspiration
- **Like & Comment** - Engage with content that resonates with you
- **Real-time Chat** - Connect directly with creators you're interested in

## 💻 Tech Stack

### Frontend
```
Next.js 15 (App Router) + React 18 + TypeScript
```
- **UI Components**: Radix UI primitives with custom styled components
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context + Hooks
- **Data Fetching**: Next.js Server Components + Client-side fetching
- **Media Handling**: Optimized image/video handling with compression

### Backend
```
Express.js + MongoDB + Socket.io + Redis
```
- **API**: RESTful endpoints with TypeScript interfaces
- **Authentication**: JWT with HTTP-only cookies + Google OAuth
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io for chat and notifications
- **Caching**: Redis for high-performance data access

### DevOps
```
AWS (S3, CloudFront, EC2) + CDK
```
- **Media Storage**: S3 buckets with CloudFront CDN
- **Deployment**: EC2 instances via CloudFormation
- **IaC**: AWS CDK for infrastructure management
- **CI/CD**: Automated build and deployment pipeline

## 🔥 Key Implementations

- **SSR + ISR** - Server-side rendering with incremental static regeneration
- **Real-time Chat** - Direct messaging between creators and potential employers
- **Media CDN** - Globally distributed content delivery with AWS CloudFront
- **Multi-layer Caching** - Performance optimization with Next.js and Redis
- **Responsive Design** - Mobile-first approach that works on all devices

## 📸 Screenshots

| Home Feed | Project Detail | Profile Page |
|:---:|:---:|:---:|
| ![Home](https://via.placeholder.com/250x150) | ![Project](https://via.placeholder.com/250x150) | ![Profile](https://via.placeholder.com/250x150) |

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Redis
- AWS Account (for S3 and deployment)

### Local Development

```bash
# Clone the repos
git clone https://github.com/yourusername/creativeconnect-frontend.git
git clone https://github.com/yourusername/creativeconnect-backend.git

# Frontend setup
cd creativeconnect-frontend
npm install
cp .env.example .env.local
npm run dev

# Backend setup
cd ../creativeconnect-backend
npm install
cp .env.example .env
npm run dev
```

Visit `http://localhost:5173` to see the app in action!

## 🌟 What Makes This Project Stand Out

- **Performance Focused** - Optimized loading with Next.js App Router and multi-layer caching
- **Cloud Native** - Leverages AWS services for scalable, reliable infrastructure
- **Type Safety** - End-to-end TypeScript implementation for robust code
- **Real-time Features** - Socket.io integration for instant messaging and notifications
- **Secure Authentication** - HTTP-only cookie auth pattern with JWT

## 📝 What I Learned

- Implementing complex state management across server and client components
- Building and deploying scalable infrastructure with AWS CDK
- Optimizing media delivery with S3 and CloudFront
- Creating responsive, accessible UI components with Radix UI primitives
- Managing real-time connections with Socket.io

## 🚧 Roadmap

- [ ] Improved search functionality with filters
- [ ] Enhanced mobile experience
- [ ] Public API for integrations
- [ ] Collaborative project editing
- [ ] Performance optimizations for large media projects

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

#### Built with ❤️ by [Your Name]
