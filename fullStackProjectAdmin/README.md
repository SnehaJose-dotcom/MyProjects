My E-commerce Admin Dashboard

This is the Admin Dashboard for the My E-commerce platform. It was developed by Xinfu Guo using Next.js 14, TypeScript, Tailwind CSS, and MongoDB.

Features:

Admin login authentication

Product management: view, edit, and add products

Image upload to Cloudinary

Folder Structure (Admin Side):
/app
/admin
/products
page.tsx         - View all products
[id]/page.tsx    - Edit product
/add/page.tsx      - Add new product
/api
/admin
/addnew/route.ts - API to insert product into MongoDB
/upload/route.ts   - API to upload image to Cloudinary
/context
AdminAuthContext.tsx - Admin auth provider
/components
AdminSidebar.tsx     - Admin side navigation

Technologies Used:

Next.js 14 (App Router)

TypeScript

MongoDB + Mongoose

Cloudinary

Tailwind CSS

Admin Credentials (from .env):
NEXT_PUBLIC_ADMIN_USERNAME=root
NEXT_PUBLIC_ADMIN_PASSWORD=root

Port:
This app runs on http://localhost:4000

Local Setup:

Clone the repo

Create a .env file with your MongoDB and Cloudinary credentials

Run:

npm install
npm run dev

Visit: http://localhost:4000/login

