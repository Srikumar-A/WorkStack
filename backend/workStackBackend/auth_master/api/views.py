from django.shortcuts import render
from .serializers import RegisterSerializer,LoginSerializer
from rest_framework.response import Response
from rest_framework import generics,status
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.core.exceptions import ValidationError
from rest_framework.decorators import api_view
# Create your views here.

class RegisterView(generics.CreateAPIView):
    queryset=User.objects.all()
    serializer_class=RegisterSerializer

    def get_queryset(self):
        return User.objects.all()
    def perform_create(self,serializer):
        data={}

        try:
            user_=serializer.save()
            data['response']="Successful Registration"
            data['username']=serializer.validated_data["username"]
            data['password']=serializer.validated_data["password"]
            data['token']=Token.objects.get(user=user_).key

        except ValidationError as e:
            data['response']=e
        
        return Response(data=data)

class LoginView(generics.GenericAPIView):
    serializer_class=LoginSerializer

    def post(self,request):
        serializer=self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username=serializer.validated_data['username']
        password=serializer.validated_data['password']

        try:
            user_=User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error':'Invalid username or password'},status=status.HTTP_404_NOT_FOUND)
        
        if not user_.check_password(password):
            return Response({'error':'Invalid username or password'},status=status.HTTP_404_NOT_FOUND)
        
        token,created=Token.objects.get_or_create(user=user_)
        return Response({'token':token.key},status=status.HTTP_200_OK)
    

@api_view(['POST'])
def LogoutView(request):
    if request.method=='POST':
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)