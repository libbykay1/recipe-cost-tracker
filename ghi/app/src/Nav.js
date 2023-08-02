import { NavLink } from "react-router-dom";

function Nav() {
    return (
        <>
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
