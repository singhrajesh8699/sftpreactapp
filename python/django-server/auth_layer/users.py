from django.conf import settings
from auth_layer.serializers import RegistrationSerializer
import hashlib
import random
from datetime import datetime
from django.utils import six
import json

from auth_layer.models import Account
from auth_layer.helper import send_mail, get_random_hex

def UserModel():
    try:
        from django.contrib.auth import get_user_model
        return get_user_model()
    except ImportError:
        from django.contrib.auth.models import User
        return User

def UserModelString():
    try:
        return settings.AUTH_USER_MODEL
    except AttributeError:
        return 'auth.User'

def UsernameField():
    return getattr(UserModel(), 'USERNAME_FIELD', 'username')

def get_username_from_email(email):
    return hashlib.sha256(email).hexdigest()[:30]

def create_inactive_user(username, email, password, fname, lname, is_parse_user):
    username = get_username_from_email(email)
    new_user = UserModel().objects.create_user(username, email, password)
    new_user.is_active = False
    new_user.last_login = datetime.now()
    new_user.first_name = fname
    new_user.last_name = lname
    if is_parse_user:
        new_user.is_staff = True
    new_user.save()
    return new_user

def create_registration(user, activation_key):
    registration = {'user_id': user.id, 'activation_key': activation_key}
    serializer = RegistrationSerializer(data=registration)
    if serializer.is_valid():
        serializer.save()

def create_profile(user):
    salt = hashlib.sha1(
        six.text_type(random.random()).encode('ascii')).hexdigest()[:5]
    salt = salt.encode('ascii')
    username = user.username.encode('utf-8')
    activation_key = hashlib.sha1(salt + username).hexdigest()
    create_registration(user=user, activation_key=activation_key)
    url = 'https://app.qgraph.io/user/activate/' + activation_key
    subject = '[QGraph] Activate your account'
    send_mail({'url': url, 'app_id': ''}, [user.email], subject,
              'email_templates/activation_email_template.html')

def create_account_for_user(user):
    dropdown_fields = {'events': {'first_visited': ['None']},
                       'profile_fields': ['gcmId']}
    account = Account(user_id=user.id,
                      name='',
                      app_name='',
                      app_id=str(get_random_hex()),
                      icon_url='',
                      gcm_key='',
                      default_redirect_uri='',
                      dropdown_fields=json.dumps(dropdown_fields),
                      playstore_url='{}',
                      freq_cap=json.dumps({'push': 86400, 'sms': -1, 'email': -1}),
                      credentials=json.dumps({}))
    account.save()
