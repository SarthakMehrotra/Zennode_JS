#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

class Product {
public:
    string name;
    double price;
    int quantity;
    bool isGift;

    Product(string name, double price, int quantity, bool isGift)
        : name(name), price(price), quantity(quantity), isGift(isGift) {}
};

class Cart {
private:
    vector<Product> products;

    double flat_10_discount() {
        double total = subtotal();
        return total > 200 ? 10 : 0;
    }

    double bulk_5_discount() {
        for (Product product : products) {
            if (product.quantity > 10) {
                return product.price * product.quantity * 0.05;
            }
        }
        return 0;
    }

    double bulk_10_discount() {
        int totalQuantity = 0;
        for (Product product : products) {
            totalQuantity += product.quantity;
        }
        return totalQuantity > 20 ? subtotal() * 0.1 : 0;
    }

    double tiered_50_discount() {
        int totalQuantity = 0;
        double discount = 0;
        for (Product product : products) {
            totalQuantity += product.quantity;
            if (product.quantity > 15) {
                discount += (product.quantity - 15) * product.price * 0.5;
            }
        }
        return totalQuantity > 30 ? discount : 0;
    }

public:
    void addProduct(Product product) {
        products.push_back(product);
    }

    double subtotal() {
        double total = 0;
        for (Product product : products) {
            total += product.price * product.quantity;
        }
        return total;
    }

    pair<string, double> bestDiscount() {
        vector<pair<string, double>> discounts = {
            {"flat_10_discount", flat_10_discount()},
            {"bulk_5_discount", bulk_5_discount()},
            {"bulk_10_discount", bulk_10_discount()},
            {"tiered_50_discount", tiered_50_discount()}
        };
        return *max_element(discounts.begin(), discounts.end(),
            [](const pair<string, double>& a, const pair<string, double>& b) {
                return a.second < b.second;
            });
    }

    double giftWrapFee() {
        double fee = 0;
        for (Product product : products) {
            if (product.isGift) {
                fee += product.quantity;
            }
        }
        return fee;
    }

    double shippingFee() {
        int totalQuantity = 0;
        for (Product product : products) {
            totalQuantity += product.quantity;
        }
        return (totalQuantity / 10 + (totalQuantity % 10 != 0)) * 5;
    }
    

    double total() {
        return subtotal() - bestDiscount().second + giftWrapFee() + shippingFee();
    }
    void printProducts() {
    for (Product product : products) {
        cout << "Product: " << product.name << ", Quantity: " << product.quantity << ", Total: $" << product.price * product.quantity << "\n";
    }
}
};

int main() {
    Cart cart;

    vector<string> productNames = {"Product A", "Product B", "Product C"};
    vector<double> productPrices = {20.0, 40.0, 50.0};

    for (int i = 0; i < productNames.size(); i++) {
        int quantity;
        cout << "Enter the quantity of " << productNames[i] << ": ";
        cin >> quantity;

        char isGiftChar;
        cout << "Is " << productNames[i] << " a gift? (y/n): ";
        cin >> isGiftChar;
        bool isGift = (isGiftChar == 'y' || isGiftChar == 'Y');

        Product product(productNames[i], productPrices[i], quantity, isGift);
        cart.addProduct(product);

    }
        cart.printProducts();


    cout << "Subtotal: $" << cart.subtotal() << "\n";

    pair<string, double> discount = cart.bestDiscount();
    cout << "Discount (" << discount.first << "): $" << discount.second << "\n";

    cout << "Gift wrap fee: $" << cart.giftWrapFee() << "\n";
    cout << "Shipping fee: $" << cart.shippingFee() << "\n";

    cout << "Total: $" << cart.total() << "\n";

    return 0;
}