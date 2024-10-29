from django.db import IntegrityError
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

# Create your views here.
@login_required
def index(response):
    return render(response, 'index.html')

def user_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']

        user = authenticate(request, username=username, email=email, password=password)
        if user is not None:
            login(request, user)
            request.session['username'] = username
            return redirect('/')
        else:
            error_message = 'Invalid email or password'
            return render(request, 'login.html', {'error_message': error_message})
    return render(request, 'login.html')

def user_signup(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        repeatPassword = request.POST['repeatPassword']

        if password == repeatPassword:
            try:
                user = User.objects.create_user(username=username, email=email, password=password)
                user.save()
                login(request, user) 
                return redirect('/')  

            except IntegrityError:
                error_message = 'Username already exists. Please choose a different one.'
                return render(request, 'signup.html', {'error_message': error_message})

            except Exception as e:
                error_message = f'Error creating account: {str(e)}'
                return render(request, 'signup.html', {'error_message': error_message})

        else:
            error_message = 'Passwords do not match.'
            return render(request, 'signup.html', {'error_message': error_message})

    return render(request, 'signup.html')

def user_logout(request):
    logout(request)
    request.session.pop('username', None)
    return redirect('/')
