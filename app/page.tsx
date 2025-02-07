"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Page() {
  const [formValues, setFormValues] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formValues }),
    });

    const repData = await response.json();

    if (response.ok) {
      Cookies.set("authToken", repData.token, { expires: 0.00139 });
      Cookies.set("refreshToken", repData.refreshToken, { expires: 0.003125 });
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    const checkAuthentication = () => {
      const cookie = Cookies.get("authToken");
      if (!cookie) {
        setLoading(false);
      } else {
        router.push("/dashboard");
      }
    };
    checkAuthentication();
  }, [router]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-2 min-h-screen items-center justify-center bg-gradient-to-b from-blue-500 to-blue-700 p-4">
        <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg">
          Silver Skills Portal
        </h1>
      </div>
      <Card className="w-full max-w-sm bg-white shadow-lg rounded-2xl p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-blue-600 text-center">
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              value={formValues.username}
              onChange={(e) => setFormValues({ ...formValues, username: e.target.value })}
              placeholder="Enter your username"
              className="border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <Input
              type="password"
              value={formValues.password}
              onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
              placeholder="Enter your password"
              className="border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
