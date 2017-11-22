# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.response import Response
from auth_layer.users import (
    UserModel,
    create_inactive_user,
    create_account_for_user,
    create_profile,
)
from django.core.files.base import ContentFile
from auth_layer.helper import get_boto_conn
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes
)
from django.conf import settings

# Create your views here.

@api_view(['GET'])
def index(request):
    context = {
        'curr_acc_id': 44,
        'curr_camp_id': 5725,
        'curr_seg_id': 3771,
        }
    return render(request, 'upload_files.html', context)

def pre_process_file_data(data):
    quotes_comma_regx = re.compile('[\'"`]')
    processed_data = quotes_comma_regx.sub('', data)
    return processed_data

@api_view(['POST'])
def upload_files(request):
    # print 'head', request.headers
    print 'body', request.POST.__dict__
    # print 'files', request.files
    return Response({'hi': 'Yay.'}, status=200)
    pass
    s3 = get_boto_conn()
    
    if request.method == 'POST':
        for f in request.FILES.getlist('file'):
            f_name = request.FILES.get('file').name
        file_name = request.FILES.get('file').name
        file_name = file_name + str(time.time())
        print file_name

    full_file_name = os.path.join(settings.SEGMENT_FILE_UPLOAD_LOCATION, file_name)
    fout = open(full_file_name, 'wb+')
    file_data = pre_process_file_data(request.FILES.get('file').read())
    file_content = ContentFile(file_data)
    try:
        for chunk in file_content.chunks():
            if '\t' in chunk or ',' in chunk:
                return Response({'error': 'File should not contain comma or tab'}, status=400)
            fout.write(chunk)
        fout.close()
        return Response({'filename': file_name})
    except:
        return Response(status=400);

    s3.meta.client.upload_file(new_file_path, settings.AWS_CREDENTIALS['bucket_name'], s3_path)

@api_view(['POST'])
def sign_up(request):
    user_data = request.data
    email = user_data['email'].strip()
    password = user_data['password']
    fname = user_data['fname']
    lname = user_data['lname']
    is_parse = False
    if 'parse' in user_data:
        is_parse = user_data['parse']
    if UserModel().objects.filter(email__iexact=email):
        return Response({'error': 'This user already exists.'}, status=401)

    try:
        new_user = create_inactive_user(email, email, password, fname, lname, is_parse)
        create_profile(new_user)
        return Response(status=200)
    except Exception, e:
        print e
        return Response(status=403)

@api_view(['POST'])
def password_reset(request):
    user_data = request.data
    try:
        reset_obj = PasswordReset.objects.get(reset_key=user_data['reset_key'])
    except Exception:
        return Response({'error': 'Invalid pasword reset request.'}, status=400)
    try:
        user = UserModel().objects.get(id=reset_obj.user_id)
    except:
        return Response({'error': 'Invalid user'}, status=400)
    user.set_password(user_data['password'])
    user.save()
    return Response()

@api_view(['GET'])
def activate_user(request, pk):
    try:
        reg_obj = Registration.objects.get(activation_key=pk)
    except Exception:
        return Response({'error': 'Invalid activation request.'}, status=400)

    try:
        user = UserModel().objects.get(id=reg_obj.user_id)
    except Exception:
        return Response({'error': 'Invalid activation request.'}, status=400)
    if user.is_active:
        return Response({'status': 'User is already active.'}, status=200)

    user.is_active = True
    user.save()
    create_account_for_user(user)
    return Response({'status': 'successfuly activated'}, status=200)
