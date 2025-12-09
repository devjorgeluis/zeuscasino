const CategoryButton = (props) => {
    let customClass = "item";
    if (props.active == true) {
        customClass += " active";
    }

    return (
        <div className={customClass} onClick={props.onClick}>
            <img src={props.image} />
            <span>{props.name}</span>
        </div>
    );
};

export default CategoryButton;
