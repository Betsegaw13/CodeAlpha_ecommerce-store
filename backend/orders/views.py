from decimal import Decimal

from django.db import transaction

from rest_framework import authentication, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from cart.models import Cart, CartItem

from .models import Order, OrderItem
from .serializers import CheckoutSerializer, OrderSerializer


class CheckoutView(APIView):
    authentication_classes = [
        authentication.TokenAuthentication
    ]
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            cart, created = Cart.objects.get_or_create(
                user=request.user
            )

            cart_items = list(
                CartItem.objects
                .select_related("product")
                .select_for_update()
                .filter(cart=cart)
            )

            if not cart_items:
                return Response(
                    {"detail": "Your cart is empty."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            subtotal = Decimal("0.00")

            # Lock product rows and verify stock.
            locked_products = {}

            for cart_item in cart_items:
                product = (
                    cart_item.product.__class__
                    .objects
                    .select_for_update()
                    .get(pk=cart_item.product_id)
                )

                locked_products[product.id] = product

                if not product.is_active:
                    return Response(
                        {
                            "detail": (
                                f"{product.name} is no longer available."
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                if cart_item.quantity > product.stock:
                    return Response(
                        {
                            "detail": (
                                f"Only {product.stock} item(s) of "
                                f"{product.name} are available."
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                subtotal += product.price * cart_item.quantity

            # Simple shipping rule for our MVP.
            shipping_cost = Decimal("10.00")

            # We are not implementing real tax calculation yet.
            tax = Decimal("0.00")

            total = subtotal + shipping_cost + tax

            order = Order.objects.create(
                user=request.user,
                status=Order.Status.PENDING,
                full_name=serializer.validated_data["full_name"],
                email=serializer.validated_data["email"],
                phone=serializer.validated_data["phone"],
                address=serializer.validated_data["address"],
                city=serializer.validated_data["city"],
                state=serializer.validated_data.get("state", ""),
                postal_code=serializer.validated_data.get(
                    "postal_code",
                    "",
                ),
                country=serializer.validated_data["country"],
                subtotal=subtotal,
                shipping_cost=shipping_cost,
                tax=tax,
                total=total,
            )

            for cart_item in cart_items:
                product = locked_products[cart_item.product_id]

                OrderItem.objects.create(
                    order=order,
                    product=product,
                    product_name=product.name,
                    unit_price=product.price,
                    quantity=cart_item.quantity,
                    subtotal=product.price * cart_item.quantity,
                )

                product.stock -= cart_item.quantity
                product.save(update_fields=["stock"])

            cart.items.all().delete()

        return Response(
            {
                "message": "Order created successfully.",
                "order": OrderSerializer(order).data,
            },
            status=status.HTTP_201_CREATED,
        )


class OrderListView(APIView):
    authentication_classes = [
        authentication.TokenAuthentication
    ]
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request):
        orders = (
            Order.objects
            .filter(user=request.user)
            .prefetch_related("items")
        )

        return Response(
            OrderSerializer(orders, many=True).data
        )


class OrderDetailView(APIView):
    authentication_classes = [
        authentication.TokenAuthentication
    ]
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request, order_number):
        try:
            order = (
                Order.objects
                .prefetch_related("items")
                .get(
                    order_number=order_number,
                    user=request.user,
                )
            )
        except Order.DoesNotExist:
            return Response(
                {"detail": "Order not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            OrderSerializer(order).data
        )