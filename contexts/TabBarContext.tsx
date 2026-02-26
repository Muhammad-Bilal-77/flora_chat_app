import React, { createContext, useContext, useState } from 'react';

interface TabBarContextType {
    isTabBarVisible: boolean;
    setTabBarVisible: (visible: boolean) => void;
}

const TabBarContext = createContext<TabBarContextType>({
    isTabBarVisible: true,
    setTabBarVisible: () => {},
});

export function TabBarProvider({ children }: { children: React.ReactNode }) {
    const [isTabBarVisible, setTabBarVisible] = useState(true);

    return (
        <TabBarContext.Provider value={{ isTabBarVisible, setTabBarVisible }}>
            {children}
        </TabBarContext.Provider>
    );
}

export function useTabBar() {
    return useContext(TabBarContext);
}
