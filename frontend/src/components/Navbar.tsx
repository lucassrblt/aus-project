import {useLocation, useNavigate} from "react-router";
import {User, LogOut, CircleUser, CircleHelp} from "lucide-react"
import React, {useEffect, useRef, useState} from "react";
import ButtonComponent from "./ButtonComponent.tsx";
import MenuIcon from '@mui/icons-material/Menu';
import ClearSharpIcon from '@mui/icons-material/ClearSharp';
import {useAuth0} from "@auth0/auth0-react";
import Logo from "./Logo.tsx";

export default function Navbar() {
    const [profileState, setProfileState] = useState(false)
    const navigation = useNavigate()
    const location = useLocation();
    const dropdown = useRef<HTMLDivElement>(null)
    const {logout} = useAuth0();

    const navbarList = [
        {
            name: 'Dashboard',
            path: '/dashboard'
        },
        {
            name: 'Offres',
            path: '/offres'
        },
        {
            name: 'Selection',
            path: '/selection'
        },
    ]
    const profilList = [
        {
            icon: CircleUser,
            name: 'Profil',
            path: "/profile"
        },
        {
            icon: CircleHelp,
            name: 'Aide',
            path: "/aide"
        },
    ]

    useEffect(() => {
        if (profileState) {
            if (dropdown.current) {
                dropdown.current.classList.add("dropdown-infos-active");
                setTimeout(() => {
                    if (dropdown.current) {
                        dropdown.current.classList.remove("dropdown-infos-active");
                    }
                    setProfileState(false);
                }, 3000);
            }
        }
    }, [profileState]);

    const checkCurrentPath = (path: string): string => {
        return path === location.pathname ? 'active' : '';
    }

    const handleProfileState = () => {
        setProfileState(!profileState)
    }
   const [open, setOpen] = useState(false);

    return (
        <div className="navbar">
            <Logo />
            <div className="menu">
                {open ?
                    <ClearSharpIcon onClick={() => setOpen(false)} style={{width: '30px', height: '30px'}}/>
                    :
                    <MenuIcon onClick={() => setOpen(true)} style={{width: '30px', height: '30px'}}/>
                }
            </div>
            {
                open && <div className="menu_mobile">
                    <ul>
                        {navbarList.map((el, index) => {
                            return (
                                <div className="list-item" key={index}>
                                    <li onClick={() => {
                                        setOpen(false);
                                        navigation(el.path)
                                    
                                    }} className={checkCurrentPath(el.path)}>
                                        {el.name}
                                    </li>
                                    <div className={checkCurrentPath(el.path)}>
                                    </div>
                                </div>
                            )
                        })}
                    </ul>
                </div>

            }
            <div className="navlist">
            
                <ul>
                    {navbarList.map((el, index) => {
                        return (
                            <div className="list-item" key={index}>
                                <li onClick={() => navigation(el.path)} className={checkCurrentPath(el.path)}>
                                    {el.name}
                                </li>
                                <div className={checkCurrentPath(el.path)}>
                                </div>
                            </div>
                        )
                    })}
                </ul>
            </div>
            <div className="action">
                {location.pathname !== '/' &&
                    <>
                        <div className="icon-container" onClick={handleProfileState}>
                            <User/>
                        </div>
                        <div className="icon-container" title="Déconnexion"
                             onClick={() =>
                                 logout({
                                     logoutParams: {returnTo: "https://rouge.aus.floless.fr/"}
                                 })}>
                            <LogOut/>
                        </div>
                        <div className='dropdown-infos' ref={dropdown}>
                            <ul>
                                {profilList.map((item, index) => (
                                    <li key={index} onClick={() => navigation(item.path)}>
                                        <div className="key">
                                            {React.createElement(item.icon)}
                                        </div>
                                        <div className="value">
                                            <p>
                                                {item.name}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                }
                {location.pathname === '/' &&
                    <ButtonComponent text="Connexion" className="" path="/dashboard"/>
                }
            </div>
        </div>
    )
}