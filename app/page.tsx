import { Poppins } from "next/font/google";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
import { createBlog } from "@/actions/blog";
const font = Poppins({ subsets: ["latin"], weight: ["600"] });
const blogs = [
  {
    title: "Lorem ipsum dolor",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    author: "John Doe",
    status: "draft"
  },
  {
    title: "Vestibulum ante ipsum",
    description: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.",
    author: "Jane Smith",
    status: "published"
  },
  {
    title: "Nulla facilisi",
    description: "Nulla facilisi. Nullam tristique urna sit amet odio consectetur, non maximus ex fermentum.",
    author: "David Johnson",
    status: "archived"
  },
  {
    title: "Fusce consectetur",
    description: "Fusce consectetur, nunc ut varius consequat, erat neque tincidunt purus.",
    author: "Emily Brown",
    status: "draft"
  },
  {
    title: "Aliquam erat volutpat",
    description: "Aliquam erat volutpat. Sed in mi at enim malesuada dictum.",
    author: "Michael Wilson",
    status: "published"
  },
  {
    title: "Cras commodo interdum",
    description: "Cras commodo interdum ligula, ut tincidunt sem malesuada sit amet.",
    author: "Sarah Lee",
    status: "draft"
  },
  {
    title: "Pellentesque eget commodo",
    description: "Pellentesque eget commodo libero. In hac habitasse platea dictumst.",
    author: "Andrew Taylor",
    status: "published"
  },
  {
    title: "Curabitur vel justo",
    description: "Curabitur vel justo ut quam auctor tempus. Fusce consectetur, nisi vitae lacinia tincidunt.",
    author: "Jessica Garcia",
    status: "archived"
  },
  {
    title: "Integer auctor odio",
    description: "Integer auctor odio nec mauris convallis, eget tincidunt urna gravida.",
    author: "Daniel Martinez",
    status: "draft"
  },
  {
    title: "Suspendisse potenti",
    description: "Suspendisse potenti. Duis convallis urna et mi convallis, a hendrerit turpis vehicula.",
    author: "Olivia Hernandez",
    status: "published"
  }
];
export default function Home() {
  // for (const blog of blogs) {
  //   const updatedBlog = { ...blog, date: new Date(Date.now()) };
  //   createBlog(updatedBlog);
  // }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-sky-800">
      <div className="space-y-6 text-center">
        <h1 className={cn("text-6xl font-semibold text-white drop-shadow-md", font.className)}>
          🔐 Admin pannel
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
