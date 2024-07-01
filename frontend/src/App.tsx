import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Dashboard } from "./dashboard/Dashboard";
import { Parametres } from "./parametres/Parametres";
import { Offre } from "./offre/Offre.tsx";
import LandingPage from "./landing-page/LandingPage.tsx";
import Navbar from "./components/Navbar.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import { Authenticated } from "./auth/Authenticated.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";
import { OffreProvider } from "./context/OffreContext.tsx";
import Selection from "./selection/selection.tsx"



export function App() {
    return (
        <>
        <Auth0Provider
            domain="rouge-aus.eu.auth0.com"
            clientId="ky2NZpStWuhMYVy9WZBeBb5QQXEndo8P"
            authorizationParams={{
                audience: "api.rouge.aus.floless.fr",
                redirect_uri: window.location.origin,
            }}
        >
            <AuthProvider>
                <OffreProvider>
                    <BrowserRouter>
                        <Navbar/>

                            <Routes>
                                <Route path="/" element={<LandingPage/>}/>
                                <Route path="/dashboard" element={<Authenticated children={<Dashboard/>}/>}/>
                                <Route path="/offres" element={<Authenticated children={<Offre/>}/>}/>
                                <Route path="/profile" element={<Authenticated children={<Parametres/>}/>}/>
                                <Route path="/selection" element={<Authenticated children={<Selection />}/>}/>
                            </Routes>

                    </BrowserRouter>
                </OffreProvider>
            </AuthProvider>
        </Auth0Provider>
        </>
    )
}