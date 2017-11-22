# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Registration(models.Model):
    user_id = models.IntegerField()
    activation_key = models.CharField(max_length=100)

    def __unicode__(self):
        return '%s' % (self.pk)


class PasswordReset(models.Model):
    user_id = models.IntegerField()
    reset_key = models.CharField(max_length=100)

    def __unicode__(self):
        return '%s' % (self.pk)


class Account(models.Model):
    # This line is required. Links UserProfile to a User model instance.
    user = models.OneToOneField(User)

    name = models.CharField(max_length=100, null=True)
    description = models.TextField(null=True)
    db_name = models.CharField(max_length=200, null=True)
    icon_url = models.CharField(max_length=1000, null=True)
    account_uri = models.CharField(max_length=1000, null=True)

    setup_complete = models.CharField(max_length=100, default='{}')
    credentials = models.TextField(default='{}')
    settings = models.TextField(default='{}')

    def __unicode__(self):
        return self.name

class Profile(models.Model):
    user = models.ForeignKey(User)
    oauth_token = models.CharField(max_length=200)
    oauth_secret = models.CharField(max_length=200)

    def __unicode__(self):
        return unicode(self.user)

class Settings(models.Model):
    component = models.CharField(max_length=128)
    settings_prod = models.TextField()
    settings_uat = models.TextField()
    settings_dev = models.TextField()
    settings_common = models.TextField()
    comment = models.CharField(max_length=1024, null=True, blank=True)

    def __unicode__(self):
        return '%s' % (self.pk)