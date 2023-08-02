import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function IngredientCost() {
    const { id } = useParams();
    const [ingredient, setIngredient] = useState('');
    const [dollarInput, setDollarInput] = useState('');
    const [amountInput, setAmountInput] = useState('');
    const [unitInput, setUnitInput] = useState('');
    const [costAmount, setCostAmount] = useState('');
    const [costUnit, setCostUnit] = useState('');

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
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <>
        <h2>Set cost of { ingredient }</h2>
        <form onSubmit={handleSubmit} id="cost-form">
        <input value={dollarInput} onChange={handleDollarInput} placeholder="$" type="number" id="dollars" /> per
        <input value={amountInput} onChange={handleAmountInput} placeholder="amout" type="number" id="amount" />
        <input value={unitInput} onChange={handleUnitInput} placeholder="unit" type="text" id="unit" />
        <button className="btn btn-primary">Save</button>
        </form>
        ${costAmount} per {costUnit}
        </>
    )
};
export default IngredientCost
