from django.db import transaction

from rest_framework import authentication, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Cart, CartItem
from .serializers import CartItemSerializer, CartSerializer


class CartView(APIView):
    authentication_classes = [
        authentication.TokenAuthentication
    ]
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_cart(self, user):
        cart, created = Cart.objects.get_or_create(user=user)
        return cart

    def get(self, request):
        cart = self.get_cart(request.user)

        return Response(
            CartSerializer(cart).data
        )


class CartItemCreateView(APIView):
    authentication_classes = [
        authentication.TokenAuthentication
    ]
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request):
        cart, created = Cart.objects.get_or_create(
            user=request.user
        )

        serializer = CartItemSerializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)

        product = serializer.validated_data["product"]
        quantity = serializer.validated_data["quantity"]

        with transaction.atomic():
            cart_item, item_created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={
                    "quantity": quantity
                },
            )

            if not item_created:
                new_quantity = cart_item.quantity + quantity

                if new_quantity > product.stock:
                    return Response(
                        {
                            "detail": (
                                f"Cannot add that many. "
                                f"Only {product.stock} item(s) "
                                f"are available."
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                cart_item.quantity = new_quantity
                cart_item.save()

        return Response(
            CartSerializer(cart).data,
            status=status.HTTP_201_CREATED,
        )


class CartItemDetailView(APIView):
    authentication_classes = [
        authentication.TokenAuthentication
    ]
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_item(self, request, pk):
        try:
            return CartItem.objects.get(
                pk=pk,
                cart__user=request.user,
            )
        except CartItem.DoesNotExist:
            return None

    def patch(self, request, pk):
        item = self.get_item(request, pk)

        if item is None:
            return Response(
                {"detail": "Cart item not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = CartItemSerializer(
            item,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            CartSerializer(item.cart).data
        )

    def delete(self, request, pk):
        item = self.get_item(request, pk)

        if item is None:
            return Response(
                {"detail": "Cart item not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        cart = item.cart
        item.delete()

        return Response(
            CartSerializer(cart).data
        )