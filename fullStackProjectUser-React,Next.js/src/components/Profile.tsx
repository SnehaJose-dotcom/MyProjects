"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || "/img/profile.jpg");
  const router = useRouter();

  if (!user) return null;

  const handleEditClick = () => {
    if (isEditing) {
      console.log("Updated Profile:", { email, profilePicture });
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4e7d3] p-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center">
          <Image
            src={profilePicture}
            alt="Profile Picture"
            width={120}
            height={120}
            className="rounded-full"
          />
          {isEditing ? (
            <>
              <input
                type="text"
                value={profilePicture}
                onChange={(e) => setProfilePicture(e.target.value)}
                className="mt-2 p-2 border rounded w-full text-center"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 p-2 border rounded w-full text-center"
              />
            </>
          ) : (
            <p className="text-gray-600 mt-2">{email}</p>
          )}
        </div>

        <div className="mt-6 space-y-4">
          <button
            onClick={handleEditClick}
            className="w-full bg-black text-white py-2 rounded-full hover:opacity-90"
          >
            {isEditing ? "Save" : "Edit Profile"}
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full bg-black text-white py-2 rounded-full hover:opacity-90"
          >
            Home
          </button>

          <button
            onClick={logout}
            className="w-full bg-black text-white py-2 rounded-full hover:opacity-90"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
