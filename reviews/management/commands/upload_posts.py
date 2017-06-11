from django.core.management.base import BaseCommand
import xml.etree.ElementTree as ElementTree
from reviews.models import Post


class Command(BaseCommand):
    """
    Save everything in posts.xml to the database
    """

    def handle(self, *args, **options):
        Post.objects.all().delete()
        tree = ElementTree.parse('Posts.xml')
        root = tree.getroot()
        Post.objects.bulk_create([
            Post(title=child.attrib.get('Title', ''),
                 body=child.attrib.get('Body', ''),
                 score=int(child.attrib.get('Score', 0)))
            for child in root]
        )
