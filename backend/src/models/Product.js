class Product {
  constructor({
    id,
    name,
    price,
    old_price,
    category,
    image,
    description,
    stock,
    rating,
    reviews_count,
    featured,
    badge
  }) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.old_price = old_price;
    this.category = category;
    this.image = image;
    this.description = description;
    this.stock = stock;
    this.rating = rating;
    this.reviews_count = reviews_count;
    this.featured = featured;
    this.badge = badge;
  }
}

module.exports = Product;