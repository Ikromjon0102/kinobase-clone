from django.db.models import Avg,Max,Min

from .models import Category,Genre,Movie



def get_movie_countries():
    countr_list = []
    for movie in Movie.objects.all():
        for country in movie.country:
            countr_list.append({"name":country.name,"code":country.code})
    # return set([{"name":i.name,"code":i.code} for x in Movie.objects.all() for i in x.country])
    return countr_list

def get_movie_year():
    years = []
    for movie in Movie.objects.all():
        years.append(movie.year)
    # return [movie.year for movie in Movie.objects.all()]
    return set(years)



def get_context(request):
    max_val = Movie.objects.last().ratings.aggregate(Max("value"))['value__max']
    min_val = Movie.objects.last().ratings.aggregate(Min("value"))['value__min']
    avg_val = Movie.objects.last().ratings.aggregate(Avg("value"))['value__avg']
    print(max_val)
    print(min_val)
    print(avg_val)
    
    
    
    if "category" in request.path:
        context = {
            "genres":Genre.objects.all(),
            "movie_countries":get_movie_countries(),
            "movie_years":get_movie_year(),
            "qualities":["BDRip","HDRip","TS"]
            }
        return context
    else:
        return {}