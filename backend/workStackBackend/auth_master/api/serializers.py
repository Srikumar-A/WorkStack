from django.contrib.auth.models import User
from rest_framework import serializers


class RegisterSerializer(serializers.ModelSerializer):
    password2=serializers.CharField(style={"input_type": "password"}, write_only=True)

    class Meta:
        model=User
        fields=['username','email','password','password2']
        extra_kwargs={
            'password':{'write_only':True}  }
        
    def save(self):
        pswd2=self.validated_data['password2']
        pswd=self.validated_data['password']
        email=self.validated_data['email']
        username=self.validated_data['username']

        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({'error':'Email already exists'})
        
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({'error':'Username already exists'})
        
        if pswd!=pswd2:
            raise serializers.ValidationError({'error':'Passwords do not match'})
        
        user_=User(
            username=username,
            email=email,
        )
        user_.set_password(pswd)
        user_.save()
        return user_
    
class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['username','password']

        