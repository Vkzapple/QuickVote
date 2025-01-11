const kandidatOsis = [
  {
    id: "osis1",
    nama: "Abdul XI Sija & Rosyid X Tp II",
    visi: "MENJADIKAN ANGGOTA OSIS-MPK SMK NEGERI 1 JAKARTA SEBAGAI...",
    foto: "./assets/paslon1.jpeg",
  },
  {
    id: "osis2",
    nama: "Araechpaet XI Rpl & Tasya X Dkv",
    visi: "MENGEMBANGKAN OSIS SMK NEGERI 1 JAKARTA SEBAGAI....",
    foto: "./assets/paslon2.png",
  },
  {
    id: "osis3",
    nama: "Ikhsan XI Tkp II & Adam X Tkr I",
    visi: "MEMBUAT OSIS SMK NEGERI 1 JAKARTA LEBIH DIKENAL...",
    foto: "./assets/paslon3.jpeg",
  },
];

const kandidatMpk = [
  {
    id: "mpk1",
    nama: "Rakha XI DPIB II",
    visi: "Menjadikan MPK sebagai organisasi legislatif...",
    foto: "./assets/mpk1.jpeg",
  },
  {
    id: "mpk2",
    nama: "Kenichi XI TITL III",
    visi: "Menjadi pemimpin yang dapat dipercaya...",
    foto: "./assets/mpk2.jpeg",
  },
];

const votingState = { osis: {}, mpk: {} };
let tahapSaatIni = "osis";

function renderKandidat(kandidat, tipe) {
  const container = document.getElementById(
    `kandidat${tipe.charAt(0).toUpperCase() + tipe.slice(1)}`
  );
  container.innerHTML = "";

  kandidat.forEach((k) => {
    const card = document.createElement("div");
    card.className = "kandidat-card";
    card.innerHTML = `
                    <img src="${k.foto}" alt="${k.nama}">
                    <h3>${k.nama}</h3>
                    <p>${k.visi}</p>
                    <button 
                        onclick="vote('${tipe}', '${k.id}')" 
                        class="vote-btn" 
                        id="btn-${k.id}">Pilih
                    </button>
                `;
    container.appendChild(card);
  });
}

function showThankYouPopup() {
  const popup = document.createElement("div");
  popup.className = "thank-you-popup";

  let countdown = 5;
  popup.innerHTML = `
    <div class="popup-content">
      <h2>Terimakasih sudah vote!</h2>
      <p>Suaramu sangat berharga!</p>
      <p class="countdown">Kembali ke halaman utama dalam <span>${countdown}</span> detik</p>
    </div>
  `;

  document.body.appendChild(popup);

  const countdownInterval = setInterval(() => {
    countdown--;
    const countdownSpan = popup.querySelector(".countdown span");
    countdownSpan.textContent = countdown;

    if (countdown <= 0) {
      clearInterval(countdownInterval);
      window.location.href = "index.html";
    }
  }, 1000);
}

function vote(tipe, kandidatId) {
  if (Object.keys(votingState[tipe]).length > 0) {
    alert("Anda sudah memberikan suara!");
    return;
  }

  votingState[tipe][kandidatId] = 1;

  document
    .querySelectorAll(
      `#kandidat${tipe.charAt(0).toUpperCase() + tipe.slice(1)} .vote-btn`
    )
    .forEach((btn) => {
      btn.disabled = true;
    });

  if (tipe === "osis") {
    document.getElementById("tahapOsis").style.display = "none";
    document.getElementById("tahapMpk").style.display = "block";
    tahapSaatIni = "mpk";
  } else {
    document.getElementById("tahapMpk").style.display = "none";
    showThankYouPopup();
  }
}

// Inisialisasi
renderKandidat(kandidatOsis, "osis");
renderKandidat(kandidatMpk, "mpk");
