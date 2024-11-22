from django.urls import path ,reverse_lazy
from django.contrib.auth.views import *
from . import views


app_name = "users"

urlpatterns = [
    path("login/", views.CustomLoginView.as_view(), name="login"),
    path("logout/", views.custom_logout, name="logout"),
    path("register/", views.CustomRegisterView.as_view(), name="register"),
    
    path('password-reset/',PasswordResetView.as_view(
        template_name='auth/password_reset.html',
        html_email_template_name='auth/password_reset_email.html',
        email_template_name='auth/password_reset_email.html',
        success_url=reverse_lazy('users:password_reset_done')),
         name='password_reset' ),
    
    path('password-reset-done/', PasswordResetDoneView.as_view(
        template_name='auth/password_reset_done.html',
         ),name='password_reset_done'),
    
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(
        template_name='auth/password_reset_confirm.html',
        success_url=reverse_lazy('users:password_reset_complete')),
         name='password_reset_confirm'),
    
      path('password-reset-complete/', PasswordResetCompleteView.as_view(
        template_name='auth/password_reset_complete.html',
        
         ),name='password_reset_complete'),
      
    
    
    # PROFILE 
    path("profile/", views.CustomUserProfileView.as_view(), name="profile"),
    
    path("profile/history/", views.ProfileHistoryView.as_view(), name="history"),
    path("profile/history/clear", views.ProfileClearHistoryView.as_view(), name="clear_history"),
    path("profile/favorites/clear", views.ProfileClearFavoritesView.as_view(), name="clear_favorites"),
    
    path("profile/favorites/", views.ProfileFavoritesView.as_view(), name="favorites"),
    path("profile/favorites/add/<int:movie_id>", views.AddToFavoritesView.as_view(), name="add_to_favorites"),
    
    
    path("profile/rating/add/<int:movie_id>/<int:rating_value>", views.AddRatingView.as_view(), name="add_rating"),
    path("profile/rating/delete/<int:rating_id>", views.DeleteRatingView.as_view(), name="delete_rating"),
    
    path("profile/rating-list", views.ProfileRatingListView.as_view(), name="rating_list"),
    path("profile/comment-list", views.CommentListView.as_view(), name="comment_list"),
    path("profile/comment/delete/<int:comment_id>", views.DeleteCommentView.as_view(), name="delete_comment"),
    
]
