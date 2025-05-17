import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export type Contact = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  walletAddress?: string;
  email?: string;
  lastTransaction?: string | null;
};

export type Group = {
  id: string;
  name: string;
  description: string;
  members: {
    id: string;
    name: string;
    avatar: string;
  }[];
  balance: number;
  currency?: string;
};

export type Activity = {
  id: string;
  type: "payment" | "request" | "group" | "split" | "recurring";
  title?: string;
  description?: string;
  user?: {
    id: string;
    name: string;
    avatar: string;
  };
  recipient?: {
    id: string;
    name: string;
    avatar: string;
  };
  amount?: number;
  currency?: string;
  note?: string;
  timestamp: string;
  status?: "pending" | "completed" | "declined" | "active";
  groupName?: string;
  participants?: string[];
  isRecurring?: boolean;
  frequency?: string;
};

export type SocialPaymentsStore = {
  contacts: Contact[];
  groups: Group[];
  activities: Activity[];
  addContact: (contact: Omit<Contact, "id">) => void;
  removeContact: (id: string) => void;
  addGroup: (group: Omit<Group, "id">) => void;
  removeGroup: (id: string) => void;
  addActivity: (activity: Omit<Activity, "id">) => void;
  createActivity: (activity: Omit<Activity, "id">) => void;
  updateActivityStatus: (id: string, status: "pending" | "completed" | "declined" | "active") => void;
};

// Utility Functions
const generateId = (prefix: string): string => `${prefix}-${Date.now()}`;

const updateArray = <T extends { id: string }>(
  array: T[],
  newItem: T,
  replace: boolean = false
): T[] => {
  return replace 
    ? array.map((item) => (item.id === newItem.id ? newItem : item)) 
    : [newItem, ...array];
};

export const useSocialPaymentsStore = create<SocialPaymentsStore>()(
  persist(
    (set) => ({
      contacts: [
        {
          id: "contact-1",
          name: "Alex Johnson",
          username: "alexj",
          avatar: "/avatars/man-1.png",
          walletAddress: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
        },
        {
          id: "contact-2",
          name: "Emma Wilson",
          username: "emmaw",
          avatar: "/avatars/woman-2.png",
          walletAddress: "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a",
        },
        {
          id: "contact-3",
          name: "Michael Brown",
          username: "mikeb",
          avatar: "/diverse-avatars.png",
          walletAddress: "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b",
        },
      ],
      groups: [
        {
          id: "group-1",
          name: "Apartment Expenses",
          description: "Split rent and utilities",
          members: [
            {
              id: "contact-1",
              name: "Alex Johnson",
              avatar: "/avatars/man-1.png",
            },
            {
              id: "contact-2",
              name: "Emma Wilson",
              avatar: "/avatars/woman-2.png",
            },
            {
              id: "me",
              name: "You",
              avatar: "/avatars/woman-1.png",
            },
          ],
          balance: 125.5,
        },
        {
          id: "group-2",
          name: "Vacation Fund",
          description: "Summer trip to Hawaii",
          members: [
            {
              id: "contact-1",
              name: "Alex Johnson",
              avatar: "/avatars/man-1.png",
            },
            {
              id: "contact-3",
              name: "Michael Brown",
              avatar: "/diverse-avatars.png",
            },
            {
              id: "me",
              name: "You",
              avatar: "/avatars/woman-1.png",
            },
            {
              id: "contact-4",
              name: "Jessica Lee",
              avatar: "/diverse-avatars.png",
            },
          ],
          balance: -75.25,
        },
      ],
      activities: [
        {
          id: "activity-1",
          type: "payment",
          user: {
            id: "contact-1",
            name: "Alex Johnson",
            avatar: "/avatars/man-1.png",
          },
          recipient: {
            id: "me",
            name: "You",
            avatar: "/avatars/woman-1.png",
          },
          amount: 45.5,
          note: "Dinner last night",
          timestamp: "2025-05-09T18:30:00Z",
          status: "completed",
        },
        {
          id: "activity-2",
          type: "request",
          user: {
            id: "contact-2",
            name: "Emma Wilson",
            avatar: "/avatars/woman-2.png",
          },
          recipient: {
            id: "me",
            name: "You",
            avatar: "/avatars/woman-1.png",
          },
          amount: 25.0,
          note: "Movie tickets",
          timestamp: "2025-05-08T20:15:00Z",
          status: "pending",
        },
        {
          id: "activity-3",
          type: "split",
          user: {
            id: "contact-3",
            name: "Michael Brown",
            avatar: "/diverse-avatars.png",
          },
          recipient: {
            id: "me",
            name: "You",
            avatar: "/avatars/woman-1.png",
          },
          amount: 37.8,
          note: "Lunch at Cafe Deluxe",
          timestamp: "2025-05-07T13:45:00Z",
          status: "completed",
        },
        {
          id: "activity-4",
          type: "group",
          user: {
            id: "contact-1",
            name: "Alex Johnson",
            avatar: "/avatars/man-1.png",
          },
          note: "Added you to the group",
          timestamp: "2025-05-05T09:20:00Z",
          groupName: "Apartment Expenses",
        },
      ],
      addContact: (contact) =>
        set((state) => ({
          contacts: updateArray(state.contacts, { id: generateId("contact"), ...contact }),
        })),
      removeContact: (id) =>
        set((state) => ({
          contacts: state.contacts.filter((contact) => contact.id !== id),
        })),
      addGroup: (group) =>
        set((state) => ({
          groups: updateArray(state.groups, { id: generateId("group"), ...group }),
        })),
      removeGroup: (id) =>
        set((state) => ({
          groups: state.groups.filter((group) => group.id !== id),
        })),
      addActivity: (activity) =>
        set((state) => ({
          activities: updateArray(state.activities, { id: generateId("activity"), ...activity }),
        })),
      createActivity: (activity) => {
        set((state) => ({
          activities: updateArray(state.activities, { id: generateId("activity"), ...activity }),
        }));
      },
      updateActivityStatus: (id, status) => {
        set((state) => ({
          activities: state.activities.map((activity) =>
            activity.id === id ? { ...activity, status } : activity
          ),
        }));
      },
    }),
    {
      name: "social-payments-storage", // Key in localStorage
    }
  )
);