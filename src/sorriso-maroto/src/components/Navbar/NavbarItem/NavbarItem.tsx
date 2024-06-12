import { Link } from 'react-router-dom';

import INavbarItem from "./INavbarItem";

export default function NavbarItem(props: INavbarItem) {
    return(
        <Link to={props.link}>
            <li className="p-4 rounded-lg w-full flex items-center justify-center" data-active={props.active}>
                {props.active ? props.alternativeIcon : (props.icon ? props.icon : null)}
            </li>
        </Link>
    )
}