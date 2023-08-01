import { useParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';

function Recipe() {
    const { id } = useParams();
    const amountInputRef = useRef();
    const [recipe, setRecipe] = useState('');
    const [recipe_id, setRecipeId] = useState('');
    const [ingredient, setIngredient] = useState('');
    const [amount, setAmount] = useState('');
    const [unit, setUnit] = useState('');
    const [newIngredient, setNewIngredient] = useState({});
    const [ingredients, setIngredients] = useState([]);
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
            setIngredients(ingredientsData.ingredients)
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
        <h1>{recipe}</h1>
        <table className="table table-striped">
            <tbody>
                {ingredients.map(ingredient => {
                    return (
                        <tr key={ingredient.id}>
                            <td>{ingredient.amount}</td>
                            <td>{ingredient.unit}</td>
                            <td>{ingredient.name}</td>
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

        </>
    );
};

export default Recipe;
