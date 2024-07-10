import { Poppins } from "next/font/google";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
import { auth, signOut } from '@/auth';
import logo from "@/images/logo/transparent-white.png"

import { createBlog } from "@/actions/blog";
const font = Poppins({ subsets: ["latin"], weight: ["600"] });

export default async function Home() {
  const session = await auth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-[#373A3A]">
      <div className="space-y-6 text-center">
        <h1 className={cn("text-6xl font-semibold  drop-shadow-md", font.className)}>
          <Image width={300} src={logo} alt="schoolvr" className="" />
        </h1>
        <p className="text-white tex-lg">A simple admin panel Service</p>
        <div>
          <LoginButton>
            <Button variant="secondary" size="lg">{!!session ? "Go To Dashboard" : "Login Now"}</Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
