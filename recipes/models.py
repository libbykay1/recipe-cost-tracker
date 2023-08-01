from django.db import models


class Recipe(models.Model):
    name = models.CharField(max_length=100)
    employee = models.CharField(max_length=100, blank=True)
    weekday = models.CharField(max_length=50, blank=True)
    cost = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.name


class Ingredient(models.Model):
    name = models.CharField(max_length=100)
    unit = models.CharField(max_length=50)
    amount = models.PositiveSmallIntegerField()
    recipe = models.ForeignKey(
        Recipe,
        related_name="ingredients",
        on_delete=models.CASCADE,
        null=True,
    )

    def __str__(self):
        return self.name
