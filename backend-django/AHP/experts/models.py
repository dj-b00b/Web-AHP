from django.contrib.auth.models import AbstractUser

# Create your models here.


class Expert(AbstractUser):

    class Meta:
        verbose_name = "Эксперт"
        verbose_name_plural = "Эксперты"
