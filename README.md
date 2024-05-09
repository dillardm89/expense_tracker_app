# expense_tracker_app
Expense Tracker app using React + Typescript + Django

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjYxMDF2b2MzMno2eG9iMTc2dGNhcWdzd256MG8xb2ZvcW11bGhkeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/NsTc9xaUrDDW6jA8Kj/giphy.gif)

### Project Specifications:

- Create apps for tracking monthly expenses
- Build frontend with React and Typescript
- Build backend with Django REST framework
- Utilize SQL for database

### Features:

- Bar graph displaying monthly categories and spend vs budget progress
- Category detail spend showing monthly transaction list and pie graph of progress
- Settings for managing user-specific categories and monthly budgets
- Activity history showing all transactions
- Manually add single transcations or bulk import with .csv file
- Bulk export transactions to .csv file

## Installation

### Backend Env Variables

- SECRET_KEY = 'your_django_secret_key'
- SITE_URL = 'your_api_url' (ex: http://localhost:5173)

### Backend - Run in Development

```bash
# Create virtual environment then runs on 'localhost:8000'
# You will need to use postman or similar to manually
# create a user through the user api then store the id
# in env file for frontend
cd backend
python -m venv venv
venv/Scripts/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Env Variables

- VITE_APP_API_URL = 'your_api_url' (ex: http://localhost:8000)
- VITE_APP_API_USERID = 'you_user_id' (User id after creating in db)

### Frontend - Run in Development

```bash
# Install node modules from package.json then runs on 'localhost:5174'
cd frontend
npm install
npm run dev
```
