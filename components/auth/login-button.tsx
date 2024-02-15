"use client"
interface LoginButtonProps {
    children: React.ReactNode;
    mode?: "modal" | "redirect";
    asChild?: boolean;
}
import { useRouter } from "next/navigation";
export const LoginButton = ({ children, mode = "redirect", asChild }: LoginButtonProps) => {
    const router = useRouter()
    const onClick = () => {
        console.log("LoginButton clicked");
        router.push("/auth/login")
    }
    if (mode === "modal") {
        return (
            <span>TODO: Implement Modal</span>
        )
    }
    return (
        <span onClick={onClick} className="cursor-pointer">{children}</span>
    )
}