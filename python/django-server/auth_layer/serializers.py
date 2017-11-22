from rest_framework import serializers
from django.contrib.auth.models import User
import json

from auth_layer.models import (
    Registration,
    PasswordReset,
    Account,
    Profile,
    Settings
)

class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration


class PasswordResetSerializer(serializers.ModelSerializer):
    class Meta:
        model = PasswordReset


class AccountSerializer(serializers.ModelSerializer):
    setup_complete = serializers.SerializerMethodField()
    credentials = serializers.SerializerMethodField()
    settings = serializers.SerializerMethodField()

    class Meta:
        model = Account
        fields = ['id', 'name', 'db_name', 'icon_url', 'account_uri',
            'setup_complete', 'credentials', 'settings']

    def get_credentials(self, obj):
        return json.loads(obj.credentials)

    def get_settings(self, obj):
        return json.loads(obj.settings)


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile


class LoginDetailsSerializer(serializers.ModelSerializer):
    userName = serializers.SerializerMethodField()
    firstName  = serializers.SerializerMethodField()
    lastName = serializers.SerializerMethodField()
    accountId = serializers.SerializerMethodField()
    isEmailEnabled = serializers.SerializerMethodField()
    dbName = serializers.SerializerMethodField()
    setupComplete = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('userName', 'firstName', 'lastName', 'accountId',
            'isEmailEnabled', 'dbName', 'setupComplete')
            

    def get_userName(self, obj):
        return str(obj.email)

    def get_firstName(self, obj):
        return str(obj.first_name)

    def get_lastName(self, obj):
        return str(obj.last_name)
    
    def get_accountId(self, obj):
        return int(obj.account.id)

    def get_isEmailEnabled(self, obj):
        credentials = json.loads(obj.account.credentials)
        if 'email' in credentials:
            return True
        return False
    
    def get_dbName(self, obj):
        return str(obj.account.db_name)

    def get_setupComplete(self, obj):
        return json.loads(obj.account.setup_complete)


class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
