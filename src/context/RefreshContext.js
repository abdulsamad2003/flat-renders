import React, { createContext, useContext, useState } from "react";

const RefreshContext = createContext({
    refreshFlag: false,
    triggerRefresh: () => {}
});

export const RefreshProvider = ({children}) => {
    const [refreshFlag, setRefreshFlag] = useState(false);
    const triggerRefresh = () => setRefreshFlag(prev => !prev)
    return (
        <RefreshContext.Provider value={{refreshFlag, triggerRefresh}}>
            {children}
        </RefreshContext.Provider>
    )
}

export const useRefresh = () => useContext(RefreshContext);