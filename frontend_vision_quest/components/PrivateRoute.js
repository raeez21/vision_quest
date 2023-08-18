"use client"

import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { useEffect } from "react";

const PrivateRoute = ({ children }) => {
  const { authToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authToken) {
      router.push('/signin');
    }
  }, [authToken]);

  return children;
};

export default PrivateRoute;
