# Generated by Django 4.2.2 on 2024-06-09 18:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('movie', '0001_initial'),
    ]

    operations = [
        migrations.DeleteModel(
            name='MovieRating',
        ),
    ]
