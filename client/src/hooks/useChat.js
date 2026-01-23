import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  CHAT_CREATE_ROUTE,
  CHAT_LIST_ROUTE,
  CHAT_SEND_ROUTE,
} from "@/utils.js/constant";

export const useGetChats = () => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await api.get(CHAT_LIST_ROUTE);
      return res.data;
    },
  });
};

export const useCreateChat = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await api.post(CHAT_CREATE_ROUTE);
      return res.data.chat;
    },
  });
};

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async ({ chatId, message }) => {
      const res = await api.post(CHAT_SEND_ROUTE, { chatId, message });
      return res.data;
    },
  });
};
