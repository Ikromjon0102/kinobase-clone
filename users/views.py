from django.shortcuts import render,redirect,get_object_or_404
from django.urls import reverse
from django.http import HttpResponseRedirect
from django.views.generic import ListView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.models import User
from django.contrib import messages

from django.views.generic import View

from movie.models import Movie,Comment
from .models import Profile,Rating
from .forms import CustomLoginForm
# Create your views here.



class CustomLoginView(LoginView):
    form_class = CustomLoginForm
    template_name = "auth/login.html"

def custom_logout(request):
    logout(request)
    messages.success(request,"You logged out!")
    return HttpResponseRedirect("/")
    
class CustomRegisterView(View):
    
    def get(self,request):
        return render(request,"auth/registration.html")
    
    
    def post(self,request):
        username = request.POST.get("email").split("@")[0].lower()
        email = request.POST.get("email")
        name = request.POST.get("name")
        password = request.POST.get("password")
        password_confirmation = request.POST.get("password_confirmation")
    
        if password == password_confirmation:
            u = User.objects.create(
                username=username,
                first_name=name,
                email=email ,
                password=password)
            Profile.objects.create(user=u)
            # xozir hosil bolgan user object ni topish uchun 
            authenticate(request,username=u.username, password=u.password)
            # tizimga kirgizish uchun
            login(request,u)
            messages.success(request,"OK")
            return redirect("/")
        else:
            messages.error(request,"Wrong password")
            return render(request,"auth/registration.html")
            
            
            
class CustomUserProfileView(LoginRequiredMixin,View):
    
    def get(self,request):
        
        return render(request,"auth/profile.html")
    
    def post(self,request):
        image = request.FILES.get("avatar_file")
        print(image)
        email = request.POST.get("email")
        name = request.POST.get("name")
        password = request.POST.get("password")
        password_confirmation = request.POST.get("password_confirmation")
        
        user = request.user
        if image:
            user.profile.image = image
            user.profile.save()
            messages.success(request,"Profile image set")
        if email:
            user.email = email
            user.save()
            messages.success(request,"User email set")
        if name:
            user.first_name = name
            user.save()
            messages.success(request,"User firstname set")
            
        if password and password_confirmation:
            if password == password_confirmation:
                user.set_password(password)
                user.save()
                messages.success(request,"Password changed")
        else:
            pass
        return render(request,"auth/profile.html")


class ProfileHistoryView(LoginRequiredMixin,View):
    
    def get(self,request):
        context = {}
        context["object_list"] = self.request.user.profile.history.all()
        return render(request,"history.html", context=context)
    
        
class ProfileClearHistoryView(LoginRequiredMixin,View):
    
    def get(self,request):
        request.user.profile.history.clear()
        messages.success(request,"Profile history list clear !")
        return HttpResponseRedirect("/users/profile/history/")
    
    
class ProfileFavoritesView(LoginRequiredMixin,View):
    
    def get(self,request):
        context = {
            "object_list":self.request.user.profile.favorites.all()
        }
        return render(request,"favorites.html", context=context)
    
class AddToFavoritesView(LoginRequiredMixin,View):
    
    def get(self,request,movie_id):
        movie = get_object_or_404(Movie, id=movie_id)
        profile = request.user.profile
        
        if profile.favorites.filter(id=movie_id).exists():
            profile.favorites.remove(movie)
            messages.info(request,"Movie deleted")
            return HttpResponseRedirect(f"/film/{movie.slug}")
        else:
            profile.favorites.add(movie)
            messages.info(request,"Movie added")
            return HttpResponseRedirect(f"/film/{movie.slug}")
        

class ProfileClearFavoritesView(LoginRequiredMixin,View):
    
    def get(self,request):
        request.user.profile.favorites.clear()
        messages.success(request,"Profile favorite list clear !")
        return HttpResponseRedirect("/users/profile/favorites/")
    

class ProfileRatingListView(ListView):
    model = Movie
    template_name = "ratings.html"
    
    
    def get_queryset(self):
        qs = Rating.objects.filter(user=self.request.user)
        return qs
    
class CommentListView(ListView):
    model = Comment
    template_name = "comments.html"
    
    
    def get_queryset(self):
        qs = Comment.objects.filter(author__icontains=self.request.user.first_name)
        return qs
    

class AddRatingView(LoginRequiredMixin,View):
    
    def get(self,request, movie_id,rating_value):
        movie = Movie.objects.get(id=movie_id)
        Rating.objects.create(
            value=rating_value,
            movie=movie,
            user=request.user)
        messages.success(request,"Rating added")
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

   
class DeleteRatingView(View):
    
    def get(self,request, rating_id):
        r = Rating.objects.get(id=rating_id)
        r.delete()
        messages.success(request,"Rating deletet !")
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
    
    
class DeleteCommentView(View):
    
    def get(self,request, comment_id):
        c = Comment.objects.get(id=comment_id)
        c.delete()
        messages.success(request,"Comment deletet !")
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))