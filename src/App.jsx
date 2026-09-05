import { useEffect, useMemo, useState } from "react";
import products from "./data/products";

const CONTACT = {
  whatsapp: "972527594175",
  phone: "0527594175",
  instagram: "https://www.instagram.com/"
};

const t = {
  ar: {
    brand: "JY Market",
    hero: "قمصان كرة القدم التي تحبها",
    heroText: "اختار قميصك المفضل واطلبه بسهولة.",
    shop: "تسوق الآن",
    all: "الكل",
    national: "منتخبات",
    club: "أندية",
    search: "ابحث عن لاعب أو فريق...",
    fan: "نسخة مشجع",
    player: "نسخة لاعب",
    size: "المقاس",
    add: "أضف للسلة",
    cart: "السلة",
    empty: "السلة فارغة",
    checkout: "إتمام الطلب",
    total: "المجموع",
    name: "الاسم",
    phone: "الهاتف",
    city: "المدينة",
    address: "العنوان",
    payment: "طريقة الدفع",
    cash: "الدفع عند الاستلام",
    card: "بطاقة ائتمان",
    send: "إرسال الطلب",
    remove: "حذف",
    back: "رجوع",
    contact: "تواصل معنا",
    front: "أمام",
    backImg: "خلف",
    out: "غير متوفر",
    sent: "تم إرسال الطلب بنجاح",
    order: "رقم الطلب"
  },
  he: {
    brand: "JY Market",
    hero: "חולצות כדורגל שאתם אוהבים",
    heroText: "בחרו חולצה והזמינו בקלות.",
    shop: "קנו עכשיו",
    all: "הכל",
    national: "נבחרות",
    club: "מועדונים",
    search: "חפש שחקן או קבוצה...",
    fan: "גרסת אוהד",
    player: "גרסת שחקן",
    size: "מידה",
    add: "הוסף לסל",
    cart: "עגלה",
    empty: "העגלה ריקה",
    checkout: "סיום הזמנה",
    total: "סה״כ",
    name: "שם",
    phone: "טלפון",
    city: "עיר",
    address: "כתובת",
    payment: "אמצעי תשלום",
    cash: "תשלום בעת המסירה",
    card: "כרטיס אשראי",
    send: "שלח הזמנה",
    remove: "הסר",
    back: "חזרה",
    contact: "צור קשר",
    front: "קדימה",
    backImg: "אחורה",
    out: "לא במלאי",
    sent: "ההזמנה נשלחה בהצלחה",
    order: "מספר הזמנה"
  },
  en: {
    brand: "JY Market",
    hero: "Football Jerseys You Love",
    heroText: "Choose your favorite jersey and order easily.",
    shop: "Shop Now",
    all: "All",
    national: "National Teams",
    club: "Clubs",
    search: "Search player or team...",
    fan: "Fan Version",
    player: "Player Version",
    size: "Size",
    add: "Add to Cart",
    cart: "Cart",
    empty: "Your cart is empty",
    checkout: "Checkout",
    total: "Total",
    name: "Name",
    phone: "Phone",
    city: "City",
    address: "Address",
    payment: "Payment",
    cash: "Cash on Delivery",
    card: "Credit Card",
    send: "Place Order",
    remove: "Remove",
    back: "Back",
    contact: "Contact Us",
    front: "Front",
    backImg: "Back",
    out: "Out of stock",
    sent: "Order sent successfully",
    order: "Order Number"
  }
};

function App() {
  const [language, setLanguage] = useState(
    localStorage.getItem("jy-market-language") || "ar"
  );

  const [storeProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("jy-market-products");
      return saved ? JSON.parse(saved) : products;
    } catch {
      return products;
    }
  });

  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("jy-market-cart") || "[]");
    } catch {
      return [];
    }
  });

  const [checkout, setCheckout] = useState({
    name: "",
    phone: "",
    city: "",
    address: ""
  });

  const [payment, setPayment] = useState("cash");

  const lang = t[language];

  useEffect(() => {
    localStorage.setItem("jy-market-language", language);
    document.documentElement.dir =
      language === "en" ? "ltr" : "rtl";
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem(
      "jy-market-cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  const visibleProducts = useMemo(() => {
    let list = [...storeProducts];

    if (category !== "all") {
      list = list.filter(
        (p) => p.category === category
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();

      list = list.filter((p) =>
        `${p.player} ${p.team} ${p.number}`
          .toLowerCase()
          .includes(q)
      );
    }

    return list;
  }, [storeProducts, category, search]);

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  function addToCart(product, version, size, quantity = 1) {
    const stock =
      product.versions[version].stock[size] || 0;

    if (stock <= 0) {
      alert(lang.out);
      return;
    }

    const key = `${product.id}-${version}-${size}`;

    setCart((current) => {
      const existing = current.find(
        (item) => item.key === key
      );

      if (existing) {
        return current.map((item) =>
          item.key === key
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + quantity,
                  stock
                )
              }
            : item
        );
      }

      return [
        ...current,
        {
          key,
          productId: product.id,
          player: product.player,
          number: product.number,
          team: product.team,
          version,
          size,
          quantity: Math.min(quantity, stock),
          price: product.versions[version].price,
          image: product.images[0]
        }
      ];
    });

    setCartOpen(true);
  }

  function changeQuantity(key, amount) {
    setCart((current) =>
      current
        .map((item) =>
          item.key === key
            ? {
                ...item,
                quantity: Math.max(
                  1,
                  item.quantity + amount
                )
              }
            : item
        )
    );
  }

  function removeItem(key) {
    setCart((current) =>
      current.filter(
        (item) => item.key !== key
      )
    );
  }

  function placeOrder(e) {
    e.preventDefault();

    if (
      !checkout.name.trim() ||
      !checkout.phone.trim() ||
      !checkout.city.trim() ||
      !checkout.address.trim()
    ) {
      alert("عبّي جميع المعلومات");
      return;
    }

    if (!cart.length) {
      alert(lang.empty);
      return;
    }

    const orderNumber =
      "JY-" +
      Date.now().toString().slice(-8);

    const order = {
      orderNumber,
      customer: checkout,
      paymentMethod: payment,
      items: cart,
      total: cartTotal,
      status: "new",
      createdAt: new Date().toISOString()
    };

    let oldOrders = [];

    try {
      oldOrders = JSON.parse(
        localStorage.getItem("jy-market-orders") || "[]"
      );
    } catch {
      oldOrders = [];
    }

    localStorage.setItem(
      "jy-market-orders",
      JSON.stringify([order, ...oldOrders])
    );

    const itemsText = cart
      .map(
        (item) =>
          `${item.player} #${item.number} - ${item.team} - ${
            item.version === "player"
              ? lang.player
              : lang.fan
          } - ${lang.size}: ${item.size} - ${item.quantity}`
      )
      .join("\n");

    const message =
      `طلب جديد من JY Market\n\n` +
      `${lang.order}: ${orderNumber}\n` +
      `${lang.name}: ${checkout.name}\n` +
      `${lang.phone}: ${checkout.phone}\n` +
      `${lang.city}: ${checkout.city}\n` +
      `${lang.address}: ${checkout.address}\n` +
      `${lang.payment}: ${
        payment === "cash"
          ? lang.cash
          : lang.card
      }\n\n` +
      `المنتجات:\n${itemsText}\n\n` +
      `${lang.total}: ${cartTotal} ₪`;

    window.open(
      `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    setCart([]);
    setCartOpen(false);
    setCheckoutOpen(false);

    setCheckout({
      name: "",
      phone: "",
      city: "",
      address: ""
    });

    alert(
      `${lang.sent}\n${lang.order}: ${orderNumber}`
    );
  }

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-inner">
          <button
            className="logo"
            onClick={() => {
              setSelectedProduct(null);
              setCheckoutOpen(false);
              window.scrollTo(0, 0);
            }}
          >
            {lang.brand}
          </button>

          <div className="header-actions">
            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
            >
              <option value="ar">العربية</option>
              <option value="he">עברית</option>
              <option value="en">English</option>
            </select>

            <button
              className="cart-button"
              onClick={() => setCartOpen(true)}
            >
              🛒 {lang.cart} ({cartCount})
            </button>
          </div>
        </div>
      </header>

      {checkoutOpen ? (
        <Checkout
          lang={lang}
          data={checkout}
          setData={setCheckout}
          payment={payment}
          setPayment={setPayment}
          total={cartTotal}
          onBack={() => setCheckoutOpen(false)}
          onSubmit={placeOrder}
        />
      ) : selectedProduct ? (
        <ProductPage
          product={selectedProduct}
          lang={lang}
          onBack={() => setSelectedProduct(null)}
          onAdd={addToCart}
        />
      ) : (
        <>
          <section className="hero">
            <div>
              <h1>{lang.hero}</h1>
              <p>{lang.heroText}</p>

              <button
                onClick={() =>
                  document
                    .getElementById("products")
                    ?.scrollIntoView({
                      behavior: "smooth"
                    })
                }
              >
                {lang.shop}
              </button>
            </div>
          </section>

          <main
            className="products-section"
            id="products"
          >
            <div className="toolbar">
              <div className="categories">
                <button
                  className={
                    category === "all"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setCategory("all")
                  }
                >
                  {lang.all}
                </button>

                <button
                  className={
                    category === "national"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setCategory("national")
                  }
                >
                  {lang.national}
                </button>

                <button
                  className={
                    category === "club"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setCategory("club")
                  }
                >
                  {lang.club}
                </button>
              </div>

              <input
                className="search"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder={lang.search}
              />
            </div>

            <div className="products-grid">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  lang={lang}
                  onOpen={() =>
                    setSelectedProduct(product)
                  }
                  onAdd={addToCart}
                />
              ))}
            </div>
          </main>
        </>
      )}

      <section className="contact-section">
        <div className="contact-content">
          <h2>{lang.contact}</h2>

          <div className="contact-buttons">
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="contact-button whatsapp-button"
            >
              {lang.whatsapp || "WhatsApp"}
            </a>

            <a
              href={`tel:${CONTACT.phone}`}
              className="contact-button call-button"
            >
              {lang.call || "Call"}
            </a>

            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noreferrer"
              className="contact-button instagram-button"
            >
              Instagram
            </a>
          </div>

          <div className="contact-number">
            {CONTACT.phone}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        © 2026 JY Market
      </footer>

      <a
        href={`https://wa.me/${CONTACT.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        className="floating-whatsapp"
      >
        WA
      </a>

      {cartOpen && (
        <CartDrawer
          cart={cart}
          total={cartTotal}
          lang={lang}
          onClose={() => setCartOpen(false)}
          onChange={changeQuantity}
          onRemove={removeItem}
          onCheckout={() => {
            setCartOpen(false);
            setCheckoutOpen(true);
          }}
        />
      )}
    </div>
  );
}

function ProductCard({
  product,
  lang,
  onOpen,
  onAdd
}) {
  const [version, setVersion] = useState("fan");
  const [size, setSize] = useState("M");

  const data = product.versions[version];

  return (
    <article className="product-card">
      <div
        className="product-image-wrapper"
        onClick={onOpen}
      >
        <img
          src={product.images[0]}
          alt={product.player}
        />
      </div>

      <div className="product-info">
        <small>{product.team}</small>

        <h3>
          {product.player} #{product.number}
        </h3>

        <p>{product.season}</p>

        <div className="version-buttons">
          <button
            className={
              version === "fan" ? "active" : ""
            }
            onClick={() => setVersion("fan")}
          >
            {lang.fan}
          </button>

          <button
            className={
              version === "player"
                ? "active"
                : ""
            }
            onClick={() =>
              setVersion("player")
            }
          >
            {lang.player}
          </button>
        </div>

        <strong className="price">
          {data.price} ₪
        </strong>

        <div className="size-buttons">
          {["S", "M", "L", "XL", "XXL"].map(
            (s) => (
              <button
                key={s}
                disabled={!data.stock[s]}
                className={
                  size === s ? "active" : ""
                }
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            )
          )}
        </div>

        <button
          className="add-button"
          disabled={!data.stock[size]}
          onClick={() =>
            onAdd(product, version, size)
          }
        >
          {lang.add}
        </button>
      </div>
    </article>
  );
}

function ProductPage({
  product,
  lang,
  onBack,
  onAdd
}) {
  const [version, setVersion] = useState("fan");
  const [size, setSize] = useState("M");
  const [side, setSide] = useState(0);

  const data = product.versions[version];

  return (
    <main className="product-page">
      <button
        className="back-button"
        onClick={onBack}
      >
        ← {lang.back}
      </button>

      <div className="product-detail">
        <div className="detail-image">
          <img
            src={product.images[side]}
            alt={product.player}
          />

          <div className="image-switch">
            <button
              className={
                side === 0 ? "active" : ""
              }
              onClick={() => setSide(0)}
            >
              {lang.front}
            </button>

            <button
              className={
                side === 1 ? "active" : ""
              }
              onClick={() => setSide(1)}
            >
              {lang.backImg}
            </button>
          </div>
        </div>

        <div className="detail-info">
          <small>{product.team}</small>

          <h1>
            {product.player} #{product.number}
          </h1>

          <p>{product.season}</p>

          <div className="detail-price">
            {data.price} ₪
          </div>

          <div className="version-buttons">
            <button
              className={
                version === "fan"
                  ? "active"
                  : ""
              }
              onClick={() => setVersion("fan")}
            >
              {lang.fan}
            </button>

            <button
              className={
                version === "player"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setVersion("player")
              }
            >
              {lang.player}
            </button>
          </div>

          <label className="select-label">
            {lang.size}

            <select
              value={size}
              onChange={(e) =>
                setSize(e.target.value)
              }
            >
              {["S", "M", "L", "XL", "XXL"].map(
                (s) => (
                  <option
                    key={s}
                    value={s}
                    disabled={!data.stock[s]}
                  >
                    {s}
                  </option>
                )
              )}
            </select>
          </label>

          <button
            className="add-cart-large"
            onClick={() =>
              onAdd(product, version, size)
            }
          >
            {lang.add}
          </button>
        </div>
      </div>
    </main>
  );
}

function CartDrawer({
  cart,
  total,
  lang,
  onClose,
  onChange,
  onRemove,
  onCheckout
}) {
  return (
    <div
      className="overlay"
      onClick={onClose}
    >
      <aside
        className="cart-drawer"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="cart-header">
          <h2>{lang.cart}</h2>

          <button onClick={onClose}>
            ×
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            {lang.empty}
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div
                  className="cart-item"
                  key={
                    item.key ||
                    `cart-${item.productId}-${item.version}-${item.size}`
                  }
                >
                  <img
                    src={item.image}
                    alt={item.player}
                  />

                  <div className="cart-item-info">
                    <h3>
                      {item.player} #
                      {item.number}
                    </h3>

                    <p>{item.team}</p>

                    <p>
                      {item.version === "player"
                        ? lang.player
                        : lang.fan}{" "}
                      · {item.size}
                    </p>

                    <strong>
                      {item.price * item.quantity} ₪
                    </strong>

                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          onChange(
                            item.key,
                            -1
                          )
                        }
                        disabled={
                          item.quantity <= 1
                        }
                      >
                        −
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          onChange(
                            item.key,
                            1
                          )
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-button"
                      onClick={() =>
                        onRemove(item.key)
                      }
                    >
                      {lang.remove}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <strong>
                {lang.total}: {total} ₪
              </strong>

              <button
                className="checkout-button"
                onClick={onCheckout}
              >
                {lang.checkout}
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function Checkout({
  lang,
  data,
  setData,
  payment,
  setPayment,
  total,
  onBack,
  onSubmit
}) {
  return (
    <main className="checkout-page">
      <button
        className="back-button"
        onClick={onBack}
      >
        ← {lang.back}
      </button>

      <div className="checkout-box">
        <h1>{lang.checkout}</h1>

        <form onSubmit={onSubmit}>
          <label>
            {lang.name}
            <input
              required
              value={data.name}
              onChange={(e) =>
                setData({
                  ...data,
                  name: e.target.value
                })
              }
            />
          </label>

          <label>
            {lang.phone}
            <input
              required
              value={data.phone}
              onChange={(e) =>
                setData({
                  ...data,
                  phone: e.target.value
                })
              }
            />
          </label>

          <label>
            {lang.city}
            <input
              required
              value={data.city}
              onChange={(e) =>
                setData({
                  ...data,
                  city: e.target.value
                })
              }
            />
          </label>

          <label>
            {lang.address}
            <textarea
              required
              value={data.address}
              onChange={(e) =>
                setData({
                  ...data,
                  address: e.target.value
                })
              }
            />
          </label>

          <label>
            {lang.payment}

            <select
              value={payment}
              onChange={(e) =>
                setPayment(e.target.value)
              }
            >
              <option value="cash">
                {lang.cash}
              </option>

              <option value="card">
                {lang.card}
              </option>
            </select>
          </label>

          <div className="checkout-total">
            {lang.total}: {total} ₪
          </div>

          <button
            type="submit"
            className="checkout-button"
          >
            {lang.send}
          </button>
        </form>
      </div>
    </main>
  );
}

export default App;
