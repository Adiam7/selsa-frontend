// app/profile/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import user from "@/types/user"; 

// Mocked user data – Replace with real user context or fetch logic
const user: user = {
  username: "john_doe",
  email: "john@example.com",
};


export default function ProfilePage() {
  return (
    <div
      role="region"
      className="ins-tile ins-tile--cover ins-tile--fullscreen-bottom-right ins-tile--adaptive"
      id="tile-cover-gBoQjH"
    >
      <div className="ins-tile__wrap ins-tile__animated">
        <div className="profile-container flex items-center gap-5 p-5">
          {/* Profile Image */}
          <div className="profile-image">
            <div className="ins-tile__picture bg-transparent">
              <picture className="ins-picture ins-picture--circle">
                {/* You can replace this with a dynamic image source if needed */}
                {/* <Image
                  src="/images/selsa.png"
                  alt="Selsa Lego image"
                  width={50}
                  height={50}
                  className="rounded-full object-cover border border-gray-300"
                /> */}
              </picture>
            </div>
          </div>

          {/* Profile Info */}
          <div className="ins-tile__body profile-info flex-grow">
            <div className="ins-tile__body-content">
              <h1 className="ins-tile__title text-4xl font-bold mb-2">Account</h1>
              <div role="heading" aria-level={2} className="ins-tile__format text-lg">
                <p className="mb-4">Welcome to your account page. Here you can view and update your account information.</p>
                <h3 className="text-2xl font-semibold mb-2">Welcome, {user.username}!</h3>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>

                <div className="mt-4 space-y-2">
                  <Link href="/accounts/password_change" className="text-blue-600 hover:underline block">
                    Change Password
                  </Link>
                  <Link href="/accounts/logout" className="text-blue-600 hover:underline block">
                    Logout
                  </Link>
                  <Link href="/" className="text-blue-600 hover:underline block">
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
