import { nanoid } from "nanoid";

export const createChatSlice = (set, get) => ({
  chats: [],
  selectedChatId: null,

  setChats: (chats) => set({ chats }),

  createChat: (title = "New Chat") => {
    const id = nanoid();
    set((state) => ({
      chats: [...state.chats, { id, title, messages: [] }],
      selectedChatId: id,
    }));
  },

  selectChat: (id) => set({ selectedChatId: id }),

  addMessageToSelectedChat: (message) => {
    const { chats, selectedChatId } = get();
    set({
      chats: chats.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              messages: [...chat.messages, { id: nanoid(), ...message }],
            }
          : chat,
      ),
    });
  },

  clearChats: () => set({ chats: [], selectedChatId: null }),
});
