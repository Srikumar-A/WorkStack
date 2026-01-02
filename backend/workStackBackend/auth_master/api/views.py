from django.shortcuts import render
from .serializers import RegisterSerializer,LoginSerializer,UserSerializer
from rest_framework.response import Response
from rest_framework import generics,status
from ..models import User
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from organization.models import organization
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

class LoginView(APIView):

    def post(self,request):
        serializer=LoginSerializer(data=request.data)
        if serializer.is_valid():
            username=serializer.validated_data['username']
            password=serializer.validated_data['password']

            user_=authenticate(username=username,password=password)

            if not user_:
                return Response({'error':'Invalid Credentials'},status=status.HTTP_404_NOT_FOUND)
            token,created=Token.objects.get_or_create(user=user_)
        else:
            raise ValidationError('Bad Request',status.HTTP_400_BAD_REQUEST)
        return Response({'token':token.key},status=status.HTTP_200_OK)
    

class UserView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        serializer=UserSerializer(request.user)
        return Response(serializer.data,status=status.HTTP_200_OK)

    def patch(self,request):
        print(request.data)
        print(request.user)
        user=request.user
        serializer=UserSerializer(
            instance=user,
            data=request.data,
            partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

class TestView(APIView):
    def get(self,request):
        users=User.objects.all()
        serializer=UserSerializer(users,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
class UserOfOrgView(APIView):
    permission_classes=[IsAuthenticated,]
    def get(self,request,org_id):
        users=User.objects.filter(
            organization=org_id
        )
        serializer=UserSerializer(users,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

    

@api_view(['POST'])
def LogoutView(request):
    if request.method=='POST':
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)