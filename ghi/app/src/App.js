import RecipeView from "./recipes/RecipeView";
import Recipe from "./recipes/Recipe";
import NewRecipeForm from "./recipes/NewRecipeForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route path="/recipes/">
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
