const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz73DkEn1YxOA66Sc3Lrpq2DMEjOl3LkwQHDd0pNFgx_oxO4jSrv9gI6jAxr6o9SGpW/exec";

const booksData = {
  "الصف الأول الابتدائي": [
    { name: "كتاب اللغة العربية", price: 120 },
    { name: "كتاب الرياضيات", price: 110 },
    { name: "كتاب اللغة الإنجليزية", price: 130 }
  ],
  "الصف الثاني الابتدائي": [
    { name: "كتاب العربي", price: 125 },
    { name: "كتاب الرياضيات", price: 115 }
  ],
  "الصف الثالث الابتدائي": [
    { name: "كتاب العربي", price: 130 },
    { name: "كتاب العلوم", price: 120 }
  ],
  "الصف الرابع الابتدائي": [
    { name: "كتاب العربي", price: 140 },
    { name: "كتاب الدراسات", price: 120 }
  ],
  "الصف الخامس الابتدائي": [
    { name: "كتاب العربي", price: 150 },
    { name: "كتاب الرياضيات", price: 140 }
  ],
  "الصف السادس الابتدائي": [
    { name: "كتاب العربي", price: 160 },
    { name: "كتاب العلوم", price: 150 }
  ],
  "الصف الأول الإعدادي": [
    { name: "كتاب العربي", price: 170 },
    { name: "كتاب الرياضيات", price: 160 }
  ],
  "الصف الثاني الإعدادي": [
    { name: "كتاب العربي", price: 180 },
    { name: "كتاب العلوم", price: 170 }
  ],
  "الصف الثالث الإعدادي": [
    { name: "كتاب العربي", price: 200 },
    { name: "كتاب الرياضيات", price: 190 }
  ]
};

let cart = {};

const gradeSelect = document.getElementById("gradeSelect");
const booksList = document.getElementById("booksList");
const invoice = document.getElementById("invoice");
const totalEl = document.getElementById("total");

Object.keys(booksData).forEach(grade => {
  const option = document.createElement("option");
  option.value = grade;
  option.textContent = grade;
  gradeSelect.appendChild(option);
});

gradeSelect.addEventListener("change", () => {
  renderBooks(gradeSelect.value);
});

function renderBooks(grade) {
  booksList.innerHTML = "";

  if (!grade) return;

  booksData[grade].forEach(book => {
    const key = `${grade}-${book.name}`;
    if (!cart[key]) cart[key] = { ...book, grade, qty: 0 };

    const div = document.createElement("div");
    div.className = "book";
    div.innerHTML = `
      <div>
        <strong>${book.name}</strong>
        <br>
        <small>${book.price} جنيه</small>
      </div>
      <div class="qty">
        <button onclick="changeQty('${key}', -1)">-</button>
        <span>${cart[key].qty}</span>
        <button onclick="changeQty('${key}', 1)">+</button>
      </div>
    `;
    booksList.appendChild(div);
  });
}

function changeQty(key, amount) {
  cart[key].qty += amount;
  if (cart[key].qty < 0) cart[key].qty = 0;

  renderBooks(gradeSelect.value);
  renderInvoice();
}

function renderInvoice() {
  invoice.innerHTML = "";
  let total = 0;

  Object.values(cart).forEach(item => {
    if (item.qty > 0) {
      const lineTotal = item.qty * item.price;
      total += lineTotal;

      invoice.innerHTML += `
        <p>
          ${item.grade} - ${item.name}
          × ${item.qty}
          = ${lineTotal} جنيه
        </p>
      `;
    }
  });

  totalEl.textContent = `الإجمالي: ${total} جنيه`;
}

async function submitOrder() {
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const notes = document.getElementById("notes").value.trim();

  const items = Object.values(cart).filter(item => item.qty > 0);
  const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  if (!name || !phone || items.length === 0) {
    alert("من فضلك اكتب الاسم ورقم التليفون واختار كتب.");
    return;
  }

  const order = {
    name,
    phone,
    notes,
    items,
    total,
    status: "الطلب يتجهز خلال 10 إلى 15 يوم"
  };

  await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(order)
  });

  document.getElementById("message").textContent =
    "تم إرسال الطلب بنجاح. هنكلمك لما الطلب يجهز.";
}
