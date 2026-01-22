import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import { UserAvatar } from "./UserAvatar";
import { useLogout } from "@/hooks/useLogout";
import { LogOut, User, MessageCircle, Sparkles } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const { userInfo } = useAppStore();
  const logoutMutation = useLogout();

  const handleProfile = () => navigate("/profile");
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        useAppStore.getState().clearUser();
        navigate("/auth");
      },
    });
  };

  return (
    <nav className="w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),transparent)]" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 bg-black/20 backdrop-blur-3xl border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div
          className="group relative font-black text-2xl bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent drop-shadow-xl cursor-pointer hover:scale-105 transition-all duration-300 hover:drop-shadow-[0_0_20px_rgba(147,51,234,0.4)]"
          onClick={() => navigate("/chat")}
        >
          <span>ChatBotX</span>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100 animate-ping" />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-emerald-400/50 animate-ping" />

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="group relative outline-none">
                <div className="relative bg-gradient-to-br from-white/10 to-black/20 backdrop-blur-xl p-2 rounded-xl border border-white/20 shadow-xl hover:shadow-purple-500/20 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <UserAvatar
                    firstName={userInfo?.firstName || "U"}
                    lastName={userInfo?.lastName || "N"}
                    image={userInfo?.image}
                    size="sm"
                  />
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-ping" />
                  <div className="absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-ping delay-300" />
                </div>
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-3xl text-white rounded-2xl shadow-2xl p-1 min-w-[220px] border border-white/10 z-[9999] mr-4">
                <div className="px-4 py-2.5 border-b border-white/10">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-emerald-300 uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                  <div className="font-semibold text-xs truncate">
                    {userInfo?.email}
                  </div>
                </div>

                <DropdownMenu.Item
                  className="group/item px-3.5 py-2.5 cursor-pointer hover:bg-white/10 rounded-xl flex gap-2.5 items-center outline-none font-medium relative transition-all duration-200 hover:scale-[1.02]"
                  onSelect={handleProfile}
                >
                  <div className="p-1.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg group-hover/item:bg-indigo-500/30 transition-all duration-300 flex-shrink-0">
                    <User className="h-4 w-4 text-indigo-300 group-hover/item:text-indigo-100" />
                  </div>
                  <span className="flex-1">Profile</span>
                  <MessageCircle className="h-3.5 w-3.5 text-indigo-400 group-hover/item:text-indigo-200 opacity-70" />
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  className="group/item px-3.5 py-2.5 cursor-pointer hover:bg-gradient-to-r hover:from-rose-500/10 hover:to-pink-500/10 rounded-xl flex gap-2.5 items-center outline-none font-medium relative transition-all duration-200 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
                  onSelect={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <div className="p-1.5 bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-lg group-hover/item:bg-rose-500/30 transition-all duration-300 flex-shrink-0">
                    <LogOut className="h-4 w-4 text-rose-300 group-hover/item:text-rose-100" />
                  </div>
                  <span className="flex-1">
                    {logoutMutation.isPending ? "Logging out..." : "Sign Out"}
                  </span>
                  <Sparkles className="h-3.5 w-3.5 text-rose-400 group-hover/item:text-rose-200 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </nav>
  );
}
