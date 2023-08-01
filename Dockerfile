FROM python:3
WORKDIR /app
COPY recipes recipes
COPY common common
COPY recipe_cost_tracker recipe_cost_tracker
COPY requirements.txt requirements.txt
COPY manage.py manage.py
RUN pip install -r requirements.txt
CMD gunicorn --bind 0.0.0.0:8000 recipe_cost_tracker.wsgi
