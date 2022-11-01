var productList = {};
/*
{
  "name": "iphoneX",
  "price": "1000",
  "screen": "screen 68",
  "backCamera": "2 camera 12 MP",
  "frontCamera": "7 MP",
  "img": "https://cdn.tgdd.vn/Products/Images/42/114115/iphone-x-64gb-hh-600x600.jpg",
  "desc": "Thiết kế mang tính đột phá",
  "type": "iphone"
 }
 */

function getMobileList() {
  //gửi request xuống backend lấy ds sinh viên lên
  var promise = axios({
    url: "https://6336fc765327df4c43cdbeb7.mockapi.io/mobileStore",
    method: "GET",
  });

  promise
    .then(function (respone) {
      // lắng nghe backend trả dữ liệu về nếu backend ko trả được dữ liệu về thì sẽ nhảy vào hàm catch

      console.log(respone.data);
      productList = mapData(respone.data);
      console.log(productList);
      sortMobile();

      // renderMobile(mobileList);
    })
    .catch(function (err) {
      console.log(err);
    });
}
window.onload = function () {
  // code sẽ chạy khi window đc load lên
  // console.log("window load");

  getCartList();
  getMobileList();
};

function mapData(mobileListJSON) {
  var result = [];
  for (var i = 0; i < mobileListJSON.length; i++) {
    var oldList = mobileListJSON[i];
    var newList = new Product(
      oldList.name,
      oldList.price,
      oldList.screen,
      oldList.backCamera,
      oldList.frontCamera,
      oldList.img,
      oldList.desc,
      oldList.type
    );
    result.push(newList);
  }
  return result;
}

function renderMobile(data) {
  var tableHTML = "";

  for (var i = 0; i < data.length; i++) {
    var currentMobile = data[i];
    // console.log(currentMobile);
    tableHTML += `<div class="row py-3">
    <div class="content__left d-flex col-9">
      <div class="image">
        <img src='${currentMobile.img}' alt="" />
      </div>
      <div class="title">
        <h3>${currentMobile.name}</h3>
        <p>Screen:  ${currentMobile.screen}</p>
        <p>Back Camera:  ${currentMobile.backCamera}</p>
        <p>Front Camera: ${currentMobile.frontCamera}</p>
        <p>
        ${currentMobile.desc}
        </p>
        <p>${currentMobile.type}</p>
      </div>
    </div>
    <div class="content__right px-5 col-3">
      <div class="content__price">${currentMobile.price}</span></div>
      <div class="content__button">
        <button onclick="addCart('${currentMobile.name}')">Add to cart</button>
      </div>
    </div>
  </div>`;
  }
  document.getElementById("detailMobile").innerHTML = tableHTML;
}

function sortMobile() {
  var x = document.getElementById("choice").value;
  var sortedMobileList = [];
  var isSame = false;
  for (var i = 0; i < productList.length; i++) {
    if (productList[i].type === x) {
      sortedMobileList.push(productList[i]);
      console.log(x);
      isSame = true;
    }
  }
  if (isSame) {
    renderMobile(sortedMobileList);
  } else {
    renderMobile(productList);
  }
}

// var cartList = [{ quantity: 1, Product: { id: 1, name: "hieu", price: 123 } }];

cartList = []; //chứa các object cartItem {product: Array(4), quantity: 1}

function addCart(data) {
  let Product = getProductByName(data); //đag là 1 object
  let totalQuantity = 0;
  let itemPrice = 0;
  let totalPrice = 0;
  const cartItem = {
    Product: Product,
    quantity: 1,
  };
  // let newCart = new cartItem({ Product, quantity });

  let itemProduct = cartList.find((item) => item.Product.name === data); //bắt buộc phải vậy
  console.log(itemProduct);

  if (itemProduct) {
    itemProduct.quantity += 1;
  } else {
    cartList.push({ Product, quantity: 1 });
    // cartList.push({ newCart });
  }

  console.log(cartList);

  for (item of cartList) {
    totalQuantity += item.quantity;
    itemPrice = item.Product.price;
    // itemPrice = item.Product.price.replace("$", "");
    totalPrice += itemPrice * item.quantity;
    // console.log(totalPrice);
  }

  document.getElementById("cart-item").innerHTML = `${totalQuantity} item `;
  document.getElementById("cart-quantity").innerHTML = totalQuantity;
  document.getElementById("total-price").innerHTML = `$${totalPrice}`;
  saveCartList();
  renderCartList();
}

function getProductByName(data) {
  for (var i = 0; i < productList.length; i++) {
    if (productList[i].name === data) {
      return productList[i];
    }
  }
}

//---------------------------------------------
const cartBtn = document.getElementById("cart-btn");
const cartSidebar = document.getElementById("cart-sidebar");
const closeBtn = document.getElementById("close-btn");
cartBtn.addEventListener("click", () => {
  cartSidebar.classList.add("show");
});

closeBtn.addEventListener("click", () => {
  cartSidebar.classList.remove("show");
});
//----------------------------------------------

function changeQuantity(username, size, quantityID) {
  let cartListItem = cartList.find((item) => item.Product.name === username);
  let totalQuantity = 0;
  let itemPrice = 0;
  let totalPrice = 0;

  console.log(cartListItem);
  cartListItem.quantity += size;
  if (cartListItem.quantity < 1) {
    cartListItem.quantity = 1;
    return;
  }

  for (item of cartList) {
    totalQuantity += item.quantity;
    itemPrice = item.Product.price;
    // itemPrice = item.Product.price.replace("$", "");
    totalPrice += itemPrice * item.quantity;
    // console.log(totalPrice);
  }

  console.log(cartListItem.quantity);
  document.getElementById("cart-item").innerHTML = `${totalQuantity} item `;
  document.getElementById(quantityID).innerHTML = cartListItem.quantity;
  document.getElementById("total-price").innerHTML = `$${totalPrice}`;
  document.getElementById("cart-quantity").innerHTML = totalQuantity;
  saveCartList();
}

function removeQuantity(data) {
  let totalQuantity = 0;
  let itemPrice = 0;
  let totalPrice = 0;

  for (index in cartList) {
    if (cartList[index].Product.name === data) {
      cartList.splice(index, 1);
    }
  }
  for (item of cartList) {
    totalQuantity += item.quantity;
    itemPrice = item.Product.price;
    // itemPrice = item.Product.price.replace("$", "");
    totalPrice += itemPrice * item.quantity;
    console.log(totalPrice);
  }
  document.getElementById("cart-item").innerHTML = `${totalQuantity} item `;
  document.getElementById("total-price").innerHTML = `$${totalPrice}`;
  document.getElementById("cart-quantity").innerHTML = totalQuantity;
  console.log(cartList);
  saveCartList();
  renderCartList();
}

//------------------------------------------------
function renderCartList() {
  let tableHTML = "";
  for (let i = 0; i < cartList.length; i++) {
    let currentCartList = cartList[i];
    tableHTML += `<div class="product">
    <div class="details">
      <img src="${currentCartList.Product.img}" alt="iphone 13" class="product-img" />
      <div class="product-info">
        <p class="product-name">${currentCartList.Product.name}</p>
        <p class="product-price">${currentCartList.Product.price}</p>
      </div>
    </div>
    <div class="controls">
      <div class="quantity">
        <button onclick="changeQuantity('${currentCartList.Product.name}',-1,'Quantity-${currentCartList.Product.name}')" id="quantity-minus" class="decrement-btn">
          <i class="fa-solid fa-minus fa-sm"></i>
        </button>
        <p id="Quantity-${currentCartList.Product.name}" class="quantity-num">${currentCartList.quantity}</p>
        <button onclick="changeQuantity('${currentCartList.Product.name}',1,'Quantity-${currentCartList.Product.name}')" id="quantity-plus" class="increment-btn">
          <i class="fa-solid fa-plus fa-sm""></i>
        </button>
      </div>
      <button onclick="removeQuantity('${currentCartList.Product.name}')" class="trash-btn">
        <i class="fa-solid fa-trash-can fa-lg"></i>
      </button>
    </div>
  </div>`;
  }
  // console.log(tableHTML);
  document.getElementById("cart-products").innerHTML = tableHTML;
}

//---------------------------------
function saveCartList() {
  let cartListJSON = JSON.stringify(cartList);
  localStorage.setItem("CartList", cartListJSON);
}

function getCartList() {
  // Chuyển từ mảng có chuỗi JSON sang mảng chứa object
  // studentList = JSON.parse(studentListJSON);
  // Sau đó dùng mapData để thêm phương thức

  let cartListJSON = localStorage.getItem("CartList");
  if (!cartListJSON) return;
  cartList = JSON.parse(cartListJSON);

  let totalQuantity = 0;
  let itemPrice = 0;
  let totalPrice = 0;

  for (item of cartList) {
    totalQuantity += item.quantity;
    itemPrice = item.Product.price;
    // itemPrice = item.Product.price.replace("$", "");
    totalPrice += itemPrice * item.quantity;
    // console.log(totalPrice);
  }

  document.getElementById("cart-quantity").innerHTML = totalQuantity;
  document.getElementById("cart-item").innerHTML = `${totalQuantity} item `;
  document.getElementById("total-price").innerHTML = `$${totalPrice}`;

  renderCartList();
}

//----------------------------------
function checkOutCart() {
  alert("Bạn đã thanh toán thành công");
  cartList = [];
  saveCartList();
  let totalQuantity = 0;
  let itemPrice = 0;
  let totalPrice = 0;

  for (item of cartList) {
    totalQuantity += item.quantity;
    itemPrice = item.Product.price;
    // itemPrice = item.Product.price.replace("$", "");
    totalPrice += itemPrice * item.quantity;
    // console.log(totalPrice);
  }

  document.getElementById("cart-quantity").innerHTML = totalQuantity;
  document.getElementById("cart-item").innerHTML = `${totalQuantity} item `;
  document.getElementById("total-price").innerHTML = `$${totalPrice}`;

  renderCartList();
}
