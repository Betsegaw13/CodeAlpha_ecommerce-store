from rest_framework import serializers

from products.models import Product

from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        source="product",
        queryset=Product.objects.filter(is_active=True),
        write_only=True,
    )
    product = serializers.SerializerMethodField()
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product_id",
            "product",
            "quantity",
            "subtotal",
        ]

    def get_product(self, obj):
        return {
            "id": obj.product.id,
            "name": obj.product.name,
            "slug": obj.product.slug,
            "price": obj.product.price,
            "image": obj.product.image,
        }

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError(
                "Quantity must be at least 1."
            )
        return value

    def validate(self, attrs):
        product = attrs.get("product")
        quantity = attrs.get("quantity", 1)

        if product and quantity > product.stock:
            raise serializers.ValidationError(
                {
                    "quantity": (
                        f"Only {product.stock} item(s) are available."
                    )
                }
            )

        return attrs


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = [
            "id",
            "items",
            "total",
            "created_at",
            "updated_at",
        ]

    def get_total(self, obj):
        return sum(
            item.subtotal
            for item in obj.items.all()
        )