interface Props {
    active: boolean,
    text: string,
}

export default function TagComponent({active, text}: Props){

    const handleTagClassName = () :string => {
        return active ? 'tag-container' : 'tag-container active-tag'
    }
    return (
        <div className={handleTagClassName()}>
            <p>{text}</p>
        </div>
        )
}