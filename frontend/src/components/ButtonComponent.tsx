import {ButtonComponentProps} from "../types.ts";
import {useNavigate} from "react-router";


export default function ButtonComponent({ text, className, path }: ButtonComponentProps){
    const navigate = useNavigate()
    return (
        <div className="btn-container">
            <button className={className} onClick={() => navigate(path)}>
                <span>{text}</span>
            </button>
        </div>
    )
}