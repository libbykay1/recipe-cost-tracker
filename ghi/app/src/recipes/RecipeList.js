import styles from './styles.module.css'

function RecipeList({recipes}) {
    return (
        <>
        <h1 className={styles.bigblue}>Recipes</h1>
        <ul>
            {recipes.map(recipe => {
                const recipeUrl = `http://localhost:3000/recipes/${recipe.id}/view`
                return (
                    <li key={recipe.id}>
                        <a href={recipeUrl}>{recipe.name}</a>
                        </li>
                )
            })}
        </ul>
        </>
    );
};
export default RecipeList
