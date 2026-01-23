import React, { useState, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import { useAppStore } from "@/store";
import { useGetChats, useCreateChat, useSendMessage } from "@/hooks/useChat";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/common/UserAvatar";

export default function Chat() {
  const {
    chats,
    selectedChatId,
    selectChat,
    addMessageToSelectedChat,
    setChats,
  } = useAppStore();

  const { data: backendChats, refetch: refetchChats } = useGetChats();
  const createChatMutation = useCreateChat();
  const sendMessageMutation = useSendMessage();

  const selectedChat = chats.find((c) => c.id === selectedChatId);
  const [prompt, setPrompt] = useState("");
  const messagesEndRef = useRef(null);

  const showEmptyState = !selectedChat || selectedChat.messages.length === 0;

  useEffect(() => {
    if (backendChats?.length) {
      setChats(
        backendChats.map((chat) => ({
          id: chat._id,
          title: chat.title,
          messages: chat.messages.map((msg) => ({
            id: nanoid(),
            sender: msg.sender,
            text: msg.text,
          })),
        })),
      );
    }
  }, [backendChats, setChats]);

  const handleCreateChat = async () => {
    try {
      const backendChat = await createChatMutation.mutateAsync();
      selectChat(backendChat._id);
      refetchChats();
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  const handleSend = async () => {
    if (!prompt.trim() || !selectedChatId || sendMessageMutation.isPending)
      return;

    const userMessage = { id: nanoid(), sender: "user", text: prompt };
    addMessageToSelectedChat(userMessage);
    setPrompt("");

    sendMessageMutation.mutate({ chatId: selectedChatId, message: prompt });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages]);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <div className="w-64 bg-white border-r border-gray-300 flex flex-col">
        <div className="p-4 border-b border-gray-300 flex justify-between items-center">
          <h2 className="font-bold text-lg">ByteBot</h2>
          <Button
            size="sm"
            onClick={handleCreateChat}
            disabled={createChatMutation.isPending}
          >
            {createChatMutation.isPending ? "..." : "New"}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-3 cursor-pointer hover:bg-gray-100 flex items-center gap-2 transition-colors ${
                chat.id === selectedChatId
                  ? "bg-indigo-50 border-r-2 border-indigo-500 font-semibold"
                  : ""
              }`}
              onClick={() => selectChat(chat.id)}
            >
              <UserAvatar
                firstName={chat.title[0]?.toUpperCase()}
                lastName=""
                size="sm"
              />
              <span className="truncate font-medium flex-1">{chat.title}</span>
              {chat.messages.length > 0 && (
                <span className="text-xs text-gray-400">
                  {chat.messages.length}
                </span>
              )}
            </div>
          ))}
          {chats.length === 0 && (
            <div className="p-3 text-gray-400 text-sm text-center">
              Click "New" to chat with ByteBot
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
          {showEmptyState ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-indigo-600 font-bold text-xl">B</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                ByteBot
              </h3>
              <p className="text-sm text-center max-w-md">
                {selectedChat
                  ? "Send your first message to start chatting"
                  : 'Click "New" to start chatting with your AI coding assistant'}
              </p>
            </div>
          ) : (
            <>
              {selectedChat.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[70%] p-4 rounded-2xl shadow-sm break-words prose prose-sm max-w-none ${
                    msg.sender === "user"
                      ? "bg-indigo-500 text-white self-end ml-auto"
                      : "bg-white border self-start"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              ))}

              {sendMessageMutation.isPending &&
                selectedChat.messages.length === 0 && (
                  <div className="self-start bg-white border p-3 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>ByteBot is typing...</span>
                    </div>
                  </div>
                )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {selectedChat && (
          <div className="p-4 border-t border-gray-300 flex gap-2 bg-gray-50">
            <Input
              placeholder="Ask ByteBot anything..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !e.shiftKey &&
                !sendMessageMutation.isPending &&
                handleSend()
              }
              className="flex-1 min-h-[44px]"
              disabled={sendMessageMutation.isPending}
            />
            <Button
              onClick={handleSend}
              disabled={
                !prompt.trim() ||
                !selectedChatId ||
                sendMessageMutation.isPending
              }
              className="min-h-[44px]"
            >
              {sendMessageMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Send"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
