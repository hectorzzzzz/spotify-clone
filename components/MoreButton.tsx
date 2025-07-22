import { AiOutlineMore } from "react-icons/ai";

const MoreButton = () => {
    return (
        <button
            className="
                transition
                opacity-0
                flex
                items-center
                drop-shadow-md
                group-hover:opacity-100
                group-hover:translate-y-0
            "
        >
            <AiOutlineMore className="text-neutral-300 size-7"/>
        </button>
    );
}

export default MoreButton;