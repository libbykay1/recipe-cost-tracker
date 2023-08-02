import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


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
            setAmounts(initialAmounts);
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
        <h1>{recipe}</h1>
        <p><a href={editUrl}>Edit recipe</a></p>

        Multiply by: <input onChange={handleBatchSizeChange} value={batch_size} type="number" id="batch_size" />
        <button onClick={multiply} className="btn btn-primary">Calculate</button>
        <table className="table table-striped">
            <tbody>
                {ingredients.map(ingredient => {
                    return (
                        <tr key={ingredient.id}>
                            <td>
                                <input onChange={(event) => handleAmountChange(event, ingredient.id)} value={amounts[ingredient.id] || ''} type="number" id={`amount_${ingredient.id}`} />
                            </td>
                            <td>{ingredient.unit}</td>
                            <td>{ingredient.name}</td>
                            <td>${ingredient.cost_amount * ingredient.amount}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        <p>Total cost: ${totalCost.toFixed(2)}</p>
        <form onSubmit={handleYieldSubmit} id="yield-form">
        Yield: <input onChange={handleYieldChange} value={new_yield} type="number" id="new_yield" />
        {yield_unit}
        <button className="btn btn-primary">Calculate</button>
        </form>
        <p>
            <button onClick={reset}>Reset recipe</button>
        </p>
        <p>
            <button onClick={() => handleDelete(id)}>Delete recipe</button>
        </p>
    </>
);
};

export default RecipeView;
