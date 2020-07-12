from django.utils import timezone
from django.conf import settings
#from django.contrib.gis.db import models as geomodels
from Profile.models import User as customUser
from django.urls import reverse
from django.db.models import Manager as GeoManager
from django.contrib.gis.db import models
from Profile.models import User as customUser
from django.urls import reverse
from django.contrib.gis.geos import Point
from django.contrib.gis.geos import GEOSGeometry
from django.conf import settings
import uuid ###

class Category(models.Model):
    tag = models.CharField(primary_key = True, max_length = 32, unique = True)
    colour = models.CharField(max_length = 32, default = 'Success')

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.tag


class Post(models.Model):
    Latitude = models.DecimalField(max_digits = 9, decimal_places = 6)
    Longitude = models.DecimalField(max_digits = 9, decimal_places = 6)
    posted_at = models.DateTimeField( default = timezone.now, editable = False)
    body = models.TextField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.CASCADE)
    categories = models.ManyToManyField(Category, blank=True)
    private = models.BooleanField(('private'), default = False)
    locat = models.PointField(blank = True, null=True, srid=4326)

    '''
    def get_absolute_url(self):
        return reverse('post-detail', kwargs={'pk': self.pk})
    '''
    def save_model(self, request, obj, form, change):
        obj.user = request.user
        super().save_model(request, obj, form, change)

    def save(self, *args, **kwargs):
        self.locat = GEOSGeometry('POINT(%s %s)' % (self.Longitude, self.Latitude))
        super(Post, self).save() 

    def __str__(self):
        return f"{self.id} Posted by {self.user}"


class Comment(models.Model):
    body = models.CharField(max_length = 255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.CASCADE)
    post = models.ForeignKey(Post, on_delete = models.CASCADE)
    def __str__(self):
        return f" by {self.user}"


class Like(models.Model):
    post = models.ForeignKey(Post, on_delete = models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.CASCADE)
    created_at = models.DateTimeField(default = timezone.now, editable = False)

    class Meta:
        unique_together = (('post', 'user'), )

    def __str__(self):
        return f"Liked by {self.user}"

