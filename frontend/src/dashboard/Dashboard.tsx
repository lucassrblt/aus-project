import {Box} from "@mui/material";
import React, {useEffect} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {authenticatedGet, authenticatedPost} from "../auth/helper";
import { DashboardBox } from "../components/cards/DashboardBox";
import RecruteBox from "../components/cards/RecruteBox";
import CompleteBox from "../components/cards/profilCompleteBox.tsx";
import {useContext} from "react";
import {AuthContext} from '../context/AuthContext.tsx'
export function Dashboard() {
    const { getAccessTokenSilently } = useAuth0();
    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState<any[] | null>(null);
    const [topMetier, setTopMetier] = React.useState<any[] | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    // const {state} = useAuth();
    const context=useContext(AuthContext)
    const state = context?.state
    const setState = context?.setState


    React.useEffect(() => {
        console.log('state in dashboard', state)
        async function callApi() {
            try {
                const token = await getAccessTokenSilently();
                const document = await authenticatedGet(token, "/offres/dashboard/6");
                const topOffres = await authenticatedGet(token, "/v1/offres/top-metier");
                setData(document);
                setTopMetier(topOffres);
            } catch (error) {
                setTimeout(() => {
                    setError(`Error from web service: ${error}`);
                }, 1000)
            } finally {
                setLoading(false);
            }
        }

    callApi();
  },[]);
    const {  user } = useAuth0();


    useEffect(() => {
        const setContext = async () => {
            console.log("test")
            const token = await getAccessTokenSilently();
            const userInfos = await authenticatedPost(token, "v1/candidats", { email: user?.email });
            console.log(token,userInfos)
            // setState({
            //     user:userInfos,
            //     token:token,
            // })
            setState && setState({
              user: userInfos,
              token: token,
            });
        };

        if(!state?.user){
            setContext()
        }

    }, []);


  return loading && !state ? (
    <Box>chargement...</Box>
  ) : (
    <>
      <div className="titre_dashboard">
        <h1>Hello</h1>
        <h2>Bienvenue dans votre espace stagiaire</h2>
      </div>

      <Box
        className="dashboard_container"
        onClick={() => console.log("state", state?.user)}>
        {error ? (
          `Dashboard: response from API (with auth) ${error}`
        ) : (
          <ul className="dashboard_box_container">
            {data &&
              data.length > 0 &&
              data.map((offre, index) => (
                <DashboardBox offre={offre} key={index} />
              ))}
          </ul>
        )}
        {topMetier && (
          <div className="dasboard_section2">
            <CompleteBox />
            <RecruteBox offre={topMetier} key={topMetier[0].metiers} />
          </div>
        )}
      </Box>
    </>
  );
}
