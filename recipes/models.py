from django.db import models


class Recipe(models.Model):
    name = models.CharField(max_length=100)
    yield_amount = models.DecimalField(
        decimal_places=2,
        max_digits=10,
        null=True
    )
    yield_unit = models.CharField(max_length=50, null=True)

    def __str__(self):
        return self.name


class Ingredient(models.Model):
    name = models.CharField(max_length=100)
    unit = models.CharField(max_length=50)
    amount = models.DecimalField(
        decimal_places=2,
        max_digits=10,
    )
    cost_amount = models.DecimalField(
        decimal_places=2,
        max_digits=10,
        null=True
    )
    cost_unit = models.CharField(max_length=50, null=True)
    recipe = models.ForeignKey(
        Recipe,
        related_name="ingredients",
        on_delete=models.CASCADE,
        null=True,
    )

    def __str__(self):
        return self.name

    def default(self, o):
        try:
            return super().default(o)
        except TypeError:
            return decimal_to_str(o)
