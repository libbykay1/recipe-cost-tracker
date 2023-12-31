# Generated by Django 4.2.3 on 2023-08-01 16:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0004_alter_ingredient_amount'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='recipe',
            name='cost',
        ),
        migrations.RemoveField(
            model_name='recipe',
            name='employee',
        ),
        migrations.RemoveField(
            model_name='recipe',
            name='weekday',
        ),
        migrations.AddField(
            model_name='ingredient',
            name='cost_amount',
            field=models.PositiveBigIntegerField(null=True),
        ),
        migrations.AddField(
            model_name='ingredient',
            name='cost_unit',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='recipe',
            name='yield_amount',
            field=models.PositiveSmallIntegerField(null=True),
        ),
        migrations.AddField(
            model_name='recipe',
            name='yield_unit',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
