import { useParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';

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
    }, []);

    return (
        <>
        <h1>{recipe}</h1>
        <p>
            Yield: {yield_amount} {yield_unit}
        </p>
        <table className="table table-striped">
            <tbody>
                {ingredients.map(ingredient => {
                    return (
                        <tr key={ingredient.id}>
                            <td>{parseFloat(ingredient.amount)}</td>
                            <td>{ingredient.unit}</td>
                            <td>{ingredient.name}</td>
                            <td>
                                <button onClick={() => handleDelete(ingredient.id)}>Delete ingredient</button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        <h2>Add an ingredient</h2>
        <div className="row">
            <div className="offset-3 col-6">
                <div className="shadow p-4 mt-4">
                    <form onSubmit={handleSubmit} id="new-ingredient-form">
                        <div className="form-floating mb-3">
                            <label htmlFor="amount"></label>
                            <input ref={amountInputRef} value={amount} onChange={handleAmountChange} placeholder="amount" type="text" id="amount" />
                            <label htmlFor="unit"></label>
                            <input value={unit} onChange={handleUnitChange} placeholder="unit" type="text" id="unit" />
                            <label htmlFor="ingredient"></label>
                            <input value={ingredient} onChange={handleIngredientChange} placeholder="ingredient" type="text" id="ingredient" />
                        </div>
                        <button className="btn btn-primary">Add</button>
                    </form>
                </div>
            </div>
        </div>
        <form onSubmit={handleYieldSubmit} id="yield-form">
        Yield:
        <input value={yield_amount_input} onChange={handleYieldAmountChange} placeholder="amount" id="yield_amount" type="number" />
        <input value={yield_unit_input} onChange={handleYieldUnitChange} placeholder="unit" id="yield_unit" type="text" />
        <button className="btn btn-primary">Save</button>
        </form>

        </>
    );
};

export default Recipe;
