# Database
# https://docs.djangoproject.com/en/1.9/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'headcount',
        'USER': 'postgres',
        'PASSWORD': 'root',
        'HOST': '',
        'PORT': '5432',
    }
}
