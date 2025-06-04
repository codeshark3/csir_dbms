"use client";

import { useRouter } from "next/navigation";
import { authClient } from "~/lib/auth-client";
import { Button } from "./ui/button";
import { toast } from "~/hooks/use-toast";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onRequest: () => {
            toast({
              description: "Signing out...",
              variant: "default",
              className: "bg-blue-500 text-white font-bold",
            });
          },
          onSuccess: () => {
            toast({
              description: "Signed out successfully",
              variant: "default",
              className: "bg-emerald-500 text-white font-bold",
            });
            router.push("/sign-in");
            router.refresh(); // Force a refresh of the page to clear any cached session data
          },
          onError: (error) => {
            console.error("Sign out error:", error);
            toast({
              description: "Failed to sign out. Please try again.",
              variant: "destructive",
              className: "bg-red-500 text-white font-bold",
            });
          },
        },
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
        className: "bg-red-500 text-white font-bold",
      });
    }
  };

  return (
    <DropdownMenuItem
      onClick={handleSignOut}
      className="cursor-pointer text-destructive focus:bg-destructive/10"
    >
      Sign Out
    </DropdownMenuItem>
  );
};

export default SignOutButton;
