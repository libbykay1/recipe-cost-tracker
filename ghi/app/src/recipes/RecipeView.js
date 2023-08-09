import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from './styles.module.css';

function RecipeView() {
    const { id } = useParams();
    const [yield_amount, setYieldAmount] = useState('');
    const [yield_unit, setYieldUnit] = useState('');
    const [new_yield, setNewYield] = useState('');
    const [recipe, setRecipe] = useState('');
    const [amounts, setAmounts] = useState({});
    const [ingredients, setIngredients] = useState([]);
    const [originalIngredients, setOriginalIngredients] = useState([]);
    const [batch_size, setBatchSize] = useState('1');
    const [costs, setCosts] = useState({});

    const editUrl = `http://localhost:3000/recipes/${id}/`

    const fetchData = async () => {
        const recipeUrl = `http://localhost:8000/api/recipes/${id}`;
        const response = await fetch(recipeUrl);
        if (response.ok) {
            const data = await response.json();
            setRecipe(data.name);
            setYieldAmount(data.yield_amount);
            setNewYield(data.yield_amount);
            setYieldUnit(data.yield_unit);
        };
        const ingredientsUrl = `http://localhost:8000/api/recipes/${id}/ingredients/`;
        const ingredientsResponse = await fetch(ingredientsUrl);
        if (ingredientsResponse.ok) {
            const ingredientsData = await ingredientsResponse.json();
            setIngredients(ingredientsData.ingredients);
            setOriginalIngredients(ingredientsData.ingredients);
            const initialAmounts = {};
            ingredientsData.ingredients.forEach(ingredient => {
                initialAmounts[ingredient.id] = ingredient.amount;
            });
            const initialCosts = {};
            ingredientsData.ingredients.forEach(ingredient => {
                initialCosts[ingredient.id] = ingredient.cost_amount;
            });
            setAmounts(initialAmounts);
            setCosts(initialCosts);
        };
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleBatchSizeChange = event => {
        setBatchSize(event.target.value);
    };
    const handleYieldChange = event => {
        setNewYield(event.target.value);
    }
    const handleAmountChange = (event, ingredientId) => {
        const newAmount = parseFloat(event.target.value);
        setAmounts(prevAmounts => ({
            ...prevAmounts,
            [ingredientId]: newAmount,
        }));
        if(isNaN(newAmount)) {
            return;
        }
        const originalAmount = parseFloat(originalIngredients.find(item => item.id === ingredientId).amount);
        const multiplier = newAmount / originalAmount;
        setBatchSize(multiplier);
    };

    const handleYieldSubmit = async event => {
        event.preventDefault();
        const multiplier = parseFloat(new_yield) / parseFloat(yield_amount);
        const updatedAmounts = ingredients.reduce((newAmounts, ingredient) => {
            const originalAmount = parseFloat(ingredient.amount);
            newAmounts[ingredient.id] = originalAmount * multiplier;
            return newAmounts;
        }, {});
        setAmounts(updatedAmounts);
        setBatchSize(batch_size * multiplier);
        const updatedCosts = ingredients.reduce((newCosts, ingredient) => {
            const originalCost = parseFloat(ingredient.cost_amount);
            newCosts[ingredient.id] = originalCost * multiplier;
            return newCosts;
            }, {});
        setCosts(updatedCosts);
    }

const multiply = event => {
    event.preventDefault();
    const multiplier = parseFloat(batch_size);
    const updatedAmounts = ingredients.reduce((newAmounts, ingredient) => {
        const originalAmount = parseFloat(ingredient.amount);
        newAmounts[ingredient.id] = originalAmount * multiplier;
        return newAmounts;
        }, {});
    setAmounts(updatedAmounts);
    const updatedCosts = ingredients.reduce((newCosts, ingredient) => {
        const originalCost = parseFloat(ingredient.cost_amount);
        newCosts[ingredient.id] = (originalCost || 0) * multiplier;
        return newCosts;
        }, {});
    setCosts(updatedCosts);
    const updatedYield = parseFloat(yield_amount) * multiplier;
    setNewYield(updatedYield)
};

const reset = event => {
    fetchData();
    setBatchSize('1');
}

const handleDelete = (recipeId) => {
    const url = `http://localhost:8000/api/recipes/${recipeId}`;
    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application.json',
        },
    })
    .then(response => {
        if (response.ok) {
            window.location.href = 'http://localhost:3000/recipes/';
        }
    })

}
const totalCost = ingredients.reduce((total, ingredient) => {
    const ingredientCost = ingredient.cost_amount * (amounts[ingredient.id] || 0);
    return total + ingredientCost;
}, 0);
return (
    <>
    <div className={styles.container}>
        <h1 className={styles.heading}>{recipe}</h1>
        <form className={styles.fontsize}>
        Multiply by: <input className={styles.numberinput} onChange={handleBatchSizeChange} value={batch_size} type="number" id="batch_size" />
        <button className={styles.calculatebutton} onClick={multiply}>Calculate</button>
        </form>
        <table className={styles.table}>
            <tbody>
                {ingredients.map(ingredient => {
                    return (
                        <tr key={ingredient.id}>
                            <td>
                                <input className={styles.numberinput} onChange={(event) => handleAmountChange(event, ingredient.id)} value={amounts[ingredient.id] || ''} type="number" id={`amount_${ingredient.id}`} />
                            </td>
                            <td className={styles.unittd}>{ingredient.unit}</td>
                            <td className={styles.nametd}>{ingredient.name}</td>
                            <td className={styles.costtd}>${(costs[ingredient.id] * ingredient.amount).toFixed(2)}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        <p>Total cost: ${totalCost.toFixed(2)}</p>
        <form className={styles.fontsize} onSubmit={handleYieldSubmit} id="yield-form">
        Yield: <input className={styles.numberinput} onChange={handleYieldChange} value={new_yield} type="number" id="new_yield" />
        {yield_unit}
        <button className={styles.calculatebutton}>Calculate</button>
        </form>
        <p>
            <button className={styles.smallbutton} onClick={reset}>Reset recipe</button>
        </p>
        <p>
            <button className={styles.smallbutton} onClick={() => handleDelete(id)}>Delete recipe</button>
        </p>
        <p><a className={styles.biglinks} href={editUrl}>Edit recipe</a></p>

        </div>
    </>
);
};

export default RecipeView;
