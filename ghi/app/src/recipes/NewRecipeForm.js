import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Recipe from "./Recipe";

function NewRecipeForm() {
    const [recipe_name, setRecipeName] = useState('');
    const [newRecipeId, setNewRecipeId] = useState(null);
    const navigate = useNavigate();
    const handleRecipeNameChange = event => {
        setRecipeName(event.target.value);
    };

    const handleSubmit = async event => {
        event.preventDefault();
        const data = {}
        data.name = recipe_name;

        const recipeUrl = 'http://localhost:8000/api/recipes/';
        const fetchConfig = {
            method: "post",
            body: JSON.stringify(data),
            header: {
                'Content-Type': 'application/json',
            },
        };
        const response = await fetch(recipeUrl, fetchConfig);
        if (response.ok) {
            const newRecipe = await response.json();
            const newRecipeId = newRecipe.id;
            setNewRecipeId(newRecipeId);
            navigate(`/recipes/${newRecipeId}`);
        };
    };
    return (
        <>
        <div className="row">
            <div className="offset-3 col-6">
                <div className="shadow p-4 mt-4">
                    <h1>Create a new recipe</h1>
                    <form onSubmit={handleSubmit} id="new-recipe-form">
                        <div className="form-floating mb-3">
                            <label htmlFor="recipe_name"></label>
                            <input value={recipe_name} onChange={handleRecipeNameChange} placeholder="Recipe Name" type="text" id="recipe_name" />
                        </div>
                        <button className="btn btn-primary">Create</button>
                    </form>
                </div>
            </div>
        </div>
        {newRecipeId !== null && <Recipe newRecipeId={newRecipeId} />}

        </>
    );
};

export default NewRecipeForm;
