import { ReactNode, Dispatch, SetStateAction, FC } from "react";

export interface NavItem {
  title: string;
  href: string;
  icon: ReactNode;
  badge?: string;
  badgeColor?: string;
  isPinned?: boolean;
  isExternal?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
}

export interface AuthHook {
  user?: { name: string; [key: string]: any };
  address?: string;
  disconnect: () => void;
}

export interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export interface MobileSidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  overlayVariants: any;
  mobileMenuVariants: any;
  SidebarContent: FC;
}

export interface SearchResultsProps {
  showSearchResults: boolean;
  filteredItems: NavItem[];
  setShowSearchResults: Dispatch<SetStateAction<boolean>>;
  addToRecentPages?: (item: NavItem) => void;
}
