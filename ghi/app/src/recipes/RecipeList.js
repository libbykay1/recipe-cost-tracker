import styles from './styles.module.css'

function RecipeList({recipes}) {
    return (
        <>
        <ul className={styles.recipelist}>
            {recipes.map(recipe => {
                const recipeUrl = `http://localhost:3000/recipes/${recipe.id}/view`
                return (
                    <li className={styles.listitem} key={recipe.id}>
                        <a className={styles.links} href={recipeUrl}>{recipe.name}</a>
                        </li>
                )
            })}
        </ul>
        </>
    );
};
export default RecipeList
