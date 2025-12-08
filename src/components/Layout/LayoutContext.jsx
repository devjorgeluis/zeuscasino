import { createContext } from "react";

export const LayoutContext = createContext({
    isLogin: false,
    userBalance: "",
    handleLoginClick: () => { },
    handleLogoutClick: () => { },
    handleChangePasswordClick: () => { },
    refreshBalance: () => { },
    isSidebarExpanded: true,
    toggleSidebar: () => { },
});
