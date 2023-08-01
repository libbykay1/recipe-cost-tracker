import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


function RecipeView() {
    const { id } = useParams();
    const [isAmountUpdated, setIsAmountUpdated] = useState(false);
    const [recipe, setRecipe] = useState('');
    const [amounts, setAmounts] = useState({});
    const [ingredients, setIngredients] = useState([]);
    const [originalIngredients, setOriginalIngredients] = useState([]);
    const [yield_amount, setYieldAmount] = useState('');
    const [yield_unit, setYieldUnit] = useState('');
    const [batch_size, setBatchSize] = useState('1');

    const fetchData = async () => {
        const recipeUrl = `http://localhost:8000/api/recipes/${id}`;
        const response = await fetch(recipeUrl);
        if (response.ok) {
            const data = await response.json();
            setRecipe(data.name);
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
    const handleYieldAmountChange = event => {
        setYieldAmount(event.target.value);
    };
    const handleYieldUnitChange = event => {
        setYieldUnit(event.target.value);
    };
const multiply = event => {
    event.preventDefault();
    const multiplier = parseFloat(batch_size);
    const updatedAmounts = ingredients.reduce((newAmounts, ingredient) => {
        const originalAmount = parseFloat(ingredient.amount);
        newAmounts[ingredient.id] = originalAmount * multiplier;
        return newAmounts;
        }, {});
    setAmounts(updatedAmounts);
    const updatedYieldAmount = parseFloat(yield_amount) * multiplier;
    setYieldAmount(updatedYieldAmount);
};



return (
    <>
        <h1>{recipe}</h1>
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
                        </tr>
                    )
                })}
            </tbody>
        </table>
        <p>Yield:
        <input value={yield_amount} onChange={handleYieldAmountChange} placeholder="amount" id="yield_amount" type="number" />
        <input value={yield_unit} onChange={handleYieldUnitChange} placeholder="unit" id="yield_unit" type="text" />
        </p>
    </>
);
};

export default RecipeView;
