// DATA PRODUK (dengan link gambar baru)
const products = [
  {
    id:1,
    name:"Bucket Bunga Artificial",
    price:120000,
    category:"artificial",
    desc:"Bunga artificial premium dengan warna elegan.",
    img:"https://i.pinimg.com/736x/3b/9f/f3/3b9ff3c2e96147a520e49e122d33a51d.jpg"
  },
  {
    id:2,
    name:"Bucket Uang “Royal Gift”",
    price:1000000,
    category:"money",
    desc:"Bucket kreatif berisi uang kertas (100k × 10).",
    img:"https://i.pinimg.com/736x/50/a4/04/50a4046fe5160c4d87bc939967b20cb7.jpg"
  },
  {
    id:3,
    name:"Bucket Snack “Party Treats”",
    price:110000,
    category:"snack",
    desc:"Berisi aneka snack favorit—manis dan renyah.",
    img:"https://i.pinimg.com/736x/ac/1f/79/ac1f79a714f8f583e71fdf1d10710c4b.jpg"
  },
  {
    id:4,
    name:"Bucket Bunga Satin",
    price:125000,
    category:"satin",
    desc:"Bunga satin mewah cocok untuk hadiah spesial.",
    img:"https://i.pinimg.com/1200x/a9/2f/e8/a92fe8574636a8512dcbafbb044272ec.jpg"
  },
  {
    id:5,
    name:"Bucket Snack Jumbo",
    price:200000,
    category:"snack",
    desc:"Isi lebih banyak snack untuk momen spesial.",
    img:"https://i.pinimg.com/736x/a2/2f/2a/a22f2a2a122b009374923c7036dbb6f0.jpg"
  }
];


const grid = document.getElementById("grid");
const q = document.getElementById("q");
const filters = document.querySelectorAll("#filters .chip");

let cart = [];

// RENDER PRODUK
function renderProducts(list){
  grid.innerHTML = "";
  list.forEach(p=>{
    const el = document.createElement("div");
    el.className="card";
    el.innerHTML=`
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="price">Rp ${p.price.toLocaleString("id-ID")}</div>
      <button class="btn btn-primary" onclick="addToCart(${p.id})">+ Keranjang</button>
    `;
    grid.appendChild(el);
  });
}
renderProducts(products);

// FILTER PRODUK
filters.forEach(f=>{
  f.addEventListener("click", ()=>{
    filters.forEach(x=>x.classList.remove("is-active"));
    f.classList.add("is-active");
    const cat=f.dataset.filter;
    const text=q.value.toLowerCase();
    const filtered=products.filter(p=>
      (cat==="all"||p.category===cat) &&
      p.name.toLowerCase().includes(text)
    );
    renderProducts(filtered);
  });
});
q.addEventListener("input", ()=>{
  document.querySelector(".chip.is-active").click();
});

// CART FUNCTIONS
function addToCart(id){
  const item=cart.find(i=>i.id===id);
  if(item){ item.qty++; }
  else{
    const p=products.find(p=>p.id===id);
    cart.push({...p,qty:1});
  }
  updateCart();
  openCart();
}
function updateCart(){
  document.getElementById("cartCount").textContent=cart.reduce((s,i)=>s+i.qty,0);
  const wrap=document.getElementById("cartItems");
  wrap.innerHTML="";
  cart.forEach(i=>{
    const el=document.createElement("div");
    el.className="cart-item";
    el.innerHTML=`
      <img src="${i.img}">
      <div class="info">
        <div class="title">${i.name}</div>
        <div class="qty">
          <button onclick="changeQty(${i.id},-1)">-</button>
          <span>${i.qty}</span>
          <button onclick="changeQty(${i.id},1)">+</button>
        </div>
      </div>
      <div class="price">Rp ${(i.price*i.qty).toLocaleString("id-ID")}</div>
    `;
    wrap.appendChild(el);
  });
  const sub=cart.reduce((s,i)=>s+i.price*i.qty,0);
  document.getElementById("subtotal").textContent="Rp "+sub.toLocaleString("id-ID");
  const ship=sub>150000?0:10000;
  document.getElementById("shipping").textContent="Rp "+ship.toLocaleString("id-ID");
  document.getElementById("grand").textContent="Rp "+(sub+ship).toLocaleString("id-ID");
}
function changeQty(id,delta){
  const item=cart.find(i=>i.id===id);
  if(!item) return;
  item.qty+=delta;
  if(item.qty<=0) cart=cart.filter(i=>i.id!==id);
  updateCart();
}

// CART DRAWER
const drawer=document.getElementById("drawer");
function openCart(){ drawer.classList.add("active"); }
function closeCart(){ drawer.classList.remove("active"); }
document.getElementById("openCart").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
document.getElementById("closeCartBtn").onclick=closeCart;

// CHECKOUT
const checkoutModal=document.getElementById("checkoutModal");
function openCheckout(){
  if(cart.length===0) return alert("Keranjang kosong!");
  document.getElementById("sumCount").textContent=cart.reduce((s,i)=>s+i.qty,0)+" item";
  const sub=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const ship=sub>150000?0:10000;
  document.getElementById("sumTotal").textContent="Rp "+(sub+ship).toLocaleString("id-ID");
  checkoutModal.classList.add("active");
}
function closeCheckout(){ checkoutModal.classList.remove("active"); }
document.getElementById("checkoutBtn").onclick=openCheckout;
document.getElementById("closeCheckout").onclick=closeCheckout;
document.getElementById("xCheckout").onclick=closeCheckout;
document.getElementById("backToCart").onclick=closeCheckout;

// SUBMIT FORM
document.getElementById("checkoutForm").onsubmit=e=>{
  e.preventDefault();
  const id="GFT"+Date.now();
  document.getElementById("orderId").textContent=id;
  document.getElementById("checkoutForm").classList.add("hidden");
  document.getElementById("thanks").classList.remove("hidden");
  cart=[]; updateCart();
};
document.getElementById("closeThanks").onclick=()=>{
  document.getElementById("checkoutForm").reset();
  document.getElementById("checkoutForm").classList.remove("hidden");
  document.getElementById("thanks").classList.add("hidden");
  closeCheckout();
};
document.getElementById("printOrder").onclick=()=>window.print();

// YEAR
document.getElementById("y").textContent=new Date().getFullYear();
