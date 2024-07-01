import React from "react";
import "./selection.scss";
import { useAuth0 } from "@auth0/auth0-react";
import { authenticatedPost} from "../auth/helper";
import { DashboardBox } from "../components/cards/DashboardBox";

export default function Selection() {
  const { getAccessTokenSilently, user } = useAuth0();
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  React.useEffect(() => {
    async function callApi() {
      try {
        const token = await getAccessTokenSilently();
        const userInfos = await authenticatedPost(token, "/v1/candidats", {email: user?.email})
        const document = await authenticatedPost(token, "/v1/getfavoris", {user_id: userInfos?.id});
        setData(document);
      } catch (error) {
        setError(`Error from web service: ${error}`);
      } finally {
        setLoading(false);
      }
    }
    callApi();
  }, []);

  return loading ? (
    <div>chargement...</div>
  ) : (
    <div>
      {error ? (
        `Dashboard: response from API (with auth) ${error}`
      ) : (
        <ul className="dashboard_box_container">
          {data &&
            data.length > 0 &&
            data.map((offre, index) => (
              <DashboardBox offre={offre} key={index} favorite={true}/>
            ))}
        </ul>
      )}
    </div>
  );
}
