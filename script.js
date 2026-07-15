const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz73DkEn1YxOA66Sc3Lrpq2DMEjOl3LkwQHDd0pNFgx_oxO4jSrv9gI6jAxr6o9SGpW/exec";

const booksData = {
  "الصف الأول الابتدائي": [
    { name: "كتاب اللغة العربية", price: 120 },
    { name: "كتاب الرياضيات", price: 110 },
    { name: "كتاب اللغة الإنجليزية", price: 130 }
  ],
  "الصف الثاني الابتدائي": [
    { name: "كتاب اللغة العربية", price: 125 },
    { name: "كتاب الرياضيات", price: 115 },
    { name: "كتاب اللغة الإنجليزية", price: 135 }
  ],
  "الصف الثالث الابتدائي": [
    { name: "كتاب اللغة العربية", price: 130 },
    { name: "كتاب الرياضيات", price: 120 },
    { name: "كتاب العلوم", price: 125 }
  ],
  "الصف الرابع الابتدائي": [
    { name: "كتاب اللغة العربية", price: 140 },
    { name: "كتاب الرياضيات", price: 135 },
    { name: "كتاب العلوم", price: 130 },
    { name: "كتاب الدراسات", price: 125 }
  ],
  "الصف الخامس الابتدائي": [
    { name: "كتاب اللغة العربية", price: 150 },
    { name: "كتاب الرياضيات", price: 145 },
    { name: "كتاب العلوم", price: 140 },
    { name: "كتاب الدراسات", price: 135 }
  ],
  "الصف السادس الابتدائي": [
    { name: "كتاب اللغة العربية", price: 160 },
    { name: "كتاب الرياضيات", price: 155 },
    { name: "كتاب العلوم", price: 150 },
    { name: "كتاب الدراسات", price: 145 }
  ],
  "الصف الأول الإعدادي": [
    { name: "كتاب اللغة العربية", price: 170 },
    { name: "كتاب الرياضيات", price: 165 },
    { name: "كتاب العلوم", price: 160 },
    { name: "كتاب الدراسات", price: 155 }
  ],
  "الصف الثاني الإعدادي": [
    { name: "كتاب اللغة العربية", price: 180 },
    { name: "كتاب الرياضيات", price: 175 },
    { name: "كتاب العلوم", price: 170 },
    { name: "كتاب الدراسات", price: 165 }
  ],
  "الصف الثالث الإعدادي": [
    { name: "كتاب اللغة العربية", price: 200 },
    { name: "كتاب الرياضيات", price: 195 },
    { name: "كتاب العلوم", price: 190 },
    { name: "كتاب الدراسات", price: 185 }
  ]
};

let selectedGrade = "";
let cart = {};

const gradesEl = document.getElementById("grades");
const booksList = document.getElementById("booksList");
const invoice = document.getElementById("invoice");
const totalEl = document.getElementById("total");
const searchInput = document.getElementById("searchInput");
const booksTitle = document.getElementById("booksTitle");

Object.keys(booksData).forEach(grade => {
  const div = document.createElement("div");
  div.className = "grade";
  div.textContent = grade;
  div.onclick = () => selectGrade(grade);
  gradesEl.appendChild(div);
});

function selectGrade(grade) {
  selectedGrade = grade;

  document.querySelectorAll(".grade").forEach(card => {
    card.classList.toggle("active", card.textContent === grade);
  });

  booksTitle.textContent = `كتب ${grade}`;
  renderBooks();
}

searchInput.addEventListener("input", renderBooks);

function renderBooks() {
  booksList.innerHTML = "";

  if (!selectedGrade) {
    booksList.innerHTML = "<p>اختار الصف الدراسي الأول.</p>";
    return;
  }

  const searchText = searchInput.value.trim().toLowerCase();

  const filteredBooks = booksData[selectedGrade].filter(book =>
    book.name.toLowerCase().includes(searchText)
  );

  if (filteredBooks.length === 0) {
    booksList.innerHTML = "<p>لا توجد كتب بهذا الاسم.</p>";
    return;
  }

  filteredBooks.forEach(book => {
    const key = `${selectedGrade}-${book.name}`;

    if (!cart[key]) {
      cart[key] = {
        grade: selectedGrade,
        name: book.name,
        price: book.price,
        qty: 0
      };
    }

    const div = document.createElement("div");
    div.className = "book";
    div.innerHTML = `
      <div>
        <h3>${book.name}</h3>
        <div class="price">${book.price} جنيه</div>
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

  if (cart[key].qty < 0) {
    cart[key].qty = 0;
  }

  renderBooks();
  renderInvoice();
}

function renderInvoice() {
  const items = Object.values(cart).filter(item => item.qty > 0);
  invoice.innerHTML = "";

  let total = 0;

  if (items.length === 0) {
    invoice.innerHTML = "<p>لم يتم اختيار كتب بعد.</p>";
  }

  items.forEach(item => {
    const lineTotal = item.qty * item.price;
    total += lineTotal;

    invoice.innerHTML += `
      <p>
        <strong>${item.grade}</strong><br>
        ${item.name}<br>
        ${item.qty} × ${item.price} = ${lineTotal} جنيه
      </p>
    `;
  });

  totalEl.textContent = `الإجمالي: ${total} جنيه`;
}

async function submitOrder() {
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const notes = document.getElementById("notes").value.trim();
  const message = document.getElementById("message");

  const items = Object.values(cart).filter(item => item.qty > 0);
  const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  if (!name || !phone) {
    alert("من فضلك اكتب الاسم ورقم الواتساب.");
    return;
  }

  if (items.length === 0) {
    alert("من فضلك اختار كتاب واحد على الأقل.");
    return;
  }

  const order = {
    name,
    phone,
    notes,
    items,
    total,
    status: "مدة تجهيز الطلب من 10 إلى 15 يوم، وسيتم التواصل مع العميل عند جاهزية الطلب"
  };

  message.textContent = "جاري إرسال الطلب...";

  await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(order)
  });

  message.textContent = "تم إرسال الطلب بنجاح ✅ سيتم التواصل معك عند جاهزية الطلب.";

  cart = {};
  renderBooks();
  renderInvoice();

  document.getElementById("customerName").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("notes").value = "";
}

renderBooks();
renderInvoice();
