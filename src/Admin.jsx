import { useState } from "react";
import products from "./data/products";

function Admin() {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("jy-admin") === "true"
  );

  const [password, setPassword] = useState("");

  const [adminProducts, setAdminProducts] =
    useState(() => {
      try {
        const saved =
          localStorage.getItem(
            "jy-market-products"
          );

        return saved
          ? JSON.parse(saved)
          : products;
      } catch {
        return products;
      }
    });

  const [orders, setOrders] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(
          "jy-market-orders"
        ) || "[]"
      );
    } catch {
      return [];
    }
  });

  function login(e) {
    e.preventDefault();

    if (password === "1234") {
      localStorage.setItem(
        "jy-admin",
        "true"
      );

      setLoggedIn(true);
      setPassword("");
    } else {
      alert("كلمة المرور غير صحيحة");
    }
  }

  function logout() {
    localStorage.removeItem("jy-admin");
    setLoggedIn(false);
  }

  function saveProducts() {
    localStorage.setItem(
      "jy-market-products",
      JSON.stringify(adminProducts)
    );

    alert("تم حفظ التعديلات");
  }

  function updatePrice(
    productId,
    version,
    value
  ) {
    setAdminProducts((current) =>
      current.map((p) =>
        p.id === productId
          ? {
              ...p,
              versions: {
                ...p.versions,
                [version]: {
                  ...p.versions[version],
                  price: Number(value)
                }
              }
            }
          : p
      )
    );
  }

  function updateStock(
    productId,
    version,
    size,
    value
  ) {
    setAdminProducts((current) =>
      current.map((p) =>
        p.id === productId
          ? {
              ...p,
              versions: {
                ...p.versions,
                [version]: {
                  ...p.versions[version],
                  stock: {
                    ...p.versions[version]
                      .stock,
                    [size]: Number(value)
                  }
                }
              }
            }
          : p
      )
    );
  }

  function updateOrder(
    orderNumber,
    status
  ) {
    const updated = orders.map(
      (order) =>
        order.orderNumber ===
        orderNumber
          ? {
              ...order,
              status
            }
          : order
    );

    setOrders(updated);

    localStorage.setItem(
      "jy-market-orders",
      JSON.stringify(updated)
    );
  }

  function deleteOrder(orderNumber) {
    if (
      !confirm(
        "هل تريد حذف هذا الطلب؟"
      )
    ) {
      return;
    }

    const updated = orders.filter(
      (order) =>
        order.orderNumber !==
        orderNumber
    );

    setOrders(updated);

    localStorage.setItem(
      "jy-market-orders",
      JSON.stringify(updated)
    );
  }

  if (!loggedIn) {
    return (
      <div className="admin-login">
        <div className="admin-login-box">
          <h1>JY Market</h1>
          <h2>Admin Panel</h2>

          <form onSubmit={login}>
            <label>
              كلمة المرور

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
              />
            </label>

            <button type="submit">
              دخول
            </button>
          </form>

          <a href="/">
            العودة للمتجر
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>JY Market</h1>
          <p>لوحة تحكم المتجر</p>
        </div>

        <div className="admin-actions">
          <a href="/">المتجر</a>
          <button onClick={logout}>
            خروج
          </button>
        </div>
      </header>

      <main className="admin-content">
        <section>
          <div className="admin-top">
            <div>
              <h2>الطلبات</h2>
              <p>
                عدد الطلبات:{" "}
                {orders.length}
              </p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="no-orders">
              لا توجد طلبات حتى الآن
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div
                  className="order-card"
                  key={
                    order.orderNumber
                  }
                >
                  <div className="order-header">
                    <div>
                      <h3>
                        {
                          order.orderNumber
                        }
                      </h3>

                      <small>
                        {new Date(
                          order.createdAt
                        ).toLocaleString()}
                      </small>
                    </div>

                    <select
                      value={
                        order.status ||
                        "new"
                      }
                      onChange={(e) =>
                        updateOrder(
                          order.orderNumber,
                          e.target.value
                        )
                      }
                    >
                      <option value="new">
                        جديد
                      </option>

                      <option value="processing">
                        قيد التجهيز
                      </option>

                      <option value="shipped">
                        تم الشحن
                      </option>

                      <option value="completed">
                        مكتمل
                      </option>
                    </select>
                  </div>

                  <div className="order-customer">
                    <p>
                      <b>الاسم:</b>{" "}
                      {
                        order.customer
                          .name
                      }
                    </p>

                    <p>
                      <b>الهاتف:</b>{" "}
                      {
                        order.customer
                          .phone
                      }
                    </p>

                    <p>
                      <b>المدينة:</b>{" "}
                      {
                        order.customer
                          .city
                      }
                    </p>

                    <p>
                      <b>العنوان:</b>{" "}
                      {
                        order.customer
                          .address
                      }
                    </p>
                  </div>

                  {(order.items || []).map(
                    (item, index) => (
                      <div
                        className="order-item"
                        key={`${order.orderNumber}-${item.productId}-${item.version}-${item.size}-${index}`}
                      >
                        <img
                          src={item.image}
                          alt={
                            item.player
                          }
                        />

                        <div>
                          <b>
                            {
                              item.player
                            }{" "}
                            #
                            {
                              item.number
                            }
                          </b>

                          <p>
                            {
                              item.team
                            }
                          </p>

                          <p>
                            {
                              item.version ===
                              "player"
                                ? "نسخة لاعب"
                                : "نسخة مشجع"
                            }{" "}
                            ·{" "}
                            {
                              item.size
                            }{" "}
                            ·{" "}
                            {
                              item.quantity
                            }
                          </p>
                        </div>
                      </div>
                    )
                  )}

                  <div className="order-footer">
                    <strong>
                      المجموع:{" "}
                      {order.total} ₪
                    </strong>

                    <button
                      className="delete-order"
                      onClick={() =>
                        deleteOrder(
                          order.orderNumber
                        )
                      }
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="admin-top">
            <div>
              <h2>
                المنتجات والمخزون
              </h2>

              <p>
                عدّل الأسعار والمخزون.
              </p>
            </div>

            <button
              className="save-button"
              onClick={
                saveProducts
              }
            >
              حفظ التعديلات
            </button>
          </div>

          <div className="admin-products">
            {adminProducts.map(
              (product) => (
                <div
                  className="admin-product"
                  key={product.id}
                >
                  <div className="admin-product-main">
                    <img
                      src={
                        product.images[0]
                      }
                      alt={
                        product.player
                      }
                    />

                    <div>
                      <h3>
                        {
                          product.player
                        }{" "}
                        #
                        {
                          product.number
                        }
                      </h3>

                      <p>
                        {
                          product.team
                        }
                      </p>
                    </div>
                  </div>

                  {[
                    "fan",
                    "player"
                  ].map(
                    (version) => (
                      <div
                        className="admin-version"
                        key={
                          version
                        }
                      >
                        <h4>
                          {version ===
                          "fan"
                            ? "نسخة مشجع"
                            : "نسخة لاعب"}
                        </h4>

                        <label>
                          السعر

                          <input
                            type="number"
                            min="0"
                            value={
                              product
                                .versions[
                                version
                              ].price
                            }
                            onChange={(e) =>
                              updatePrice(
                                product.id,
                                version,
                                e.target
                                  .value
                              )
                            }
                          />
                        </label>

                        <div className="admin-stock">
                          {[
                            "S",
                            "M",
                            "L",
                            "XL",
                            "XXL"
                          ].map(
                            (size) => (
                              <label
                                key={
                                  size
                                }
                              >
                                {size}

                                <input
                                  type="number"
                                  min="0"
                                  value={
                                    product
                                      .versions[
                                      version
                                    ]
                                      .stock[
                                      size
                                    ]
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    updateStock(
                                      product.id,
                                      version,
                                      size,
                                      e.target
                                        .value
                                    )
                                  }
                                />
                              </label>
                            )
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Admin;
