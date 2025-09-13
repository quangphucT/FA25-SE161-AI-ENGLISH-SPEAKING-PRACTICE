This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Structure Of Project
project-root/
│── app/                              # App Router   
│   ├── (public)/                     # Public pages (không cần login)
│   │   ├── landing/page.tsx          # Landing page
│   │   └── pricing/page.tsx          # Gói dịch vụ
│   ├── (auth)/                       # Login/Signup/Forgot password
│   ├── (learner)/                    # Learner area
│   │   ├── dashboard/page.tsx        (trang home dashboard chính khi đăng nhập thành công, ở trang này sẽ hiển thị tổng quan)
│   │   ├── practice/page.tsx         # Luyện nói  (màng hình cốt lỗi)
│   │   ├── progress/page.tsx         # Thống kê học tập
│   │   ├── packages/page.tsx         # Gói dịch vụ & nâng cấp
│   │   └── reports/page.tsx
│   ├── (mentor)/                     # Mentor area
│   │   ├── dashboard/page.tsx
│   │   ├── assessments/page.tsx
│   │   ├── materials/page.tsx        # Tài liệu cho học viên
│   │   └── feedback/page.tsx
│   ├── (admin)/                      # Admin area
│   │   ├── accounts/page.tsx
│   │   ├── mentors/page.tsx
│   │   ├── packages/page.tsx
│   │   ├── purchases/page.tsx
│   │   ├── policies/page.tsx
│   │   └── reports/page.tsx
│   ├── api/                          # API routes
│   │   ├── auth/
│   │   ├── admin/
│   │   ├── learner/
│   │   └── mentor/
│   ├── layout.tsx
│   └── page.tsx
│
│── features/                         # Module logic chia theo domain
│   ├── admin/                        # Feature logic cho Admin
│   │   ├── services/                 # Gọi API admin (accounts, packages…)
│   │   └── hooks/
│   ├── learner/                      # Feature logic cho Learner
│   │   ├── services/
│   │   └── hooks/
│   ├── mentor/                       # Feature logic cho Mentor
│   │   ├── services/
│   │   └── hooks/
│   └── shared/                       # Logic dùng chung (payment, feedback, AI)
│
│── components/                       # UI tái sử dụng
│   ├── ui/                           # Button, Modal, Input…
│   ├── charts/                       # Progress charts
│   └── layout/                       # Navbar, Sidebar
│
│── lib/                              # Core logic backend mini
│   ├── db.ts                         # Prisma config
│   ├── auth.ts                       # JWT & middleware
│   ├── ai/                           # AI adapters (OpenAI, Whisper…)
│   ├── payment/                      # Thanh toán (VNPay, PayOS…)
│   ├── validators/                   # Zod schema
│   └── utils.ts
│
│── prisma/                           # Schema DB
│   └── schema.prisma
│
│── store/                            # Global state (Zustand/Redux)
│   ├── userStore.ts
│   └── packageStore.ts
│
│── hooks/                            # Custom hooks global
│── styles/                           # SCSS/Tailwind config
│── public/                           # Assets tĩnh
│── tests/                            # Unit/E2E test
