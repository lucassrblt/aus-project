
import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { authenticatedGet } from '../auth/helper';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export const SearchComponent = ({search, setSearch, setIsFocus, isFocus, searchOffres,lieu,setLieu,contrat,setContrat}: {search: string, setSearch: React.Dispatch<React.SetStateAction<string>>, setIsFocus: React.Dispatch<React.SetStateAction<boolean>>, isFocus: boolean, searchOffres: (search: string) => void,lieu: string, setLieu: React.Dispatch<React.SetStateAction<string>>,contrat: string, setContrat: React.Dispatch<React.SetStateAction<string>>,loading: boolean,Noresult: boolean}) => {
    const  [suggest, setSuggest] = React.useState<string[]>([]);
    const { getAccessTokenSilently } = useAuth0();
    const [type, setType] = React.useState<string>("metier");
    const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {  
        setType("metier");
        setSuggest([]);
        setSearch(event.target.value);
        const token = await getAccessTokenSilently();
        const document = await authenticatedGet(token, `/search/suggest/${event.target.value}/metier`);
        if(document.error){
            return;
        }
        setSuggest(document);
    };
    const handleLieuChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setType("commune");
        setSuggest([]);
        setLieu(event.target.value);
        const token = await getAccessTokenSilently();
        console.log(event.target.value)
        const document = await authenticatedGet(token, `/search/suggest/${event.target.value}/commune`);
        if(document.error){
            return;
        }
        setSuggest(document);
    }
    const handleContratChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setType("contrat");
        setSuggest([]);
        setContrat(event.target.value);
        const token = await getAccessTokenSilently();
        const document = await authenticatedGet(token, `/search/suggest/${event.target.value}/contrat`);
        if(document.error){
            return;
        }
        setSuggest(document);
    }
    const onSuggestClick = (suggestion: string, type: string) => {
        switch(type){
            case "metier":
                setSearch(suggestion);
                break;
            case "commune":
                setLieu(suggestion);
                break;
            case "contrat":
                setContrat(suggestion);
                break;
            default:
                setSearch(suggestion);
        }
        setSuggest([]);
    }
    return (
       <div style={{position:"relative"}}> <div className={`search_container ${isFocus ? "focus" : ""}`} >
            <input type="text" placeholder="Rechercher un emploi" value={search} onChange={handleSearchChange} className="search_input" onFocus={() => setIsFocus(true)} onBlur={() => setIsFocus(false)} />
            <input type="text" placeholder="Lieu " value={lieu} onChange={handleLieuChange} className="search_input lieu" onFocus={() => setIsFocus(true)} onBlur={() => setIsFocus(false)} />
            <input type="text" placeholder="Type de contrat" value={contrat} onChange={handleContratChange} className="search_input contrat" onFocus={() => setIsFocus(true)} onBlur={() => setIsFocus(false)} />
            <button onClick={() => searchOffres(search)} className="search_button">Rechercher</button>
           
        </div>
        {suggest && suggest.length>0 && 
       <> <div className="suggestion_container">
            {suggest.map((suggestion, index) => (
                <div key={index} className="suggestion" onClick={() => onSuggestClick(suggestion, type)}>
                    <p>{suggestion}</p>
                </div>
            ))}
         
        </div>
            <div className='slide_up_button' onClick={() => setSuggest([])}>
                <ExpandLessIcon style={{width: "30px", height: "30px"}} />
            </div>
        </>
        }
        </div>
    );
}