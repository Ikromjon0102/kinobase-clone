from django.contrib import admin
from .models import *
# Register your models here.


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ("id","name")
    prepopulated_fields = {"slug":("name",)}
    
    
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id","name")
    prepopulated_fields = {"slug":("name",)}
    
    
@admin.register(Genre)
class GanreAdmin(admin.ModelAdmin):
    list_display = ("id","name")
    prepopulated_fields = {"slug":("name",)}
    
    
    
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("author","comment")



admin.site.register(Role)
# admin.site.register(MovieRating)

class MovieRoleStackedInline(admin.StackedInline):
    model = Role
    
    
@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ("id","title")
    prepopulated_fields = {"slug":("title",)}
    search_fields = ('country__code', 'country__name')
    inlines = [MovieRoleStackedInline]
    
