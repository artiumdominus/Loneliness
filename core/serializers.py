from rest_framework import serializers
from django.contrib.auth.models import User

from . import models


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(style={'input_type': 'password'})

    class Meta:
        model = User
        fields = (
            'id', 'username',
            'email', 'password'
        )
        read_only_fields = ('id',)

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username',
                  'email', 'password')
        read_only_fields = ('id',)

    def update(self, instance, validated_data):
        instance.username = validated_data.get(
            'username', instance.username
        )
        instance.email = validated_data.get(
            'email', instance.email
        )
        instance.set_password(
            validated_data.get('password')
        )
        instance.save()


class PageSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField()
    url = serializers.URLField()
    description = serializers.CharField(style={'input_type': 'textarea'})
    visibility = serializers.ChoiceField(
        choices=models.Page.VISIBILITY_CHOICES
    )
    # backgroundImage = serializers.ImageField()
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = models.Page
        fields = '__all__'


class ComponentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    page = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = models.Component
        fields = '__all__'
