let basketList = [];
let Shoelist=[];

const toggleModal = () => {          /* sepet panelini açıp kapama işlemi*/
  const basketModalEl = document.querySelector(".basket_modal");  
  basketModalEl.classList.toggle("active");   
};

const getShoe = () => {     /* json dosyasından veri alıp listemize atıyor*/
  fetch("./products.json")
    .then((res) => res.json())
    .then((Shoe) => (ShoeList = Shoe));
};

getShoe();

const createShoeStars = (starRate) => { /* yıldızları oluşturuyoruz*/
  let starRateHtml = "";
  for (let i = 1; i <= 5; i++) {
    if (Math.round(starRate) >= i)
      starRateHtml += `<i class="bi bi-star-fill active"></i>`;
    else starRateHtml += `<i class="bi bi-star-fill"></i>`;
  }

  return starRateHtml;
};

const createShoeItemsHtml = () => {
  const ShoeListEl = document.querySelector(".Shoe_list");
  let ShoeListHtml = "";
  ShoeList.forEach((Shoe, index) => {                                 /*1.veya 2. elamana gore modunu alıp sınır koyuyoruz*/
    ShoeListHtml += `<div class="col-5 ${index % 2 == 0 && "offset-2"} my-5"> 
    <div class="row Shoe_card">
      <div class="col-6">
        
      <img
          class="img-fluid shadow mt-5"
          src="${Shoe.imgSource}"
          alt=""
          width="258"
          height="400"
        >
       

      </div>
      <div class="col-6 d-flex flex-column justify-content-between">
        <div class="Shoe_detail">
          <span class="textType4">${Shoe.mark}</span><br />
          <a href="shoe.html">
          <span class="textType">${Shoe.name}</span><br />
          </a>
          <span class="Shoe_star-rate">
            ${createShoeStars(Shoe.starRate)}
            <span class="gray">${Shoe.reviewCount} Beğeni</span>
          </span>
        </div>
        <p class="Shoe_description fos gray">
          ${Shoe.description}
        </p>
        <div>
          <span class="textType3">${Shoe.price}₺</span>
          ${
            Shoe.oldPrice
              ? `<span class="fs-4 fw-bold old_price">${Shoe.oldPrice}</span>`
              : ""
          }
        </div>
        <button type="button" class="btn btn-outline-light" onclick="addShoeToBasket(${
            Shoe.id
        })">Sepete Ekle</button>
      </div>
    </div>
  </div>`;
  });

  ShoeListEl.innerHTML = ShoeListHtml;
};

const listBasketItems = () => { 
    localStorage.setItem("basketList", JSON.stringify(basketList));
    const basketListEl = document.querySelector(".basket_list");
    const basketCountEl = document.querySelector(".basket_count");
    basketCountEl.innerHTML = basketList.length > 0 ? basketList.length : null; /* sıfırdan buyukse basket lıstesının uzunlugunu yaz*/
    const totalPriceEl = document.querySelector(".total_price");
  
    let basketListHtml = "";
    let totalPrice = 0;
    basketList.forEach((item) => {  
      totalPrice += item.product.price * item.quantity;
      basketListHtml += `<li class="basket_item">
          <img
            src="${item.product.imgSource}"
            width="100"
            height="100"
          />
          <div class="basket_item-info">
            <h3 class="Shoe_name">${item.product.name}</h3>
            <span class="Shoe_price">${item.product.price}₺</span><br />
            <span class="Shoe_remove" onclick="removeItemToBasket(${item.product.id})">SİL</span>
          </div>
          <div class="Shoe_count">
            <span class="decrease" onclick="decreaseItemToBasket(${item.product.id})">-</span>
            <span class="my-5">${item.quantity}</span>
            <span class="increase" onclick="increaseItemToBasket(${item.product.id})">+</span>
          </div>
        </li>`;
    });  basketListEl.innerHTML = basketListHtml
    ? basketListHtml
    : `<li class="basket_item">Tekrar satın alınacak ürün yok.</li>`;
  totalPriceEl.innerHTML =
    totalPrice > 0 ? "Total : " + totalPrice.toFixed(2) + "₺" : null;
};
const addShoeToBasket = (ShoeId) => {                 /* sepete eleman ekledik*/
    let findedShoe = ShoeList.find((Shoe) => Shoe.id == ShoeId);
    if (findedShoe) {
      const basketAlreadyIndex = basketList.findIndex(
        (basket) => basket.product.id == ShoeId
      );
      if (basketAlreadyIndex == -1) {             /* sepette eleman yok ise ekler*/
        let addedItem = { quantity: 1, product: findedShoe };
        basketList.push(addedItem);
      } else {
        if (
          basketList[basketAlreadyIndex].quantity <
          basketList[basketAlreadyIndex].product.stock
        )
          basketList[basketAlreadyIndex].quantity += 1;
        else {
          
          return;
        }
      }
      listBasketItems();/* he çalıştıgında elemanları guncelle*/

    }
  };
setTimeout(() => {    /* veri geldikten sonra çalışması ıcın timeout koyduk*/
  createShoeItemsHtml();
  createShoeTypesHtml();
}, 100);
