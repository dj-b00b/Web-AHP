from django.db import models
from application.settings import AUTH_USER_MODEL
from hierarchies.models import Hierarchy
from django.contrib.postgres.fields import ArrayField


# Create your models here.


class Calculation(models.Model):
    hierarchy = models.ForeignKey(
        Hierarchy, on_delete=models.CASCADE, verbose_name="Иерархия"
    )
    user = models.ForeignKey(
        AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name="Эксперт"
    )
    datetime = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Время создания расчета",
    )
    calc_comparison_matrix = ArrayField(
        ArrayField(
            ArrayField(
                models.CharField(max_length=100, null=True, blank=True),
            ),
        ),
        verbose_name="Расчет матриц попарного сравнения",
    )

    calc_global_priorities = models.JSONField(
        verbose_name="Расчет глобальных приоритетов"
    )

    def __str__(self):
        return f"Расчет эксперта {self.user} по иерархии {self.hierarchy.name}"

    class Meta:
        verbose_name = "Расчет"
        verbose_name_plural = "Расчеты"
        ordering = ("-datetime",)
