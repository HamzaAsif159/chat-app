import React from "react";
import * as Avatar from "@radix-ui/react-avatar";

export function UserAvatar({ firstName, lastName, image, size = "md" }) {
  const initials =
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  const sizes = {
    sm: "h-8 w-8 text-sm",
    md: "h-12 w-12 text-base",
    lg: "h-20 w-20 text-xl",
  };

  return (
    <Avatar.Root
      className={`inline-flex items-center justify-center rounded-full bg-indigo-600 text-white font-semibold ${sizes[size]}`}
    >
      <Avatar.Image
        src={image}
        alt={`${firstName} ${lastName}`}
        className="h-full w-full object-cover rounded-full"
      />
      <Avatar.Fallback
        delayMs={200}
        className="flex h-full w-full items-center justify-center"
      >
        {initials}
      </Avatar.Fallback>
    </Avatar.Root>
  );
}
