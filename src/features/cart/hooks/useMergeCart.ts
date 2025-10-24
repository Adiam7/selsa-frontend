// src/features/cart/hooks/useMergeCart.ts
'use client'
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export const useMergeCart = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    const mergeCart = async () => {
      if (status !== "authenticated") return;

      const guestCartId = localStorage.getItem("guest_cart_id");
      if (!guestCartId) return;

      try {
        await axios.post("/api/cart/merge/", {
          guest_cart_id: guestCartId,
        }, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`, // or handled via cookie/session if applicable
          },
        });

        // Clear guest_cart_id from localStorage
        localStorage.removeItem("guest_cart_id");

        console.log("✅ Guest cart successfully merged.");
      } catch (err) {
        console.error("❌ Failed to merge cart:", err);
      }
    };

    mergeCart();
  }, [session, status]);
};
