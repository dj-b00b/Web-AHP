from django.db import models
from django.contrib.postgres.fields import ArrayField


# Create your models here.


class Hierarchy(models.Model):
    name = models.CharField(max_length=150, verbose_name="Название иерархии")
    criteria = ArrayField(
        models.CharField(max_length=100), verbose_name="Критерии сравнения"
    )
    alternatives = ArrayField(
        models.CharField(max_length=100), verbose_name="Альтернативы"
    )
    characteristics = ArrayField(
        ArrayField(models.CharField(max_length=100)),
        verbose_name="Характеристика альтернатив по каждому критерию сравнения",
    )

    def __str__(self):
        return f"{self.name}"

    class Meta:
        verbose_name = "Иерархия"
        verbose_name_plural = "Иерархии"
