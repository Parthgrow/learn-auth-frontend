"use client";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [userDetails, setUserDetails] = useState<any>({});
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("refreshToken");
    router.push("/");
  };

  useEffect(() => {
    const getUserDetails = async () => {
      const token = Cookies.get("authToken");

      if (token && token !== undefined) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user-details`, {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        const repData = await response.json();
        if (response.ok) {
          setUserDetails(repData.data);
        }
      }
    };

    const refreshToken = async (refreshCookies: any) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/refresh-token`, {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${refreshCookies}` },
        });
        const repData = await response.json();
        const token = repData.token;
        Cookies.set("authToken", token, { expires: 0.00139 });
        getUserDetails();
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    };

    const checkAuthentication = async () => {
      const cookies = Cookies.get("authToken");
      const refreshCookies = Cookies.get("refreshToken");

      if (!cookies) {
        if (refreshCookies) {
          await refreshToken(refreshCookies);
          setLoading(false);
        } else {
          router.push("/");
        }
      } else {
        setLoading(false);
        getUserDetails();
      }
    };

    checkAuthentication();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 p-4">
      {/* Navbar */}
      <header className="flex justify-between items-center bg-white shadow-md px-6 py-3 rounded-lg">
        <h1 className="text-2xl font-semibold text-blue-600">Silver Skills Portal</h1>
        <Button onClick={handleLogout} className="bg-blue-600 hover:bg-blue-700 text-white">
          Logout
        </Button>
      </header>

      {/* Profile Card */}
      <div className="flex gap-2 justify-center mt-6">
        <Card className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
          <CardHeader>
            <CardTitle className="text-blue-600 text-xl text-center">Employee Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-blue-500 text-white flex items-center justify-center rounded-full text-3xl font-bold">
              {userDetails.username ? userDetails.username.charAt(0).toUpperCase() : "U"}
            </div>
            <h2 className="text-xl font-bold">{userDetails.username}</h2>
            <p className="text-gray-600">{userDetails.details?.company || "Silver Skills"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Details Section */}
      <div className="flex justify-center mt-6">
        <Card className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
          <CardHeader>
            <CardTitle className="text-blue-600 text-xl text-center">About Me</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-700">Hobby:</span>
                <span className="text-gray-600">{userDetails?.hobby || "Not Provided"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-700">Profession:</span>
                <span className="text-gray-600">{userDetails?.profession || "Not Provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Company:</span>
                <span className="text-gray-600">{userDetails.details?.company || "Silver Skills"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
