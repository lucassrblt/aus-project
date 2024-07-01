import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { authenticatedPost } from "../auth/helper";

export function Parametres() {
  const { getAccessTokenSilently, user } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any | null>(null);
  const [modificationMode, setModificationMode] = useState(false);

  useEffect(() => {
    async function callApi() {
      try {
        const token = await getAccessTokenSilently();
        const candidat = await authenticatedPost(token, "/v1/candidats", { email: user?.email });
        setData(candidat);
      } catch (error) {
        console.log(`Error from web service: ${error}`);
      } finally {
        setLoading(false);
      }
    }
    callApi();
  }, [getAccessTokenSilently, user?.email]);  

  return loading ? (
    <p>Un instant</p>
  ) : (
    !modificationMode ? (
      <>
        <div className="profile-container">
          <div className="profile-details">
            <p className="profile-item-email"><span className="profile-data-email">{data?.email}</span></p>
            <p className="profile-item">Nom <span className="profile-data">{data?.nom}</span></p>
            <p className="profile-item">Prénom <span className="profile-data">{data?.prenom}</span></p>
            <p className="profile-item">Téléphone <span className="profile-data">{data?.telephone}</span></p>
            <p className="profile-item">Pays <span className="profile-data">{data?.pays}</span></p>
            <p className="profile-item">Secteur d'activité <span className="profile-data">{data?.secteur_activite}</span></p>
            <p className="profile-item">LinkedIn <span className="profile-data">{data?.linkedin}</span></p>
            <p className="profile-item">Site web externe <span className="profile-data">{data?.site_web}</span></p>
            <p className="profile-item">Biographie <span className="profile-data">{data?.biographie}</span></p>
          </div>
          <div className="button-container">
            <button className="edit-button" onClick={() => setModificationMode(true)}>Modifier</button>
          </div>
        </div>
      </>
    ) : (
      <Form setModificationMode={setModificationMode} data={data} />
    )
  );
}

function Form({ setModificationMode, data }: { setModificationMode: (value: boolean) => void, data: any }) {
  const { getAccessTokenSilently } = useAuth0();
  
  const sendProfileData = async (profileData: object) => {
    try {
      const token = await getAccessTokenSilently();
      const candidat = await authenticatedPost(token, "/v1/updateProfile", profileData);
      console.log(candidat);
      setModificationMode(false);
    } catch (error) {
      console.error("Erreur lors de l'envoi des données :", error);
    }
  }
  
  // Champs du formulaire
  const [name, setName] = useState(data?.nom || "");
  const [firstname, setFirstname] = useState(data?.prenom || "");
  const [phoneNumber, setPhoneNumber] = useState(data?.telephone || "");
  const [country, setCountry] = useState(data?.pays || "");
  const [industry, setIndustry] = useState(data?.secteur_activite || "");
  const [bio, setBio] = useState(data?.biographie || "");
  const [linkedin, setLinkedin] = useState(data?.linkedin || "");
  const [website, setWebsite] = useState(data?.site_web || "");

  const submitForm = (e: any) => {
    e.preventDefault();
    const profileData = {
      email: data?.email,
      name,
      firstname,
      phoneNumber,
      country,
      industry,
      bio,
      linkedin,
      website
    };
    console.log("Données profil : ", profileData);
    sendProfileData(profileData);
  };

  return (
<div className="form-container">
  <form onSubmit={submitForm} className="form">
    <div className="form-group">
      <label htmlFor="name" className="form-label">Nom</label>
      <input type="text" id="name" className="form-input" onChange={(e) => setName(e.target.value)} value={name} />
    </div>
    <div className="form-group">
      <label htmlFor="firstname" className="form-label">Prénom</label>
      <input type="text" id="firstname" className="form-input" onChange={(e) => setFirstname(e.target.value)} value={firstname} />
    </div>
    <div className="form-group">
      <label htmlFor="phoneNumber" className="form-label">Téléphone</label>
      <input type="text" id="phoneNumber" className="form-input" onChange={(e) => setPhoneNumber(e.target.value)} value={phoneNumber} />
    </div>
    <div className="form-group">
      <label htmlFor="country" className="form-label">Pays</label>
      <input type="text" id="country" className="form-input" onChange={(e) => setCountry(e.target.value)} value={country} />
    </div>
    <div className="form-group">
      <label htmlFor="industry" className="form-label">Secteur d'activité</label>
      <select id="industry" className="form-select" onChange={(e) => setIndustry(e.target.value)}>
        <option value="">--Sélectionner un secteur d'activité--</option>
        <option value="Informatique">Informatique</option>
        <option value="Finance">Finance</option>
        <option value="Architecture">Architecture</option>
        <option value="Agriculture">Agriculture</option>
        <option value="Restauration">Restauration</option>
      </select>
    </div>
    <div className="form-group">
      <label htmlFor="linkedin" className="form-label">Profil LinkedIn</label>
      <input type="text" id="linkedin" className="form-input" onChange={(e) => setLinkedin(e.target.value)} value={linkedin} />
    </div>
    <div className="form-group">
      <label htmlFor="website" className="form-label">Site web externe</label>
      <input type="text" id="website" className="form-input" onChange={(e) => setWebsite(e.target.value)} value={website} />
    </div>
    <div className="form-group">
      <label htmlFor="bio" className="form-label">Biographie</label>
      <textarea id="bio" className="form-textarea" onChange={(e) => setBio(e.target.value)} value={bio}></textarea>
    </div>
    <div className="form-actions">
      <input type="submit" value="Enregistrer" className="form-submit" />
      <button type="button" className="form-button" onClick={() => setModificationMode(false)}>Annuler</button>
    </div>
  </form>
</div>
  );
}