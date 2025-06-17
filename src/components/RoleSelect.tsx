"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { changeUserRole } from "~/server/queries";
import { toast } from "~/hooks/use-toast";
import { useRouter } from "next/navigation";

interface RoleSelectProps {
  userId: string;
  currentRole: string;
  isAdmin: boolean;
}

const RoleSelect = ({ userId, currentRole, isAdmin }: RoleSelectProps) => {
  const [role, setRole] = useState(currentRole || "user");
  const router = useRouter();

  if (!isAdmin) {
    return (
      <p className="text-sm font-medium capitalize">{currentRole || "user"}</p>
    );
  }

  const handleRoleChange = async (newRole: string) => {
    try {
      const response = await changeUserRole(userId, newRole);
      if (response.error) {
        throw new Error(response.error);
      }
      setRole(newRole);
      toast({
        description: "User role updated successfully",
        variant: "default",
        className: "bg-emerald-500 text-white font-bold",
      });
      router.refresh();
    } catch (error: any) {
      toast({
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  return (
    <Select value={role} onValueChange={handleRoleChange}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="user">User</SelectItem>
        <SelectItem value="staff">Staff</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default RoleSelect;
