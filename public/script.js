// Simpan data kandidat yang sudah ada
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

async function getVoteCount() {
  try {
    const [hasilOsis, hasilMpk] = await Promise.all([
      fetch("/api/get-suara-osis"),
      fetch("/api/get-suara-mpk"),
    ]);

    const dataOsis = await hasilOsis.json();
    const dataMpk = await hasilMpk.json();

    return { osis: dataOsis, mpk: dataMpk };
  } catch (error) {
    console.error("Error fetching vote count:", error);
    return null;
  }
}

async function submitVote(tipe, nomorPaslon) {
  try {
    const response = await fetch(`/api/submit-vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tipe: tipe,
        nomor_paslon: nomorPaslon,
      }),
    });

    if (!response.ok) {
      throw new Error("Vote submission failed");
    }

    return true;
  } catch (error) {
    console.error("Error submitting vote:", error);
    return false;
  }
}

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

async function vote(tipe, kandidatId) {
  if (Object.keys(votingState[tipe]).length > 0) {
    alert("Anda sudah memberikan suara!");
    return;
  }

  // Dapatkan nomor paslon dari ID (misalnya 'osis1' -> 1)
  const nomorPaslon = parseInt(kandidatId.replace(/[^\d]/g, ""));

  // Submit vote ke database
  const success = await submitVote(tipe, nomorPaslon);

  if (!success) {
    alert("Maaf, terjadi kesalahan. Silakan coba lagi.");
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

renderKandidat(kandidatOsis, "osis");
renderKandidat(kandidatMpk, "mpk");
