from rest_framework.routers import DefaultRouter
from .views import FriendRequestViewSet

router = DefaultRouter()
router.register(r'friends', FriendRequestViewSet, basename='friend')

urlpatterns = router.urls
