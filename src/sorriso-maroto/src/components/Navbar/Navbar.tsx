import { v4 as uuidv4 } from "uuid";
import { useLocation } from "react-router-dom";

import INavbar from "./INavbar";
import INavbarItem from "./NavbarItem/INavbarItem";
import NavbarItem from "./NavbarItem/NavbarItem";

// import { Si1001Tracklists } from "react-icons/si";
import logoSambaTech from '../../assets/logoSambaTech.jpg'
import { FaGear } from "react-icons/fa6";

export default function Navbar(props: INavbar) {
  const location = useLocation();

  const NavbarItens: INavbarItem[] = props.itens
    ? props.itens
    : [
      {
        link: "/home",
        icon: <img src={logoSambaTech} alt="Home" className="h-10 w-30 border-none"  />, 
        alternativeIcon: (
          <img src={logoSambaTech} alt="Home" className="h-30 w-30 xs:h-10 w-10 border-none border-0"  />
        ),
      },
      {
        link: "/competences",
        icon: <FaGear className="h-8 w-8 border-none" />,
        alternativeIcon: <FaGear className="h-8 w-8   border-none" color="white" />,
      },
      ];

  for (let i = 1; i < NavbarItens.length; i++) {
    if (location.pathname.includes(NavbarItens[i].link)) {
      NavbarItens[i].active = true;
    }
  }

  if (!NavbarItens.find((item) => item.active)) {
    NavbarItens[0].active = true;
  }

  return (
    <nav className="flex lg:flex-col flex-row lg:h-screen lg:w-1/8 w-screen h-1/8 lg:max-w-20 lg:max-h-full max-h-40 max-w-full bg-yellow-300 items-center">
      <ul className="justify-between lg:h-full lg:w-auto h-auto w-full flex lg:flex-col flex-row">
        {NavbarItens.map((item) => (
          <NavbarItem {...item} key={uuidv4()} />
        ))}
      </ul>
    </nav>
  );
}
