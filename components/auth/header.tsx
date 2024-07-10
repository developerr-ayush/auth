import { Poppins } from "next/font/google";
import logo from "@/images/logo/transparent-black.png"

import { cn } from "@/lib/utils";
import Image from "next/image";
const font = Poppins({ subsets: ["latin"], weight: ["600"] });
interface HeaderProps {
    label: string
}
export const Header = ({ label }: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
            <h1 className={cn("text-3xl font-semibold", font.className)}>
                <Image width={150} src={logo} alt="ayva hub logo" className="" />
            </h1>
            <p className=" text-sm"> {label}</p>
        </div>
    )
}