import React from "react";
import { getUser } from "~/server/queries";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { User2, Mail, Calendar, Shield } from "lucide-react";
import RoleSelect from "~/components/RoleSelect";
import { getProfile } from "~/server/profile_queries";
import DeleteUserButton from "~/components/DeleteUserButton";

interface Props {
  params: {
    id: string;
  };
}

// export type Users = {
//   id: string;
//   name: string;
//   email: string;
//   emailVerified: boolean;

//   createdAt: Date;
//   updatedAt: Date;
//   role: string;
//   banned: string;
//   banReason: string | null;
//   banExpires: number;
// };
const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const profile = await getUser(id);
  const currentUser = await getProfile();

  // Check if current user is admin
  const isAdmin =
    currentUser && !("error" in currentUser) && currentUser.role === "admin";

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Profile Information
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            View and manage user account details
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-primary/10 p-3">
              <User2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-sm text-muted-foreground">Full Name</p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{profile.email}</p>
                <p className="text-sm text-muted-foreground">Email Address</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <RoleSelect
                  userId={profile.id}
                  currentRole={profile.role || "user"}
                  isAdmin={!!isAdmin}
                />
                <p className="text-sm text-muted-foreground">Account Role</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {profile.createdAt.toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">Member Since</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {profile.updatedAt.toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">Last Updated</p>
              </div>
            </div>
          </div>

          {isAdmin && currentUser?.id !== profile.id && (
            <div className="mt-6 border-t pt-6">
              <h3 className="mb-4 text-lg font-semibold text-destructive">
                Danger Zone
              </h3>
              <div className="max-w-sm">
                <DeleteUserButton userId={profile.id} userName={profile.name} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
