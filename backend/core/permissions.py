from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsSelfUser(BasePermission):
    """
    It only allows modifying/deleting the user itself.
    Reading is at the discretion of the ViewSet.
    """

    def has_object_permission(self, request, view, obj):        
        if not request.user or not request.user.is_authenticated:
            return False

        return obj.username == request.user.username

class IsEnterprise(BasePermission):
    # Some endpoints, are only available for enterprises.

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True  
        
        if not request.user or not request.user.is_authenticated:
            return False

        return request.user.type_user == 'E'
    
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        
        if not request.user or not request.user.is_authenticated:
            return False

        return request.user.type_user == 'E' and request.user == obj.enterprise.user