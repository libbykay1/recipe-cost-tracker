import Nav from './Nav';
import Footer from './Footer';
import RecipeView from "./recipes/RecipeView";
import Recipe from "./recipes/Recipe";
import RecipeList from "./recipes/RecipeList";
import IngredientCost from "./ingredients/IngredientCost";
import NewRecipeForm from "./recipes/NewRecipeForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from './index.module.css';


function App() {
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const fetchRecipes = async () => {
    const url = "http://localhost:8000/api/recipes/";
    const response = await fetch(url);
    if (response.ok) {
      const { recipes } = await response.json();
      setRecipes(recipes);
    }
  };

  const fetchIngredients = async () => {
    const url = "http://localhost:8000/api/recipes/ingredients/";
    const response = await fetch(url);
    if (response.ok) {
      const { ingredients } = await response.json();
      setIngredients(ingredients);
    }
  };

  useEffect(() => {
    fetchRecipes();
    fetchIngredients();
  }, []);
  return (
    <BrowserRouter>
    <Nav />
      <div className={styles.content}>
        <Routes>
          <Route path="/ingredients/">
            <Route path=":id" element={<IngredientCost />} />
          </Route>
          <Route path="/recipes/">
            <Route index element={<RecipeList recipes={recipes} />} />
            <Route path="new" element={<NewRecipeForm />} />
            <Route path=":id" element={<Recipe />} />
            <Route path=":id/view" element={<RecipeView />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
};

export default App;
