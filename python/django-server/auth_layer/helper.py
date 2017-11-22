import os
import binascii
from django.conf import settings
import boto3
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from django.core.mail import EmailMultiAlternatives
from django.template import loader, Context


def get_random_hex():
    return binascii.b2a_hex(os.urandom(10))

def get_boto_conn():
    access_key = settings.AWS_CREDENTIALS['key']
    access_secret = settings.AWS_CREDENTIALS['secret']
    region_name = settings.AWS_CREDENTIALS['region_name']
    boto3.setup_default_session(aws_access_key_id=access_key,
                                aws_secret_access_key=access_secret,
                                region_name=region_name)
    s3 = boto3.resource('s3')
    return s3


def send_mail(context, emails, subject, template_path):
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    t = loader.get_template(template_path)
    input_context = {}
    for key in ['app_id', 'email_id', 'url', 'start_date', 'end_date']:
        if key in context:
            input_context[key] = context[key]
    c = Context(input_context)
    html_content = t.render(c)
    part = MIMEText(html_content, 'html')
    msg.attach(part)
    message_txt = msg.as_string()
    msg = EmailMultiAlternatives(
        subject, message_txt, settings.DEFAULT_FROM_EMAIL, emails)
    msg.attach_alternative(html_content, 'text/html')
    msg.send()
