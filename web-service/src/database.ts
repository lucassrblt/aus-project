import pg from "pg";
type SearchType = "metier" | "commune" | "contrat" | "default";

interface TableMapItem {
  table: string;
  column: string;
}

interface TableMap {
  [key: string]: TableMapItem;
}

const tableMap: TableMap = {
  metier: { table: "metier", column: "metier" },
  commune: { table: "commune", column: "nom_commune" },
  contrat: { table: "offre", column: "type_contrat" },
  default: { table: "offre", column: "titre_emploi" }
};
const pool = new pg.Pool({
  user: process.env.RDB_USER || "aus-user",
  database: process.env.RDB_DATABASE || "aus",
  password: process.env.RDB_PASSWORD || "aus2025",
  port: parseInt(process.env.RDB_PORT || "5433", 10),
  host: process.env.RDB_HOST || "localhost",
});

process.on("exit", () => {
  pool.end();
});

export async function query(sqlStatement: string, params?: any[]): Promise<any[]> {
  const client = await pool.connect();
  try {
    const response = await client.query(sqlStatement, params);
    return response.rows;
  } catch (error) {
    console.error('Query failed: ', error);
    throw error;
  } finally {
    client.release();
  }
}

export function getFirstOffres(actualPage: number = 1, count: number = 10): Promise<any[]> {
  const offset = (actualPage - 1) * count;
  return query(`
    SELECT titre_emploi, commune_id, metier_id, offre.id, description_courte, type_contrat 
    FROM offre 
    JOIN commune ON offre.commune_id = commune.id 
    JOIN metier ON offre.metier_id = metier.id 
    LIMIT $1 OFFSET $2
  `, [count, offset]);
}

export function getOffreDashboard(count: number = 4): Promise<any[]> {
  return query(`
    SELECT titre_emploi, commune_id, metier_id, offre.id, description_courte, type_contrat  FROM offre 
    JOIN commune ON offre.commune_id = commune.id 
    JOIN metier ON offre.metier_id = metier.id 
    LIMIT $1
  `, [count]);
}

export async function getTopMetier(): Promise<any[]> {
  try {
    const topSecteurs = await query(`
      SELECT secteur_id, COUNT(secteur_id) as count 
      FROM metier 
      GROUP BY secteur_id 
      ORDER BY count DESC LIMIT 3
    `);
    const topMetier: any[] = [];

    for (const secteur of topSecteurs) {
      const metiers = await query(`
        SELECT metier.metier 
        FROM metier 
        JOIN secteur ON metier.secteur_id = secteur.id 
        WHERE secteur.id = $1 
        ORDER BY metier.id DESC LIMIT 3
      `, [secteur.secteur_id]);
      const secteurNameRequest = await query(`SELECT secteur FROM secteur WHERE id = $1`, [secteur.secteur_id]);
      const secteurName = secteurNameRequest[0].secteur;

      topMetier.push({ secteur: secteurName, nombre_offres: secteur.count, metiers });
    }
    return topMetier;
  } catch (error) {
    console.error('Failed to fetch top sectors and jobs', error);
    throw error;
  }
}

export function searchOffres(search: string, actualPage: number, lieu: string, contrat: string): Promise<any[]> {
  let baseQuery = `SELECT * FROM offre WHERE `;
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push(`titre_emploi LIKE $1`);
    params.push(`%${search}%`);
  }
  if (lieu) {
    conditions.push(`lieu LIKE $${params.length + 1}`);
    params.push(`%${lieu}%`);
  }
  if (contrat) {
    conditions.push(`contrat LIKE $${params.length + 1}`);
    params.push(`%${contrat}%`);
  }

  if (conditions.length === 0) {
    return getFirstOffres(actualPage);
  }

  baseQuery += conditions.join(' OR ') + ` LIMIT 10 OFFSET $${params.length + 1}`;
  params.push((actualPage - 1) * 10);

  return query(baseQuery, params);
}

  export async function updateFavoris(data: any) {
    try {
      const favorisList = await query(`SELECT (id_offre, id_candidat)  FROM favoris WHERE VALUES ($1), [data.id_offre, data.user_id]`)

      if(favorisList){
        const addFavoris = await query(`INSERT INTO favoris (id_offre, id_candidat) VALUES ($1, $2)`, [data.offre_id, data.user_id]);
      }else{
        const deleteFavoris = await query(`DELETE from favoris WHERE (id_offre, id_candidat)`, [data.offre_id, data.user_id]);
      }

    } catch (errror) {
      return errror
    }
  }


  export function getFirstCandidats(email: string): Promise<any[]> {
    return query(`SELECT * FROM candidat WHERE candidat.email = $1 LIMIT 1`, [email])
        .then(results => results.length > 0 ? results[0] : null);
  }

  export function getSearchSuggestions(search: string, type: SearchType): Promise<any[]> {
    const item = tableMap[type] || tableMap["default"];
    const sql = `SELECT ${item.column} FROM ${item.table} WHERE ${item.column} LIKE $1 LIMIT 5`;
    const params = [`%${search}%`];
    return query(sql, params);
  }

  export function getSecteurs(): Promise<any[]> {
    return query(`
    SELECT DISTINCT secteur.* 
    FROM secteur 
    JOIN metier ON secteur.id = metier.secteur_id;
  `);
  }

  export async function getFavoris(user_id: any) {
    return query(`SELECT * FROM offre WHERE id IN (SELECT id_offre FROM favoris WHERE id_candidat = $1)`, [user_id])
  }

  type updateProfileProps = {
    nom: string,
    prenom: string,
    telephone: string,
    pays: string,
    secteur_activite: string,
    biographie: string,
    linkedin: string,
    site_web: string,
    email: string
  }

  export function updateProfile({
                                  nom,
                                  prenom,
                                  telephone,
                                  pays,
                                  secteur_activite,
                                  biographie,
                                  linkedin,
                                  site_web,
                                  email
                                }: updateProfileProps): Promise<any[]> {

    const sql =
        `UPDATE candidat 
    SET nom = $1, prenom = $2, telephone = $3, pays = $4, secteur_activite = $5, biographie = $6, linkedin = $7, site_web = $8
    WHERE email = $9;`

    const values = [nom, prenom, telephone, pays, secteur_activite, biographie, linkedin, site_web, email];
    return query(sql, values);

  }