import React, {useReducer} from "react";

type AppState = {
    offres: Offre[];
};

type Offre = any

type AppContext = {
    state: AppState;
    dispatch: React.Dispatch<Action>;
};

export function markOffre(offre: Offre) {
    return { type: "MARK_OFFRE", payload: offre };
}

type Action = ReturnType<typeof markOffre>;

export const initialState: AppState = {
    offres: [],
};

export function reducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case "MARK_OFFRE": {
            const offreUpdated = { ...action.payload, isMarqued: true };
            return { ...state, offres: [...state.offres, offreUpdated] };
        }
        default:
            return state;
    }
}

const OffreContext = React.createContext<AppContext>({
    state: initialState,
    dispatch: () => {},
});

export function useOffre() {
    const context = React.useContext(OffreContext);
    if(!context){
        throw new Error('useAppContext must be used within a AppProvider');
    }
    return context;
}

export function OffreProvider({ children } :any) {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <OffreContext.Provider value={{state, dispatch}}>{children}</OffreContext.Provider>
    )
}