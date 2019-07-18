from django.http import Http404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from core.models import Page, Component
from core.serializers import UserRegisterSerializer, UserSerializer, PageSerializer, ComponentSerializer


@api_view(['GET'])
@permission_classes((AllowAny, ))
def get_authenticated_user(request):
    if request.user:
        try:
            user = get_object_or_404(User, pk=request.user.id)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    return Response(status=status.HTTP_400_BAD_REQUEST)


class RegisterView(APIView):
    serializer_class = UserRegisterSerializer
    permission_classes = (AllowAny, )

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListView(APIView):
    serializer_class = UserSerializer

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class UserDetailView(APIView):
    serializer_class = UserSerializer

    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        user = self.get_object(pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, pk):
        user = self.get_object(pk)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        user = self.get_object(pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PageListView(APIView):
    serializer_class = PageSerializer

    def get(self, request):
        pages = Page.objects.filter(user_id=request.user.id)
        serializer = PageSerializer(pages, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PageDetailView(APIView):
    serializer_class = PageSerializer

    def get_object(self, pk):
        try:
            return Page.objects.get(pk=pk)
        except Page.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        page = self.get_object(pk)
        serializer = PageSerializer(page)
        return Response(serializer.data)

    def put(self, request, pk):
        page = self.get_object(pk)
        serializer = PageSerializer(page, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        page = self.get_object(pk)
        page.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ComponentListView(APIView):
    serializer_class = ComponentSerializer

    def get(self, request, page_pk):
        page = Page.objects.get(pk=page_pk)
        components = Component.objects.filter(page=page)
        serializer = ComponentSerializer(components, many=True)
        return Response(serializer.data)

    def post(self, request, page_pk):
        serializer = ComponentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(page_id=page_pk)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ComponentDetailView(APIView):
    serializer_class = ComponentSerializer

    def get_object(self, pk):
        try:
            return Component.objects.get(pk=pk)
        except Component.DoesNotExist:
            raise Http404

    def get(self, request, page_pk, comp_pk):
        component = self.get_object(comp_pk)
        serializer = ComponentSerializer(component)
        return Response(serializer.data)

    def put(self, request, page_pk, comp_pk):
        component = self.get_object(comp_pk)
        serializer = ComponentSerializer(component, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, page_pk, comp_pk):
        component = self.get_object(comp_pk)
        component.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
	
## Site Views

from django.http import HttpResponse
from django.shortcuts import render, redirect

def hall(request):
	if request.user is not None and request.user.is_active:
		return redirect('/' + request.user.username + '/')
	return redirect('/login/')

def login(request):
	return render(request, 'core/login.html', {})

def loginredirect(request):
	return redirect('/' + request.user.username + '/')

def logon(request):
	return render(request, 'core/logon.html', {})

def dashboard(request, username):
	# return HttpResponse("Hello, user. You're at Dashboard of %s." % username)
	return render(request, 'core/dashboard.html', {})
