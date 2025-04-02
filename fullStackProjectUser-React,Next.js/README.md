# E-Commerce Platform

### **Team Members**
- **Xinfu Guo**: User authentication, global auth protection
- **Sneha Jose**: Home page, Cart page
- **Vy Ly**: Product page, Product Detail page
- **Kavya Gali**: Profile page, Chatbot
- **Asif Mehtaf**: Payment page

This project is built with [Next.js](https://nextjs.org).

---

## **🔒 Authentication & Authorization**
### **Backend API Protection**
```typescript
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const verifyAuth = (req: NextRequest) => {
    const token = req.cookies.get("token")?.value;
    return token ? jwt.verify(token, process.env.JWT_SECRET!) : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
};
```
- **Used in protected API routes**
- **Returns `401` if the token is missing or invalid**

### **Frontend Route Protection**
#### **🔐 Protect Private Pages**
```tsx
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth(), router = useRouter();
    useEffect(() => { if (!user) router.push("/signin"); }, [user]);
    return user ? <>{children}</> : null;
};
```
- **Wraps private pages to require login**
- **Redirects unauthenticated users to `/signin`**

#### **🚪 Restrict Logged-in Users**
```tsx
const GuestGuard = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth(), router = useRouter();
    useEffect(() => { if (user) router.push("/"); }, [user]);
    return user ? null : <>{children}</>;
};
```
- **Prevents logged-in users from accessing `/signin` & `/signup`**

### **Global Auth State**
```tsx
const login = async (email, password, rememberMe) => {
    const res = await fetch("/api/auth/signin", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }), credentials: "include",
    });
    if (res.ok) setUser(await res.json());
};
```
- **Manages authentication state globally**
- **Handles login/logout & fetches `/api/user/profile`**

---

## **📌 Getting Started**
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

https://my-ecommerce-platform-p522v5qjo-xinfu-guos-projects.vercel.app/