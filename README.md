"# pathFindingAlgorithms" 

if you want to use this application follow this instructions:
download this folder,
create virtual environment inside it and activate,
inside terminal run "pip install -r requirements.txt", this will install all the files required for this application.

for signup and log in you need to have a database, I use postgresql. If you want to use postgresql as well, you need to set up the postgresql database and user for that database and change the "NAME", "USER", and "PASSWORD" fields inside settings.py file accordingly, which is located inside the /app directory.

after that you need to create superuser, which is admin, and run migrations. for that, simply run this command in the terminal:
python manage.py createsuperuser

after latter mentioned command, you will be required to set username, email and password for that superuser

to run migrations run this commands:
python manage.py makemigrations
python manage.py migrate

after that to run the application, simply write this command in the terminal:
python manage.py runserver

and there will be the server link provided inside the terminal, which will be most probably like this:
"http://127.0.0.1:8000/"

or something like that. copy that link and paste it in your browser and you are ready to go.
