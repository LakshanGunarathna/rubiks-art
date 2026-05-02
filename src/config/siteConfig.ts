import { create } from 'zustand';

interface AppState {
  websiteName: string;
  themeColor: string;
  isDarkMode: boolean;
  setWebsiteName: (name: string) => void;
  setThemeColor: (color: string) => void;
  toggleDarkMode: () => void;
}

export const useSiteConfig = create<AppState>((set) => ({
  websiteName: "Rubik's Art",
  themeColor: 'bg-transparent', // Allow custom body background to show through
  isDarkMode: false,
  setWebsiteName: (name) => set({ websiteName: name }),
  setThemeColor: (color) => set({ themeColor: color }),
  toggleDarkMode: () => set((state) => {
    const nextMode = !state.isDarkMode;
    if (nextMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { isDarkMode: nextMode };
  }),
}));
