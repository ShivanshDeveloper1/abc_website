"use client";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    console.log("🚨 1. Button clicked! Starting auth process...");
    
    try {
      setError(null);
      console.log("🚨 2. Checking Firebase instances:", { 
        authExists: !!auth, 
        providerExists: !!googleProvider 
      });

      // Pause here and wait for Firebase
      const result = await signInWithPopup(auth, googleProvider);
      
      console.log("🚨 3. SUCCESS! Firebase returned user:", result.user);
      console.log("🚨 4. Redirecting to /test-series...");
      
      router.push("/test-series"); 
    } catch (err: any) {
      console.error("🚨 5. ERROR CAUGHT IN CATCH BLOCK:");
      console.dir(err); // Prints the complete, expandable error object
      console.log("🚨 Error Code:", err.code);
      console.log("🚨 Error Message:", err.message);
      
      setError(err.message || "An error occurred during authentication.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-xl shadow-lg text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Welcome Back</h1>
        
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg font-medium border border-red-200">
            {error}
          </div>
        )}

        <button 
          onClick={handleGoogleSignIn}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 transition-all"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}