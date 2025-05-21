import { create } from "zustand"
import { persist } from "zustand/middleware"

export type NotificationChannel = "app" | "email" | "sms" | "push"

export type NotificationPreference = {
  type: "transaction" | "security" | "price_alert" | "portfolio" | "news" | "social"
  channels: NotificationChannel[]
  enabled: boolean
}

export type SecuritySetting = {
  twoFactorEnabled: boolean
  loginNotifications: boolean
  approvedDevices: {
    id: string
    name: string
    lastUsed: number
    isCurrent: boolean
  }[]
  transactionConfirmation: "always" | "above_threshold" | "never"
  transactionThreshold: number
}

export type DisplayPreference = {
  theme: "light" | "dark" | "system"
  currency: "USD" | "EUR" | "GBP" | "JPY"
  language: "en" | "es" | "fr" | "de" | "zh"
  compactMode: boolean
  showPortfolioValue: boolean
  defaultDashboardView: "overview" | "portfolio" | "transactions"
}

type UserSettingsState = {
  profile: {
    username: string
    email: string
    avatar: string
    bio: string
    joinDate: number
  }
  notifications: NotificationPreference[]
  security: SecuritySetting
  display: DisplayPreference
  isLoading: boolean
  error: string | null
}

type UserSettingsActions = {
  updateProfile: (updates: Partial<UserSettingsState["profile"]>) => Promise<void>
  updateNotificationPreference: (type: string, updates: Partial<NotificationPreference>) => Promise<void>
  updateSecuritySettings: (updates: Partial<SecuritySetting>) => Promise<void>
  updateDisplayPreferences: (updates: Partial<DisplayPreference>) => Promise<void>
  removeApprovedDevice: (id: string) => Promise<void>
  resetSettings: () => Promise<void>
}

// Mock data for demonstration
const mockNotifications: NotificationPreference[] = [
  {
    type: "transaction",
    channels: ["app", "email"],
    enabled: true,
  },
  {
    type: "security",
    channels: ["app", "email", "sms"],
    enabled: true,
  },
  {
    type: "price_alert",
    channels: ["app", "push"],
    enabled: true,
  },
  {
    type: "portfolio",
    channels: ["app"],
    enabled: true,
  },
  {
    type: "news",
    channels: ["app"],
    enabled: false,
  },
  {
    type: "social",
    channels: ["app", "email"],
    enabled: true,
  },
]

const mockSecurity: SecuritySetting = {
  twoFactorEnabled: true,
  loginNotifications: true,
  approvedDevices: [
    {
      id: "1",
      name: "Chrome on MacBook Pro",
      lastUsed: Date.now(),
      isCurrent: true,
    },
    {
      id: "2",
      name: "Safari on iPhone",
      lastUsed: Date.now() - 86400000, // 1 day ago
      isCurrent: false,
    },
    {
      id: "3",
      name: "Firefox on Windows PC",
      lastUsed: Date.now() - 604800000, // 1 week ago
      isCurrent: false,
    },
  ],
  transactionConfirmation: "above_threshold",
  transactionThreshold: 100,
}

export const useUserSettingsStore = create<UserSettingsState & UserSettingsActions>()(
  persist(
    (set, get) => ({
      profile: {
        username: "cryptobee_user",
        email: "user@example.com",
        avatar: "/woman-profile-avatar.png",
        bio: "Crypto enthusiast and long-term investor.",
        joinDate: Date.now() - 7776000000, // 90 days ago
      },
      notifications: mockNotifications,
      security: mockSecurity,
      display: {
        theme: "system",
        currency: "USD",
        language: "en",
        compactMode: false,
        showPortfolioValue: true,
        defaultDashboardView: "overview",
      },
      isLoading: false,
      error: null,

      updateProfile: async (updates) => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))

          set((state) => ({
            profile: {
              ...state.profile,
              ...updates,
            },
            isLoading: false,
          }))
        } catch (error) {
          set({ error: "Failed to update profile", isLoading: false })
        }
      },

      updateNotificationPreference: async (type, updates) => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))

          set((state) => ({
            notifications: state.notifications.map((pref) => (pref.type === type ? { ...pref, ...updates } : pref)),
            isLoading: false,
          }))
        } catch (error) {
          set({ error: "Failed to update notification preferences", isLoading: false })
        }
      },

      updateSecuritySettings: async (updates) => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))

          set((state) => ({
            security: {
              ...state.security,
              ...updates,
            },
            isLoading: false,
          }))
        } catch (error) {
          set({ error: "Failed to update security settings", isLoading: false })
        }
      },

      updateDisplayPreferences: async (updates) => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))

          set((state) => ({
            display: {
              ...state.display,
              ...updates,
            },
            isLoading: false,
          }))
        } catch (error) {
          set({ error: "Failed to update display preferences", isLoading: false })
        }
      },

      removeApprovedDevice: async (id) => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))

          set((state) => ({
            security: {
              ...state.security,
              approvedDevices: state.security.approvedDevices.filter((device) => device.id !== id),
            },
            isLoading: false,
          }))
        } catch (error) {
          set({ error: "Failed to remove device", isLoading: false })
        }
      },

      resetSettings: async () => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1500))

          set((state) => ({
            display: {
              theme: "system",
              currency: "USD",
              language: "en",
              compactMode: false,
              showPortfolioValue: true,
              defaultDashboardView: "overview",
            },
            isLoading: false,
          }))
        } catch (error) {
          set({ error: "Failed to reset settings", isLoading: false })
        }
      },
    }),
    {
      name: "user-settings-storage",
    },
  ),
)
