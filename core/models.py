from django.db import models
from django.contrib.auth.models import User


class Page(models.Model):

    VISIBILITY_CHOICES = [
        ('PUBLIC', 'Publica'),
        ('PRIVATE', 'Privada'),
        ('FRIENDS', 'Só para Amigos')
    ]

    title = models.CharField(
        max_length=255
    )

    url = models.CharField(
        max_length=255
    )

    description = models.CharField(
        max_length=1024,
        blank=True
    )

    # backgroundImage = models.ImageField(
    #     max_length=None
    # )

    backgroundColor = models.CharField(
        max_length=255
    )

    visibility = models.CharField(
        choices=VISIBILITY_CHOICES,
        default='PUBLIC',
        max_length=20
    )

    user = models.ForeignKey(
        to=User,
        on_delete=models.CASCADE,
        related_name="pages"
    )

    def __str__(self):
        return self.title + " : " + self.user.username


class Component(models.Model):

    name = models.CharField(
        max_length=255
    )

    description = models.CharField(
        max_length=255
    )

    x = models.DecimalField(max_digits=5, decimal_places=2)

    y = models.DecimalField(max_digits=5, decimal_places=2)

    page = models.ForeignKey(
        to=Page,
        on_delete=models.CASCADE,
        related_name="components"
    )

    def __str__(self):
        return self.name
