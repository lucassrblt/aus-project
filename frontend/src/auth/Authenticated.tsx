import React from "react";
import {useAuth0} from "@auth0/auth0-react";


export function Authenticated({ children }: React.PropsWithChildren) {
    const { loginWithRedirect, user, isLoading, error } = useAuth0();
    React.useEffect(() => {
        if (error) {
            return;
        } else if (!user && !isLoading){
            loginWithRedirect({
                authorizationParams: {
                    redirect_uri: `https://rouge.aus.floless.fr/dashboard`
                }
            })
        }
    }, [user, isLoading, loginWithRedirect, error]);

    if (error) return <div>Oops... {error.message}</div>;
    return isLoading ? <div>Loading...</div> : <>{children}</>;
}
