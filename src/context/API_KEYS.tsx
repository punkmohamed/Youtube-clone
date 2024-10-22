import { createContext, ReactNode, useContext } from "react"
type API_KEYS = {
    API_KEYS_1: string
    API_KEYS_2: string
    API_KEYS_3: string
    API_KEYS_4: string
}

const ApiContext = createContext<API_KEYS>(null)
type ApiProviderProps = {
    children: ReactNode
}
export function useApiContext() {
    const value = useContext(ApiContext)
    if (value == null) throw Error("Cannot use outside of SidebarProvider")

    return value
}
export function ApiProvider({ children }: ApiProviderProps) {
    const API_KEYS_1 = 'AIzaSyDEQEJ3qvVvroAwP-pBh97vXMCHDNJzMeY'  // used 5
    const API_KEYS_2 = 'AIzaSyCnDk7A88Tis3iiLKO_GZcRcEtpoh6WMDA' // used 6
    const API_KEYS_3 = 'AIzaSyB5IJeRJobv4jHDFOsO4e1ZelW_NDZ8vds' // used 4
    const API_KEYS_4 = 'AIzaSyBE6V01lroMLICgaUll6b7zB6n5GDhvyTY' // used 5
    return (
        <ApiContext.Provider value={{ API_KEYS_1, API_KEYS_2, API_KEYS_3, API_KEYS_4 }}>
            {children}
        </ApiContext.Provider>
    )
}