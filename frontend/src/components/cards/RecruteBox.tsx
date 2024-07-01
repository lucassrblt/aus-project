

export default function RecruteBox({offre,key}: {offre: any, key: any}) {
    return (
        <div className="recrute_box" key={key}>
            <h2 className="titre_recrute top">Les secteurs qui recrutent</h2>
            {offre.map((offre: any) => (
                <div key={offre.id} className="box_recrute">
                    <div className="titre_recrute_container">
                        <h2 className="titre_recrute">{offre.secteur}</h2>
                        <p className="nombre_recrute">{offre.nombre_offres}</p>
                    </div>
                   
                    <div className="tags_recrute">
                        {offre.metiers.map((metier: any) => (
                            <p className="metier_recrute">{metier.metier}</p>
                        ))}
                    </div>
                </div>
            ))}
            
        </div>
    );
}