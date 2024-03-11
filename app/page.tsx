import { Poppins } from "next/font/google";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
import logo from "@/images/logo/landscape-white.png"

import { createBlog } from "@/actions/blog";
const font = Poppins({ subsets: ["latin"], weight: ["600"] });

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-[#1b1b1b]">
      <div className="space-y-6 text-center">
        <h1 className={cn("text-6xl font-semibold text-white drop-shadow-md", font.className)}>
          <Image width={300} src={logo} alt="ayva hub" />
        </h1>
        <p className="text-white tex-lg">A simple Authentication service</p>
        <div>
          <LoginButton>
            <Button variant="secondary" size="lg">Go To Dashboard</Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
