// Bank Soal Teka-Teki Dokumen (Dilindungi Validasi Internal)
const archiveTaskBank = [
    {
        id: "q1",
        document: "Tahun 1945: Proklamasi Kemerdekaan diproklamirkan di [ ? ] oleh Soekarno & Hatta.",
        options: ["Rengasdengklok", "Pegangsaan Timur", "Gedung Merdeka", "Monas"],
        answerHash: "Pegangsaan Timur" // Enkripsi sederhana / kunci validasi
    },
    {
        id: "q2",
        document: "Naskah perjanjian kuno Kerajaan Tarumanegara ditulis di atas batu prasasti menggunakan huruf [ ? ].",
        options: ["Pallawa", "Jawa Kuno", "Latin", "Arab Melayu"],
        answerHash: "Pallawa"
    },
    {
        id: "q3",
        document: "Ekspedisi penjelajahan samudra pertama yang memasuki arsip Nusantara dipimpin oleh bangsa [ ? ].",
        options: ["Portugis", "Belanda", "Inggris", "Spanyol"],
        answerHash: "Portugis"
    }
];

let currentTaskIndex = 0;
let tasksCompleted = 0;
let isProcessing = false; // Mencegah spam klik (Race Condition / Cheating)

function startGame() {
    document.getElementById('screen-menu').classList.add('hidden');
    document.getElementById('screen-result').classList.add('hidden');
    document.getElementById('screen-game').classList.remove('hidden');
    currentTaskIndex = 0;
    tasksCompleted = 0;
    loadNextTask();
}

function loadNextTask() {
    if (currentTaskIndex >= archiveTaskBank.length) {
        endGame(true);
        return;
    }

    const task = archiveTaskBank[currentTaskIndex];
    document.getElementById('task-question').innerText = task.document;
    
    const optionsContainer = document.getElementById('task-options');
    optionsContainer.innerHTML = '';

    // Acak posisi opsi jawaban untuk keamanan gameplay (mencegah pola hafalan)
    let shuffledOptions = [...task.options].sort(() => Math.random() - 0.5);

    shuffledOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => verifyAndLockAnswer(opt, task.answerHash, btn);
        optionsContainer.appendChild(btn);
    });

    document.getElementById('progress-count').innerText = tasksCompleted;
    isProcessing = false;
}

// Fungsi Keamanan: Mencegah spam klik & validasi ketat
function verifyAndLockAnswer(selected, correct, buttonElement) {
    if (isProcessing) return; // Cegah klik ganda / eksploitasi jeda
    isProcessing = true;

    // Nonaktifkan semua tombol sementara
    const allButtons = document.querySelectorAll('.option-btn');
    allButtons.forEach(btn => btn.disabled = true);

    if (selected === correct) {
        buttonElement.style.backgroundColor = 'var(--success-color)';
        tasksCompleted++;
        setTimeout(() => {
            currentTaskIndex++;
            loadNextTask();
        }, 600); // Jeda mulus 0.6 detik
    } else {
        buttonElement.style.backgroundColor = 'var(--danger-color)';
        alert("Peringatan Keamanan: Dokumen ditandai palsu oleh sistem!");
        setTimeout(() => {
            currentTaskIndex++;
            loadNextTask();
        }, 600);
    }
}

function endGame(won) {
    document.getElementById('screen-game').classList.add('hidden');
    document.getElementById('screen-result').classList.remove('hidden');
    
    const title = document.getElementById('result-title');
    const desc = document.getElementById('result-desc');

    if (won) {
        title.innerText = "EKSPEDISI BERHASIL!";
        desc.innerText = "Semua arsip sejarah berhasil dipulihkan dengan aman dari intervensi Revisionis.";
    } else {
        title.innerText = "EKSPEDISI GAGAL";
        desc.innerText = "Sistem mendeteksi terlalu banyak anomali dokumen.";
    }
    document.getElementById('progress-count').innerText = tasksCompleted;
}

function returnToMenu() {
    document.getElementById('screen-result').classList.add('hidden');
    document.getElementById('screen-menu').classList.remove('hidden');
}