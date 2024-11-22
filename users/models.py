from django.db import models
from django.contrib.auth.models import User
# from movie.models import Movie
from movie.models import Movie
# Create your models here.


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    image = models.ImageField(upload_to="users/", default="image/avatar.svg")
    favorites = models.ManyToManyField("movie.Movie", related_name="favourites")
    history = models.ManyToManyField("movie.Movie")
    
    
    def __str__(self):
        return self.user.username

class Rating(models.Model):
    value = models.PositiveSmallIntegerField(default=0)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="ratings")
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name="user_ratings")
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.value}"