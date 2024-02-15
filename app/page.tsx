import { Poppins } from "next/font/google";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
const font = Poppins({ subsets: ["latin"], weight: ["600"] });
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-sky-800">
      <div className="space-y-6 text-center">
        <h1 className={cn("text-6xl font-semibold text-white drop-shadow-md", font.className)}>
          🔐 Auth
        </h1>
        <p className="text-white tex-lg">A simple Authentication service</p>
        <div>
          <LoginButton>
            <Button variant="secondary" size="lg">Sign in</Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}