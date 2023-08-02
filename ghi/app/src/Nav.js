import { NavLink } from "react-router-dom";
import styles from './nav.module.css';

function Nav() {
    return (
        <>
        <div className={styles.headerlogo}>
            <img className={styles.logo} src="https://sweetdragonbaking.com/cdn/shop/files/sd_logo_black-xlg_400x200@2x.png?v=1613181341" />
        </div>
        <div>
            <ul>
                <li>
                    <NavLink to="/recipes/">Recipes</NavLink>
                </li>
                <li>
                    <NavLink to="/recipes/new/">New Recipe</NavLink>
                </li>
            </ul>
        </div>
        </>

    )
}
export default Nav;
