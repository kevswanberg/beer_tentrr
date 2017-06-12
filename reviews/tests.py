from django.test import TestCase
from rest_framework.test import APIClient

from rest_framework.test import APIClient
from .models import Post



class TestPostViews(TestCase):
    def setUp(self):
        self.client=APIClient()
        self.post = Post.objects.create(
            title="test",
            body="review",
            score=0)

    def test_get_posts(self):
        response=self.client.get('/api/posts/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_search_for_post(self):
        response=self.client.get('/api/posts/?q=test')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

        response=self.client.get('/api/posts/?q=no-result')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 0)

    def test_upvote_post(self):
        response = self.client.post('/api/posts/{}/upvote/'.format(self.post.pk))
        self.assertEqual(response.status_code, 200)
        self.post.refresh_from_db()
        self.assertEqual(self.post.score, 1)

    def test_downvote_post(self):
        response = self.client.post('/api/posts/{}/downvote/'.format(self.post.pk))
        self.assertEqual(response.status_code, 200)
        self.post.refresh_from_db()
        self.assertEqual(self.post.score, -1)
