import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { useAppStore } from "@/store";
import { profileSchema } from "./profile.schema";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useProfile } from "@/hooks/useProfile";

export default function ProfilePage() {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const updateProfileMutation = useProfile();

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: userInfo?.firstName ?? "",
      lastName: userInfo?.lastName ?? "",
      email: userInfo?.email ?? "",
    },
  });

  const onSubmit = (data) => {
    updateProfileMutation.mutate(data, {
      onSuccess: (res) => {
        setUserInfo(res.user);
        toast.success("Profile updated successfully");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Update failed");
      },
    });
  };

  if (!userInfo) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <Card className="w-full max-w-2xl rounded-2xl shadow-2xl border-none">
        <CardHeader className="flex flex-col items-center gap-4 pb-2">
          <UserAvatar
            firstName={userInfo.firstName}
            lastName={userInfo.lastName}
            image={userInfo.image}
          />
          <CardTitle className="text-2xl font-bold text-gray-800">
            Your Profile
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {updateProfileMutation.isPending
                    ? "Saving..."
                    : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate("/chat")}
                  className="cursor-pointer"
                >
                  Go Back
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
