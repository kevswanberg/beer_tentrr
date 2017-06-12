from django.db.models import Q, F
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import detail_route
from rest_framework.response import Response

from .models import Post
from .serializers import PostSerializer



### APP VIEWS ###

def index(request):
    return render(request, 'index.html')


def results(request):
    return render(request, 'search-results.html')


#### API VIEWS ####

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get_queryset(self):
        queryset = Post.objects.all()
        if self.request.query_params.get('q'):
            term = self.request.query_params.get('q')
            queryset = queryset.filter(Q(title__icontains=term) | Q(body__icontains=term))
        return queryset

    @detail_route(methods=['POST'])
    def upvote(self, request, pk=None):
        post = self.get_object()
        post.score = F('score') +1
        post.save()
        return Response()


    @detail_route(methods=['POST'])
    def downvote(self, request, pk=None):
        post = self.get_object()
        post.score = F('score') -1
        post.save()
        return Response()
