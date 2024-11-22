from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from movie.models import Comment


class SetCommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ["comment",]
        widgets = {
            "comment":forms.Textarea(attrs={"class":"input","rows":2,"placeholder":"Ваш комментарий"})
        }
        labels = {
            "comment": "", 
        }

class CustomLoginForm(AuthenticationForm):
    
    
    class Meta:
        model = User
        fields = ["username","password"]

class CustomUserCreationForm(UserCreationForm):
    
    class Meta:
        model = User
        fields = ["email","first_name","password1","password2"]