from django.urls import path
from .views import api_ingredient, api_ingredients, api_recipe, api_recipes


urlpatterns = [
    path("", api_recipes, name="api_recipes"),
    path("<int:id>/", api_recipe, name="api_recipe"),
    path("<int:recipe_id>/ingredients/", api_ingredients, name="api_ingredients"),
    path("ingredients/<int:id>/", api_ingredient, name="api_ingredient"),
    path("ingredients/", api_ingredients, name="all_ingredients"),
]
