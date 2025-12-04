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
    
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False

        return request.user == obj.user
    
class IsEnterpriseCheck(BasePermission):
    # Some endpoints, are only available for enterprises.
    
    def has_permission(self, request, view):
        user = request.user 
        
        if not user or not user.is_authenticated: 
            return False 
        
        return user.enterprises.exists()
    
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False

        return request.user == obj.enterprise.user