import NextLink from "next/link";
import { Button } from "@/share/ui/button";

export default function NotFound404() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-gray-500">
        The page you are looking for does not exist.
      </p>
      <Button variant="default" size="sm" asChild>
        <NextLink href="/">Go to Home</NextLink>
      </Button>
    </div>
  );
}
