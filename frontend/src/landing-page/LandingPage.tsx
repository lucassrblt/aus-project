import ButtonComponent from "../components/ButtonComponent.tsx";
import TagComponent from "../components/TagComponent.tsx";
import HiredCardComponent from "../components/HiredCardComponent.tsx";
import {User, Search, FileText, Briefcase} from 'lucide-react'
import {HiredTipProps, jobsArray} from "../types.ts";
import Lottie from "lottie-react"
import LottieArrow from "../assets/lottie/Arrow-lottie.json"
import CursorSvg from "../assets/svg/cursor.svg"
import CircleLottie from "../assets/lottie/Circle-lottie.json"
import {useAuth} from "../context/AuthContext.tsx";
import {useEffect} from "react";

export default function LandingPage() {
    const title: string = 'Cherchez. Postulez. '
    const titleSpan: string = 'Trouvez.'
    const getHiredTitle: string = 'Trouver Son Stage En '
    const getHiredSpan: string = '4 Etapes'
    const getHiredParagraph: string = "Quelques conseils pour postuler et être embauchés par l'entreprise de vos rêves"
    const paragraph: string = "AUS, la plateforme complète pour trouver des stages dans tous les secteurs de métier. Que vous soyez étudiant ou en reconversion professionnelle, nous vous accompagnons dans la recherche de votre prochain emploi."
    const jobs: jobsArray = [
        [
            "Médecin",
            "Enseignant",
            "Ingénieur",
            "Architecte",
            "Avocat",
            "Comptable",
            "Infirmier",
            "Pharmacien",
            "Journaliste",
            "Électricien",
            "Plombier",
            "Policier",
            "Pompier",
            "Programmeur",
            "Graphiste",
            "Chef cuisinier",
            "Vétérinaire",
            "Dentiste",
            "Psychologue",
            "Bibliothécaire",
            "Directeur de marketing",
            "Agent immobilier",
            "Consultant financier",
            "Designer industriel",
            "Entraîneur sportif",
            "Géomètre",
            "Historien",
            "Ingénieur civil",
            "Juge",
            "Kinésiologue",
            "Libraire",
            "Mathématicien",
            "Neurologue",
            "Orthodontiste",
            "Physiothérapeute",
            "Psychiatre",
            "Réalisateur",
            "Sociologue",
            "Technicien en radiologie",
            "Viticulteur"
        ],
        [
            "Astronaute",
            "Biologiste",
            "Chercheur",
            "Délégué médical",
            "Écrivain",
            "Facteur",
            "Géologue",
            "Horticulteur",
            "Illustrateur",
            "Journalier",
            "Kinésithérapeute",
            "Luthier",
            "Menuisier",
            "Notaire",
            "Opticien",
            "Photographe",
            "Quincaillier",
            "Réceptionniste",
            "Sculpteur",
            "Traducteur",
            "Urbaniste",
            "Vulcanologue",
            "Xylophile",
            "Yachting instructor",
            "Zoologiste"
        ]
    ];

    const { state } = useAuth()
    useEffect(() => {
        console.log('state', state)
    }, []);

    const hiredTips: HiredTipProps = [
        {
            icon: User,
            color: '#1CC443',
            backgroundColor: '#94F0A9',
            title: 'Créer un compte',
            paragraph: "Créer un compte et connecter vous afin de pouvoir profiter de toutes les fonctionnalités d'AUS et de pouvoir trouver votre futur job"
        },
        {
            icon: Search,
            color: '#922727',
            backgroundColor: '#FFDEDE',

            title: 'Chercher une offre',
            paragraph: "Une fois que vous avez défini vos paramètres de recherche d'emploi, vous trouverez de nombreuses offres d'emploi liées à vos intérêts professionnels sur la page des offres et vous pourrez même filtrer certaines des meilleures offres d'emploi."
        },
        {
            icon: FileText,
            color: '#3C5B7C',
            backgroundColor: '#ADC9FF',
            title: 'Importer son CV',
            paragraph: "Parmi les nombreuses offres d'emploi, sélectionnez celle qui correspond à votre profil et postulez immédiatement en téléchargeant votre CV et en répondant à quelques questions, le cas échéant."
        },
        {
            icon: Briefcase,
            color: '#E0B400',
            backgroundColor: '#FFE785',
            title: 'Trouver son stage',
            paragraph: "Après avoir postulé, attendez un peu, organisez un entretien et, si tout se passe bien, soyez embauché plus rapidement qu'avec les méthodes d'embauche traditionnelles."
        }
    ]

    const handleActive = (index: number) => {
        return index % 3 !== 0;
    }


    const buttonText: string = "Parcourir les offres"
    return (
        <div className="landing-page-section">
            <div className="main-section">
                <div className="presentation">
                    <div className="svg-message">
                        <div className="svg">
                            <img src={CursorSvg} alt="cursors"/>
                        </div>
                        <div className="message">
                            <p>Lancez-vous !</p>
                        </div>
                    </div>

                    <div className="text-section">
                        <div className="title">

                            <h1>{title.toUpperCase()}
                            </h1>
                            <div>
                                <span>{titleSpan.toUpperCase()}</span>
                                <div className="circle-lottie">
                                    <Lottie animationData={CircleLottie}/>
                                </div>
                            </div>
                        </div>
                        <div className="paragraph">
                            <p>{paragraph}</p>
                        </div>
                    </div>

                    <div className="btn-lottie">
                        <Lottie animationData={LottieArrow} className='lottie'/>
                        <ButtonComponent text={buttonText} className="lg" path="/dashboard"/>
                    </div>
                </div>
                <div className="jobs-container">
                    {jobs.map((el, index) => {
                        return (
                            <div className="jobs">
                                {el.map((item, secondIndex) => (
                                    <TagComponent text={item} key={index} active={handleActive(secondIndex)}/>
                                ))}
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="get-hired-section">
                <div className="text-section">
                    <div className="title">
                        <h1>{getHiredTitle}<span>{getHiredSpan}</span></h1>
                    </div>
                    <div className="paragraph">
                        <p>{getHiredParagraph}</p>
                    </div>
                </div>
                <div className="get-hired-container">
                    {hiredTips.map((item, index) => (
                        <HiredCardComponent cardData={item} key={index}/>
                    ))}
                </div>
            </div>
        </div>
    )
}