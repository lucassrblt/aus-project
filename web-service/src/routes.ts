import express, { json } from "express";
const router = express.Router()
import {
    getFavoris,
    getFirstCandidats,
    getSearchSuggestions,
    getSecteurs,
    updateFavoris,
    updateProfile, query
} from "./database"
import {getFirstOffres, getOffreDashboard, getTopMetier, searchOffres} from "./database";
type SearchType = "metier" | "commune" | "contrat" | "default";




router.post("/v1/candidats", async function (req, res) {
try {
    const { email } = req.body
    // recuperer le candidat depuis ma base de donne qui correspond au mail dans le body
    const candidat = await getFirstCandidats(email)
    res.send(candidat)
} catch (error) {
    res.status(500).send({ error: "Internal Server Error", reason: error });
}
});

router.get('/helloworld', function (req, res) {
   res.send('Hello World')
})

router.post("/v1/updateProfile", async function (req, res) {
    try {
        const { email, name, firstname, phoneNumber, country, industry, bio, linkedin, website } = req.body;
        console.log("NAME", name, "PRENOM", firstname);

        try {
            const profile = await updateProfile({nom : name, prenom : firstname, telephone: phoneNumber, pays: country, secteur_activite: industry, biographie: bio, linkedin: linkedin, site_web: website, email});
            res.status(200).send(profile);
        } catch (error) {
            res.status(500).send({ error: "Erreur lors de la mise à jour du profil" });
        }
    } catch (error) {
        res.status(400).send({ error: "Données de requête invalides" });
    }
})

router.post("/v1/favoris", async function (req, res){
    try{
        const {user_id, offre_id} = req.body
        const favoris = await updateFavoris({user_id, offre_id})
    }catch(error){

    }
})


router.get("/v1/offres/:page/:count", async function (req, res) {
    try {
        const page = parseInt(req.params.page);
        const count = parseInt(req.params.count);
        const offres = await getFirstOffres(page, count);
        const queryNumber = await query(`SELECT COUNT(titre_emploi) FROM offre`);
        const NumberPageTotal = Math.ceil(queryNumber[0].count / count)
        res.status(200).send(
            {
                offres: offres,
                NumberPageTotal: NumberPageTotal
            }
        );
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error", reason: error });
    }
});
router.get("/offres/dashboard/:count", async function (req, res) {
    try {
        console.log("getOffreDashboard")
        const count = parseInt(req.params.count);
        const offres = await getOffreDashboard(count);
        res.status(200).send(offres);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error", reason: error });
    }
});

router.get("/v1/offres/top-metier", async function (_, res) {
    try {
        const offres = await getTopMetier();
        res.status(200).send(offres);
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error", reason: error });
    }
});

router.get("/search/:string/:lieu/:contrat/:actualpage", async function (req, res) {
    try{
        const {string, lieu, contrat} = req.params
        const actualpage = parseInt(req.params.actualpage)
        const queryNumber = await query(`SELECT COUNT(*) FROM offre WHERE titre_emploi LIKE '%${string}%' OR lieu LIKE '%${actualpage}%' OR contrat LIKE '%${string}%'`);
        const NumberPageTotal = Math.ceil(queryNumber[0].count / 10)

        const offres = await searchOffres(string, actualpage, lieu, contrat)
        if(offres.length === 0){
            res.status(404).send({error:"Not found"})
            return
        }
        res.status(200).send(
            {
                offres: offres,
                NumberPageTotal: NumberPageTotal
            }
        )
    }
    catch(error){
        res.status(500).send({error:"error", reason:error})
    }
})

router.post("/v1/getfavoris", async function (req, res ){
    const { user_id } =  req.body

    const favoris = await getFavoris(user_id)
    res.status(200).send(favoris)
})

router.get("/search/suggest/:string/:typer", async function (req, res) {
    const { string, typer } = req.params;

    // Validate 'typer' to be one of the acceptable values
    if (!["metier", "commune", "contrat", "default"].includes(typer)) {
        return res.status(400).send({ error: "Invalid search type provided" });
    }

    try {
        const suggestions = await getSearchSuggestions(string, typer as SearchType);

        let fieldName: string;
        switch (typer) {
            case "metier":
                fieldName = "metier";
                break;
            case "commune":
                fieldName = "nom_commune";
                break;
            case "contrat":
                fieldName = "type_contrat";
                break;
            default:
                fieldName = "titre_emploi";
        }

        res.status(200).send(suggestions.map((suggestion: any) => suggestion[fieldName]));
    } catch (error) {
        console.error('Failed to fetch search suggestions:', error);
        res.status(500).send({ error: "error", reason: error });
    }
});
router.get("/secteurs", async function (_, res) {
    try {
        const secteurs = await getSecteurs();
        res.status(200).send(secteurs);
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error", reason: error });
    }
});


module.exports = router