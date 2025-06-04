"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { Users, columns } from "./columns";
import { authClient } from "~/lib/auth-client";

const TableComponent = () => {
  const [users, setUsers] = useState<Users[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      //   const response = await authClient.admin.listUsers({
      //     query: { limit: 10 },
      //   });

      const { data, error } = await authClient.admin.listUsers({
        query: { limit: 10 },
      });

      if (!data) {
        throw new Error("Failed to fetch users");
      }

      // Convert Date objects to strings for createdAt and updatedAt
      setUsers(
        data.users.map((user: any) => ({
          ...user,
          createdAt:
            typeof user.createdAt === "string"
              ? user.createdAt
              : user.createdAt.toISOString(),
          updatedAt:
            typeof user.updatedAt === "string"
              ? user.updatedAt
              : user.updatedAt.toISOString(),
        })),
      );
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <DataTable columns={columns} data={users} />
    </div>
  );
};

export default TableComponent;
