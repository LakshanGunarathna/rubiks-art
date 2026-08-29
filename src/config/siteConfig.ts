import { create } from 'zustand';

interface AppState {
  websiteName: string;
  themeColor: string;
  isDarkMode: boolean;
  apiBaseUrl: string;
  buyMeACoffeeUrl: string;
  setWebsiteName: (name: string) => void;
  setThemeColor: (color: string) => void;
  setBuyMeACoffeeUrl: (url: string) => void;
  toggleDarkMode: () => void;
}

export const useSiteConfig = create<AppState>((set) => ({
  websiteName: "Rubik's Art",
  themeColor: 'bg-transparent', // Allow custom body background to show through
  isDarkMode: false,
  apiBaseUrl: 'https://rubik-cube-solver-api-678903368413.europe-west1.run.app',
  buyMeACoffeeUrl: 'https://buymeacoffee.com/rubiksart',
  setWebsiteName: (name) => set({ websiteName: name }),
  setThemeColor: (color) => set({ themeColor: color }),
  setBuyMeACoffeeUrl: (url) => set({ buyMeACoffeeUrl: url }),
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
