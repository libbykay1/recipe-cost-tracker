import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Recipe from "./Recipe";
import styles from './styles.module.css';

function NewRecipeForm({fetchRecipes}) {
    const inputRef = useRef();
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
            fetchRecipes();
            const newRecipe = await response.json();
            const newRecipeId = newRecipe.id;
            setNewRecipeId(newRecipeId);
            navigate(`/recipes/${newRecipeId}`);
        };
    };
    useEffect(() => {
        inputRef.current.focus();
    }, []);
    return (
        <>

                <div className={styles.form}>
                    <form onSubmit={handleSubmit} id="new-recipe-form">
                        <div>
                            <label htmlFor="recipe_name"></label>
                            <input ref={inputRef} className={styles.input} value={recipe_name} onChange={handleRecipeNameChange} placeholder="Recipe Name" type="text" id="recipe_name" />
                        </div>
                        <button className={styles.button}>Create</button>
                    </form>
                </div>

        {newRecipeId !== null && <Recipe newRecipeId={newRecipeId} />}

        </>
    );
};

export default NewRecipeForm;
