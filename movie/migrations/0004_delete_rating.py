# Generated by Django 4.2.2 on 2024-06-09 18:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('movie', '0003_rating'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Rating',
        ),
    ]
