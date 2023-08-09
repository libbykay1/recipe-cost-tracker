import { useParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

function Recipe() {
    const { id } = useParams();
    const amountInputRef = useRef();
    const [recipe, setRecipe] = useState('');
    const [ingredient, setIngredient] = useState('');
    const [amount, setAmount] = useState('');
    const [unit, setUnit] = useState('');
    const [newIngredient, setNewIngredient] = useState({});
    const [ingredients, setIngredients] = useState([]);
    const [yield_amount, setYieldAmount] = useState('');
    const [yield_unit, setYieldUnit] = useState('');
    const [yield_amount_input, setYieldAmountInput] = useState('');
    const [yield_unit_input, setYieldUnitInput] = useState('');
    const handleIngredientChange = event => {
        setIngredient(event.target.value);
    };
    const handleAmountChange = event => {
        setAmount(event.target.value);
    };
    const handleUnitChange = event => {
        setUnit(event.target.value)
    };

    const handleSubmit = async event => {
        event.preventDefault();
        const data = {}
        data.name = ingredient;
        data.amount = amount;
        data.unit = unit;
        data.recipe = Number(id);

        const url = `http://localhost:8000/api/recipes/${id}/ingredients/`;
        const fetchConfig = {
            method: "post",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const response = await fetch(url, fetchConfig);
        if (response.ok) {
            const newIngredientData = await response.json();
            fetchData();
            setIngredient('');
            setAmount('');
            setUnit('');
            setNewIngredient(newIngredientData);
            amountInputRef.current.focus();

        };

    };
    const handleYieldAmountChange = event => {
        setYieldAmountInput(event.target.value);
    };
    const handleYieldUnitChange = event => {
        setYieldUnitInput(event.target.value);
    };

    const handleYieldSubmit = async event => {
        event.preventDefault();
        const yieldData = {};
        yieldData.yield_amount = yield_amount_input;
        yieldData.yield_unit = yield_unit_input;

        const url = `http://localhost:8000/api/recipes/${id}/`;
        const fetchConfig = {
            method: "put",
            body: JSON.stringify(yieldData),
            headers: {
                'Content-Type': 'application.json',
            },
        };
        const response = await fetch(url, fetchConfig);
        if (response.ok) {
            setYieldAmount(yield_amount_input);
            setYieldUnit(yield_unit_input);
        }

    };

    const handleDelete = (ingredientId) => {
        const url = `http://localhost:8000/api/recipes/ingredients/${ingredientId}`;
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application.json',
            },
        })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            }
        })

    }
    const fetchData = async () => {
        const recipeUrl = `http://localhost:8000/api/recipes/${id}`;
        const response = await fetch(recipeUrl);
        if (response.ok) {
            const data = await response.json();
            setRecipe(data.name);
            setYieldAmount(data.yield_amount);
            setYieldUnit(data.yield_unit);
        };
        const ingredientsUrl = `http://localhost:8000/api/recipes/${id}/ingredients/`;
        const ingredientsResponse = await fetch(ingredientsUrl);
        if (ingredientsResponse.ok) {
            const ingredientsData = await ingredientsResponse.json();
            setIngredients(ingredientsData.ingredients)
        }
    };
    useEffect(() => {
        fetchData();
        amountInputRef.current.focus();
    }, []);

    const viewUrl = `http://localhost:3000/recipes/${id}/view/`

    return (
        <>
        <div className={styles.container}>
            <div className={styles.listheading}>

        <p>
        <h1 className={styles.heading}>{recipe}</h1>

        </p>
        <p>
            Yield: {yield_amount} {yield_unit}
        </p>
        </div>
        <table className={styles.table}>
            <tbody>
                {ingredients.map(ingredient => {
                    const ingredientUrl = `http://localhost:3000/ingredients/${ingredient.id}`;
                    return (
                        <tr key={ingredient.id}>
                            <td className={styles.amounttd}>{ingredient.amount}</td>
                            <td className={styles.unittd}>{ingredient.unit}</td>
                            <td className={styles.nametd}>{ingredient.name}</td>
                            <td className={styles.buttontd}>
                                <button className={styles.smallbutton} onClick={() => handleDelete(ingredient.id)}>Delete ingredient</button>
                            </td>
                            <td>
                                <a className={styles.smalllinks} href={ ingredientUrl }>Set cost</a>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        <h2 className={styles.heading}>Add an ingredient:</h2>

                    <form className={styles.ingredientform} onSubmit={handleSubmit} id="new-ingredient-form">
                        <div>
                            <label htmlFor="amount"></label>
                            <input className={styles.smallinput} ref={amountInputRef} value={amount} onChange={handleAmountChange} placeholder="amount" type="text" id="amount" />
                            <label htmlFor="unit"></label>
                            <input className={styles.smallinput} value={unit} onChange={handleUnitChange} placeholder="unit" type="text" id="unit" />
                            <label htmlFor="ingredient"></label>
                            <input className={styles.smallinput} value={ingredient} onChange={handleIngredientChange} placeholder="ingredient" type="text" id="ingredient" />

                        <button className={styles.smallbutton}>Add</button>
                        </div>
                    </form>

        <form className={styles.ingredientform} onSubmit={handleYieldSubmit} id="yield-form">
       <h2 className={styles.heading}>Yield:</h2>
        <input className={styles.smallinput} value={yield_amount_input} onChange={handleYieldAmountChange} placeholder="amount" id="yield_amount" type="number" />
        <input className={styles.smallinput} value={yield_unit_input} onChange={handleYieldUnitChange} placeholder="unit" id="yield_unit" type="text" />
        <button className={styles.smallbutton}>Save</button>
        </form>
        <a className={styles.biglinks} href={viewUrl}>Make calculations</a>

        </div>
        </>
    );
};

export default Recipe;
