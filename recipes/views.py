from django.shortcuts import render
from .models import Recipe, Ingredient
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import json
from common.json import ModelEncoder
from decimal import Decimal


def decimal_to_str(o):
    if isinstance(o, Decimal):
        return str(o)
    raise TypeError()


class RecipeEncoder(ModelEncoder):
    model = Recipe
    properties = ["name", "yield_amount", "yield_unit", "id"]

    def default(self, o):
        try:
            return super().default(o)
        except TypeError:
            return decimal_to_str(o)


class IngredientEncoder(ModelEncoder):
    model = Ingredient
    properties = ["name", "unit", "amount", "recipe", "id"]

    encoders = {
        "recipe": RecipeEncoder(),
    }

    def default(self, o):
        try:
            return super().default(o)
        except TypeError:
            return decimal_to_str(o)


class AllIngredientEncoder(ModelEncoder):
    model = Ingredient
    properties = ["name", "id"]



@require_http_methods(["GET", "POST"])
def api_recipes(request):
    if request.method == "GET":
        recipes = Recipe.objects.all()
        return JsonResponse(
            {"recipes": recipes},
            encoder=RecipeEncoder,
        )
    else:
        content = json.loads(request.body)
        recipe = Recipe.objects.create(**content)
        return JsonResponse(
            recipe,
            encoder=RecipeEncoder,
            safe=False
        )


@require_http_methods(["GET", "PUT", "DELETE"])
def api_recipe(request, id):
    try:
        recipe = Recipe.objects.get(id=id)
    except Recipe.DoesNotExist:
        return JsonResponse({"error": "no such recipe"}, status=404)
    if request.method == "GET":
        return JsonResponse(
            recipe,
            encoder=RecipeEncoder,
            safe=False
        )
    elif request.method == "PUT":
        content = json.loads(request.body)
        Recipe.objects.filter(id=id).update(**content)
        recipe = Recipe.objects.get(id=id)
        return JsonResponse(
            recipe, encoder=RecipeEncoder, safe=False
        )
    else:
        recipe.delete()
        return JsonResponse({"message": "Recipe deleted."})


@require_http_methods(["GET", "POST"])
def api_ingredients(request, recipe_id=None):
    if request.method == "GET":
        if recipe_id is not None:
            ingredients = Ingredient.objects.filter(recipe=recipe_id)
            return JsonResponse(
                {"ingredients": ingredients},
                encoder=IngredientEncoder,
            )
        else:
            ingredients = Ingredient.objects.all()
            return JsonResponse(
                {"ingredients": ingredients},
                encoder=AllIngredientEncoder,
            )
    else:
        content = json.loads(request.body)
        try:
            recipe = Recipe.objects.get(id=recipe_id)
            content["recipe"] = recipe
        except Recipe.DoesNotExist:
            return JsonResponse(
                {"message": "Invalid recipe id"},
                status=400,
            )
        ingredient = Ingredient.objects.create(**content)
        return JsonResponse(
            ingredient,
            encoder=IngredientEncoder,
            safe=False
        )


@require_http_methods(["GET", "PUT", "DELETE"])
def api_ingredient(request, id):
    try:
        ingredient = Ingredient.objects.get(id=id)
    except Ingredient.DoesNotExist:
        return JsonResponse({"error": "no such ingredient"}, status=404)
    if request.method == "GET":
        return JsonResponse(
            ingredient,
            encoder=IngredientEncoder,
            safe=False
        )
    elif request.method == "PUT":
        content = json.loads(request.body)
        Ingredient.objects.filter(id=id).update(**content)
        ingredient = Ingredient.objects.get(id=id)
        return JsonResponse(
            ingredient, encoder=IngredientEncoder, safe=False
        )
    else:
        ingredient.delete()
        return JsonResponse({"message": "Ingredient deleted."})
