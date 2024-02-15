"use client"

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { BackButton } from "./back-button";
import { Header } from "./header";
import { Social } from "./social";

interface CardWrapperPrpos {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean
}
export const CardWrapper = ({ children, headerLabel, backButtonHref, backButtonLabel, showSocial }: CardWrapperPrpos) => {
    return (
        <Card className="w-[400px] shadpw-md">
            <CardHeader>
                <Header label={headerLabel}></Header>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {showSocial && (
                <CardFooter>
                    <Social />
                </CardFooter>)}
                <CardFooter>
                    <BackButton label={backButtonLabel} href={backButtonHref} />
                </CardFooter>
        </Card>
    )
}
