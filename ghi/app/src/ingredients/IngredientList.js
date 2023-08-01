import React, { useState, useEffect } from 'react';

function IngredientList({ingredients}) {

    return (
        <>
        <h1>Ingredients</h1>
        <ul>
            {ingredients.map(ingredient => {
                const ingredientId = ingredient.id;
                return (
                    <li key={ingredientId}>
                        {ingredient.name}, {ingredient.id}</li>
                )
            })}
        </ul>
        </>
    );
};
export default IngredientList;
