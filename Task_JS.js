const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const products = [
  { name: "Product A", price: 20 },
  { name: "Product B", price: 40 },
  { name: "Product C", price: 50 },
];

const discounts = {
  flat_10_discount: (cartTotal) => (cartTotal > 200 ? 10 : 0),
  bulk_5_discount: (quantity, price) =>
    quantity > 10 ? quantity * price * 0.05 : 0,
  bulk_10_discount: (totalQuantity, cartTotal) =>
    totalQuantity > 20 ? cartTotal * 0.1 : 0,
  tiered_50_discount: (totalQuantity, quantity, price, cartTotal) => {
    if (totalQuantity > 30 && quantity > 15) {
      const discountAmount = (quantity - 15) * price * 0.5;
      return cartTotal - (discountAmount + 15 * price);
    }
    return 0;
  },
};

function calculateTotal(products, quantities, giftWrap) {
  let cartTotal = 0;
  let totalQuantity = 0;
  let discountApplied = "";
  let discountAmount = 0;
  let shippingFee = 0;
  let giftWrapFee = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const quantity = quantities[i];
    const productTotal = product.price * quantity;

    cartTotal += productTotal;
    totalQuantity += quantity;

    const bulk5Discount = discounts.bulk_5_discount(quantity, product.price);
    if (bulk5Discount > discountAmount) {
      discountApplied = "bulk_5_discount";
      discountAmount = bulk5Discount;
    }

    if (quantity > 15 && totalQuantity > 30) {
      const tiered50Discount = discounts.tiered_50_discount(
        totalQuantity,
        quantity,
        product.price,
        cartTotal
      );
      if (tiered50Discount > discountAmount) {
        discountApplied = "tiered_50_discount";
        discountAmount = tiered50Discount;
      }
    }
  }

  if (cartTotal > 200) {
    const flat10Discount = discounts.flat_10_discount(cartTotal);
    if (flat10Discount > discountAmount) {
      discountApplied = "flat_10_discount";
      discountAmount = flat10Discount;
    }
  }

  if (totalQuantity > 20) {
    const bulk10Discount = discounts.bulk_10_discount(totalQuantity, cartTotal);
    if (bulk10Discount > discountAmount) {
      discountApplied = "bulk_10_discount";
      discountAmount = bulk10Discount;
    }
  }

  if (giftWrap) {
    giftWrapFee = totalQuantity;
  }

  shippingFee = Math.ceil(totalQuantity / 10) * 5;

  const subtotal = cartTotal - discountAmount;
  const total = subtotal + shippingFee + giftWrapFee;

  return {
    products: products.map((product, i) => ({
      name: product.name,
      quantity: quantities[i],
      total: product.price * quantities[i],
    })),
    subtotal,
    discountApplied,
    discountAmount,
    shippingFee,
    giftWrapFee,
    total,
  };
}

function getUserInput(pro) {
  return new Promise((resolve) => {
    rl.question(pro, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  const quantities = [];
  let giftWrap = false;

  for (let i = 0; i < products.length; i++) {
    const quantity = await getUserInput(
      `Enter the quantity for ${products[i].name}: `
    );
    quantities.push(parseInt(quantity, 10));
  }

  const giftWrapInput = await getUserInput(
    "Do you want gift wrapping? (yes/no): "
  );
  if (giftWrapInput.toLowerCase() === "yes") {
    giftWrap = true;
  }

  const total = calculateTotal(products, quantities, giftWrap);

  console.log("************* Order Summary *************");
  console.log("Products:");
  total.products.forEach((product) => {
    console.log(`${product.name} x ${product.quantity}: $${product.total}`);
  });
  console.log("-----------------------------------------");
  console.log("Subtotal: $", total.subtotal);
  console.log(
    `Discount applied (${total.discountApplied}): $${total.discountAmount}`
  );
  console.log("Shipping Fee: $", total.shippingFee);
  console.log("Gift Wrap Fee: $", total.giftWrapFee);
  console.log("-----------------------------------------");
  console.log("Total: $", total.total);

  rl.close();
}

main();
