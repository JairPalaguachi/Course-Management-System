from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("courses", "0002_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='level',
            field=models.CharField(choices=[('beginner', 'Beginner'), ('intermediate', 'Intermediate'), ('advanced', 'Advanced')], default='beginner', max_length=20),
        ),
        migrations.AddField(
            model_name='course',
            name='duration_minutes',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]
