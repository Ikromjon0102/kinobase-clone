from django.urls import path
from . import views

app_name = "movie"


urlpatterns = [
    path("",views.MovieListView.as_view(), name="movie_list"),
    path("film/<slug>", views.MovieDetailView.as_view(), name="movie_detail"),
    path("category/<slug>", views.MovieCategoryListView.as_view(), name="movie_category_list"),
    
    path("comment/delete/<int:comment_id>", views.comment_delete, name="comment_delete"),
    
    # FILTER AND SORTING 
    path("filter/<filter_by_what>/<filter_by>", views.MovieFilterView.as_view(), name="movie_filter"),
    path("sort/<str:sort_by>", views.MovieSortView.as_view(), name="movie_sort"),
    
    # SEARCH 
    path("search/", views.search, name="search")
]
