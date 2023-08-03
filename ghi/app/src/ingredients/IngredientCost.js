import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from './ingredients.module.css'

function IngredientCost() {
    const { id } = useParams();
    const [ingredient, setIngredient] = useState('');
    const [dollarInput, setDollarInput] = useState('');
    const [amountInput, setAmountInput] = useState('');
    const [unitInput, setUnitInput] = useState('');
    const [costAmount, setCostAmount] = useState('');
    const [costUnit, setCostUnit] = useState('');
    const [recipeId, setRecipeId] = useState('');

    const handleDollarInput = event => {
        setDollarInput(event.target.value);
    };
    const handleAmountInput = event => {
        setAmountInput(event.target.value);
    };
    const handleUnitInput = event => {
        setUnitInput(event.target.value);
    };

    const handleSubmit = async event => {
        event.preventDefault();
        const calculatedAmount = dollarInput / amountInput;
        const data = {};
        data.cost_amount = calculatedAmount;
        data.cost_unit = unitInput;

        const url = `http://localhost:8000/api/recipes/ingredients/${id}/`;
        const fetchConfig = {
            method: "put",
            body: JSON.stringify(data),
            header: {
                'Content-Type': 'application/json',
            },
        };
        const response = await fetch(url, fetchConfig);
        if (response.ok) {
            setCostAmount(calculatedAmount);
            setCostUnit(unitInput);
        }
    };
    const fetchData = async () => {
        const ingredientUrl = `http://localhost:8000/api/recipes/ingredients/${id}`;
        const response = await fetch(ingredientUrl);
        if (response.ok) {
            const data = await response.json();
            setIngredient(data.name);
            setCostAmount(data.cost_amount);
            setCostUnit(data.cost_unit);
            setRecipeId(data.recipe.id);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const recipeUrl = `http://localhost:3000/recipes/${recipeId}`
    return (
        <>
        <div className={styles.container}>
        <h2 className={styles.heading}>Set cost of { ingredient }:</h2>
        <form className={styles.ingredientform} onSubmit={handleSubmit} id="cost-form">
        <input className={styles.numberinput} value={dollarInput} onChange={handleDollarInput} placeholder="$" type="number" id="dollars" /> per
        <input className={styles.input} value={amountInput} onChange={handleAmountInput} placeholder="amount" type="number" id="amount" />
        <input className={styles.unitinput} value={unitInput} onChange={handleUnitInput} placeholder="unit" type="text" id="unit" />
        <button className={styles.calculatebutton}>Save</button>
        </form>
        ${costAmount} per {costUnit}
        <p>
            <a className={styles.biglinks} href={recipeUrl}>Back to recipe</a>
        </p>
        </div>
        </>
    )
};
export default IngredientCost
