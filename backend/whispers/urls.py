from rest_framework.routers import DefaultRouter
from .views import WhisperViewSet

router = DefaultRouter()
router.register(r'whispers', WhisperViewSet, basename='whisper')

urlpatterns = router.urls
