from django.db import models
from django.db.models import Avg, Count, Max, Min
from django_countries.fields import CountryField # type: ignore
from django.contrib.auth.models import User
# Create your models here.


class Category(models.Model):
    name = models.CharField("Name", max_length=150)
    slug = models.SlugField("*", max_length=150)
    
    
    def __str__(self):
        return self.name
    
class Genre(models.Model):
    name = models.CharField("Name", max_length=150)
    slug = models.SlugField("*", max_length=150)
    
    
    def __str__(self):
        return self.name

QUALITIES = (
    ("bdrip","BDRip"),
    ("hdrip","HDRip"),
    ("ts","TS"),
)

class Movie(models.Model):
    cover = models.ImageField(upload_to="movie_posters/", blank=True)
    title = models.CharField("Title", max_length=250)
    slug = models.SlugField("*", max_length=250)
    origin_title = models.CharField("Origin title", max_length=250, blank=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="movies")
    genres = models.ManyToManyField(Genre)
    country = CountryField(multiple=True)
    year = models.PositiveSmallIntegerField(default=0)
    kp_rating = models.FloatField(blank=True)
    imdb_rating = models.FloatField(blank=True)
    quality = models.CharField(max_length=150, choices=QUALITIES)
    drafts = models.BooleanField(default=False)
    duration = models.CharField(max_length=150, blank=True)
    description = models.TextField(blank=True)
    sd_file_url = models.URLField(blank=True)
    hd_file_url = models.URLField(blank=True)
    
    
    def __str__(self):
        return self.title
    
    def get_average_rating(self):
       
        q = [r.value for r in self.ratings.all()]
        summ_of_ratings = sum(q)
        len_of_ratings = len(q)
        if summ_of_ratings > 0:
            rating = round(summ_of_ratings / len_of_ratings,1)
            return rating
        else:
            return 0
    # def get_average_rating(self):
    #     ratings = self.ratings.all()
    #     if ratings.exists():
    #         avg_rating = ratings.aggregate(Avg('value'))['value__avg']
    #         return round(avg_rating, 1)
    #     return 0
    
    def count_ratings(self):
        return len([r.value for r in self.ratings.all()])
    
    
class Author(models.Model):
    name = models.CharField("Name", max_length=150)
    slug = models.SlugField("*", max_length=150)
    
    
    def __str__(self):
        return self.name
    

class Role(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    author = models.ManyToManyField(Author)
    actor = models.BooleanField(default=False)
    director = models.BooleanField(default=False)
    producer = models.BooleanField(default=False)
    
    
    def __str__(self):
        return f"{self.movie.title}"


class Comment(models.Model):
    author = models.CharField(max_length=150, default="Гость")
    comment = models.TextField()
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="comments")
    commented_time = models.DateTimeField(auto_now_add=True)
    
    
    def __str__(self):
        return self.author

