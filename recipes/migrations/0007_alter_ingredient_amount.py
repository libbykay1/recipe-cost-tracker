# Generated by Django 4.2.3 on 2023-08-02 21:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0006_alter_ingredient_amount_alter_ingredient_cost_amount_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ingredient',
            name='amount',
            field=models.DecimalField(decimal_places=3, max_digits=10),
        ),
    ]