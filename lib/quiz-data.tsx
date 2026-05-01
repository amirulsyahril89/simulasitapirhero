import {
  Home,
  History,
  Bookmark,
  Scissors,
  ClipboardPaste,
  Copy,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import React from 'react';

export type Option = {
  id: string;
  text?: React.ReactNode;
  icon?: React.ReactNode;
  isCorrect: boolean;
};

export type Question = {
  id: number;
  text: string;
  options: Option[];
  explanation: string;
};

const TrueFalseOptions: Option[] = [
  { id: 't', text: 'Betul', icon: <CheckCircle2 className="w-6 h-6 text-green-500" />, isCorrect: true },
  { id: 'f', text: 'Salah', icon: <XCircle className="w-6 h-6 text-red-500" />, isCorrect: false },
];

const FalseTrueOptions: Option[] = [
  { id: 't', text: 'Betul', icon: <CheckCircle2 className="w-6 h-6 text-green-500" />, isCorrect: false },
  { id: 'f', text: 'Salah', icon: <XCircle className="w-6 h-6 text-red-500" />, isCorrect: true },
];

export const quizData: Question[] = [
  {
    id: 1,
    text: 'Pilih simbol yang betul untuk \n\n"Kembali ke skrin utama".',
    options: [
      { id: 'o1', text: 'Home', icon: <Home className="w-12 h-12" />, isCorrect: true },
      { id: 'o2', text: 'History', icon: <History className="w-12 h-12" />, isCorrect: false },
      { id: 'o3', text: 'Bookmark', icon: <Bookmark className="w-12 h-12" />, isCorrect: false },
    ],
    explanation: 'Simbol Rumah (Home) digunakan untuk kembali ke muka surat utama pelayar web anda.',
  },
  {
    id: 2,
    text: 'Anda tidak menandakan halaman web yang dilayari semalam. Sekarang, anda mahu kembali ke laman web tersebut. Butang manakah yang harus anda klik?',
    options: [
      { id: 'o1', text: 'Bookmark', icon: <Bookmark className="w-12 h-12" />, isCorrect: false },
      { id: 'o2', text: 'History', icon: <History className="w-12 h-12" />, isCorrect: true },
      { id: 'o3', text: 'Home', icon: <Home className="w-12 h-12" />, isCorrect: false },
    ],
    explanation: 'Butang Sejarah (History) membolehkan anda melihat senarai laman web yang telah anda lawati sebelum ini.',
  },
  {
    id: 3,
    text: 'Pilih simbol yang betul untuk "Menanda laman web penting".',
    options: [
      { id: 'o1', text: 'History', icon: <History className="w-12 h-12" />, isCorrect: false },
      { id: 'o2', text: 'Home', icon: <Home className="w-12 h-12" />, isCorrect: false },
      { id: 'o3', text: 'Bookmark', icon: <Bookmark className="w-12 h-12" />, isCorrect: true },
    ],
    explanation: 'Simbol Penanda Buku (Bookmark) biasanya berbentuk bintang. Ia digunakan untuk menyimpan alamat laman web untuk rujukan mudah pada masa akan datang.',
  },
  {
    id: 4,
    text: 'Anda sedang bertugas di makmal komputer sekolah anda. Adakah tindakan berikut betul atau salah?\n\n"Memasang perisian tanpa kebenaran guru."',
    options: FalseTrueOptions,
    explanation: 'Kita tidak boleh memasang sebarang perisian tanpa kebenaran guru untuk mengelakkan virus atau perisian berbahaya masuk ke dalam komputer sekolah.',
  },
  {
    id: 5,
    text: 'Anda sedang bertugas di makmal komputer sekolah anda. Adakah tindakan berikut betul atau salah?\n\n"Makan dan minum di dalam makmal komputer."',
    options: FalseTrueOptions,
    explanation: 'Makanan dan minuman boleh merosakkan peralatan komputer jika tertumpah. Sentiasa pastikan tangan anda bersih dan kering.',
  },
  {
    id: 6,
    text: 'Anda sedang bertugas di makmal komputer sekolah anda. Adakah tindakan berikut betul atau salah?\n\n"Bawa balik tetikus sekolah ke rumah."',
    options: FalseTrueOptions,
    explanation: 'Peralatan makmal adalah hak milik sekolah dan untuk kegunaan bersama. Ia tidak boleh dibawa pulang.',
  },
  {
    id: 7,
    text: 'Anda sedang bertugas di makmal komputer sekolah anda. Adakah tindakan berikut betul atau salah?\n\n"Menukar tetapan (settings) komputer tanpa kebenaran guru."',
    options: FalseTrueOptions,
    explanation: 'Menukar tetapan boleh menyebabkan komputer tidak berfungsi dengan baik untuk pengguna seterusnya. Hanya guru yang patut menukar tetapan jika perlu.',
  },
  {
    id: 8,
    text: 'Anda sedang bertugas di makmal komputer sekolah anda. Adakah tindakan berikut betul atau salah?\n\n"Menggunakan komputer semasa ribut petir."',
    options: FalseTrueOptions,
    explanation: 'Sangat berbahaya menggunakan komputer atau peralatan elektrik semasa ribut petir kerana risiko renjatan elektrik atau kerosakan akibat kilat.',
  },
  {
    id: 9,
    text: 'Anda sedang bertugas di makmal komputer sekolah anda. Adakah tindakan berikut betul atau salah?\n\n"Jangan mencetak kecuali anda benar-benar perlu."',
    options: TrueFalseOptions,
    explanation: 'Ini adalah amalan yang baik untuk menjimatkan kertas dan dakwat, serta menjaga alam sekitar.',
  },
  {
    id: 10,
    text: 'Anda sedang bertugas di makmal komputer sekolah anda. Adakah tindakan berikut betul atau salah?\n\n"Meninggikan bunyi di dalam makmal komputer."',
    options: FalseTrueOptions,
    explanation: 'Makmal komputer adalah tempat untuk belajar. Kita perlu senyap dan menghormati pengguna lain yang sedang fokus.',
  },
  {
    id: 11,
    text: 'Anda sedang bertugas di makmal komputer sekolah anda. Adakah tindakan berikut betul atau salah?\n\n"Mencabut pemacu pena (pen drive) semasa sedang memindahkan fail."',
    options: FalseTrueOptions,
    explanation: 'Mencabut pemacu pena semasa proses sedang berjalan boleh merosakkan fail anda atau pemacu pena tersebut. Sentiasa "Eject" dengan selamat terlebih dahulu.',
  },
  {
    id: 12,
    text: 'Anda sedang bertugas di makmal komputer sekolah anda. Adakah tindakan berikut betul atau salah?\n\n"Menutup (shut down) komputer yang tidak digunakan sebelum keluar dari makmal."',
    options: TrueFalseOptions,
    explanation: 'Menutup komputer dengan cara yang betul menjimatkan elektrik dan memanjangkan jangka hayat komputer.',
  },
  {
    id: 13,
    text: 'Anda sedang bertugas di makmal komputer sekolah anda. Adakah tindakan berikut betul atau salah?\n\n"Membuang tetikus (mouse) ke dalam tong sampah setelah kehabisan bateri atau rosak."',
    options: FalseTrueOptions,
    explanation: 'Peralatan elektronik e-sisa tidak patut dibuang dalam tong sampah biasa kerana ia mengandungi bahan kimia berbahaya. Laporkan alat rosak kepada guru.',
  },
  {
    id: 14,
    text: 'Adakah tindakan ini betul atau salah?\n\n"Memuat naik fail audio orang lain dalam blog anda tanpa meminta kebenaran daripada penciptanya."',
    options: FalseTrueOptions,
    explanation: 'Fail audio dan karya orang lain dilindungi oleh hak cipta. Kita mesti meminta kebenaran sebelum menggunakannya di platform kita sendiri.',
  },
  {
    id: 15,
    text: 'Pilih perkataan dengan format fon tebal (bold).',
    options: [
      { id: 'o1', text: <span className="font-bold text-xl">Perkataan</span>, isCorrect: true },
      { id: 'o2', text: <span className="underline text-xl">Perkataan</span>, isCorrect: false },
      { id: 'o3', text: <span className="italic text-xl">Perkataan</span>, isCorrect: false },
    ],
    explanation: 'Fon tebal (bold) menjadikan tulisan lebih gelap dan menonjol.',
  },
  {
    id: 16,
    text: 'Pilih perkataan dengan format fon garis bawah (underline).',
    options: [
      { id: 'o1', text: <span className="italic text-xl">Perkataan</span>, isCorrect: false },
      { id: 'o2', text: <span className="font-bold text-xl">Perkataan</span>, isCorrect: false },
      { id: 'o3', text: <span className="underline text-xl">Perkataan</span>, isCorrect: true },
    ],
    explanation: 'Fon garis bawah (underline) meletakkan garisan di bawah setiap perkataan.',
  },
  {
    id: 17,
    text: 'Pilih perkataan dengan format fon condong (italic).',
    options: [
      { id: 'o1', text: <span className="underline text-xl">Perkataan</span>, isCorrect: false },
      { id: 'o2', text: <span className="italic text-xl">Perkataan</span>, isCorrect: true },
      { id: 'o3', text: <span className="font-bold text-xl">Perkataan</span>, isCorrect: false },
    ],
    explanation: 'Fon condong (italic) mencondongkan tulisan ke arah kanan.',
  },
  {
    id: 18,
    text: 'Pilih ikon yang betul untuk tindakan "Gunting / Potong".',
    options: [
      { id: 'o1', text: 'Copy', icon: <Copy className="w-12 h-12" />, isCorrect: false },
      { id: 'o2', text: 'Cut', icon: <Scissors className="w-12 h-12" />, isCorrect: true },
      { id: 'o3', text: 'Paste', icon: <ClipboardPaste className="w-12 h-12" />, isCorrect: false },
    ],
    explanation: 'Ikon Gunting mewakili fungsi Cut, yang digunakan untuk memotong dan memindahkan sesuatu dari tempat asalnya.',
  },
  {
    id: 19,
    text: 'Pilih ikon yang betul untuk tindakan "Tampal".',
    options: [
      { id: 'o1', text: 'Paste', icon: <ClipboardPaste className="w-12 h-12" />, isCorrect: true },
      { id: 'o2', text: 'Copy', icon: <Copy className="w-12 h-12" />, isCorrect: false },
      { id: 'o3', text: 'Cut', icon: <Scissors className="w-12 h-12" />, isCorrect: false },
    ],
    explanation: 'Ikon Papan Klip (Clipboard) mewakili fungsi Paste, yang meletakkan semula apa yang anda telah Salin atau Potong.',
  },
  {
    id: 20,
    text: 'Pilih ikon yang betul untuk tindakan "Salin".',
    options: [
      { id: 'o1', text: 'Cut', icon: <Scissors className="w-12 h-12" />, isCorrect: false },
      { id: 'o2', text: 'Copy', icon: <Copy className="w-12 h-12" />, isCorrect: true },
      { id: 'o3', text: 'Paste', icon: <ClipboardPaste className="w-12 h-12" />, isCorrect: false },
    ],
    explanation: 'Ikon dua helaian kertas mewakili fungsi Copy, yang membuat pendua (duplicate) tanpa memadam yang asal.',
  },
  {
    id: 21,
    text: 'Apakah praktikal sebenar apabila anda melakukan tindakan "Cut" dan kemudian "Paste" pada sebaris perkataan?',
    options: [
      { id: 'o1', text: 'Membuat dua salinan perkataan tersebut.', icon: <Copy className="w-8 h-8"/>, isCorrect: false },
      { id: 'o2', text: 'Memadam terus perkataan tersebut.', icon: <XCircle className="w-8 h-8"/>, isCorrect: false },
      { id: 'o3', text: 'Memindahkan perkataan tersebut ke tempat baharu.', icon: <FileText className="w-8 h-8"/>, isCorrect: true },
    ],
    explanation: 'Kombinasi fungsi Potong (Cut) dan Tampal (Paste) digunakan untuk memindahkan teks atau objek dari satu lokasi ke lokasi yang lain.',
  },
  {
    id: 22,
    text: 'Semasa melayari laman web, satu mesej muncul dalam tetingkap pelayar yang baharu. Apa patut anda lakukan?',
    options: [
      { id: 'o1', text: 'Tutup tetingkap tersebut.', isCorrect: true },
      { id: 'o2', text: 'Klik pada mesej tersebut.', isCorrect: false },
      { id: 'o3', text: 'Kongsikan mesej tersebut dengan kawan.', isCorrect: false },
    ],
    explanation: 'Anda harus sentiasa berhati-hati dengan tetingkap timbul (pop-up) yang tidak dijangka. Menutupnya adalah tindakan yang paling selamat untuk mengelakkan perisian hasad atau penipuan.',
  },
  {
    id: 23,
    text: 'Semasa melayari laman web, satu tetingkap menyatakan anda menang "Grand Prize" muncul. Apa perlu anda lakukan?',
    options: [
      { id: 'o1', text: 'Tutup tetingkap tersebut.', isCorrect: true },
      { id: 'o2', text: 'Masukkan maklumat peribadi untuk tuntut hadiah.', isCorrect: false },
      { id: 'o3', text: 'Tekan butang "Tuntut Hadiah".', isCorrect: false },
    ],
    explanation: 'Tetingkap yang mengatakan anda memenangi "Grand Prize" secara tiba-tiba kebiasaannya adalah penipuan (scam) untuk mencuri maklumat peribadi anda. Tutup tetingkap tersebut dengan segera.',
  },
  {
    id: 24,
    text: 'Pilih contoh kata laluan untuk akaun e-mel yang LEMAH.',
    options: [
      { id: 'o1', text: 'Bunga123!', isCorrect: false },
      { id: 'o2', text: 'P@ssw0rd2024', isCorrect: false },
      { id: 'o3', text: '12345678', isCorrect: true },
    ],
    explanation: 'Kata laluan yang hanya mengandungi nombor berturutan sangat mudah untuk diteka. Kata laluan yang selamat perlu ada campuran huruf besar, huruf kecil, nombor, dan simbol.',
  },
  {
    id: 25,
    text: 'Pilih contoh kata laluan untuk akaun e-mel yang KUAT.',
    options: [
      { id: 'o1', text: 'h@rimauK!ut99', isCorrect: true },
      { id: 'o2', text: 'password', isCorrect: false },
      { id: 'o3', text: 'saya123', isCorrect: false },
    ],
    explanation: 'h@rimauK!ut99 adalah contoh kata laluan yang kuat kerana ia menggabungkan huruf besar, huruf kecil, nombor, dan simbol khas.',
  },
  {
    id: 26,
    text: 'Anda sedang mengemas kini profil media sosial anda. Pilih tindakan yang sesuai untuk mesej berikut:\n\n"Ibu bapa saya menyusahkan saya, tolong bantu!"',
    options: [
      { id: 'o1', text: 'Padam', isCorrect: true },
      { id: 'o2', text: 'Papar', isCorrect: false },
    ],
    explanation: 'Mesej yang memburukkan ahli keluarga dan mendedahkan masalah peribadi tidak sesuai dipaparkan di media sosial.',
  },
  {
    id: 27,
    text: 'Anda sedang mengemas kini profil media sosial anda. Pilih tindakan yang sesuai untuk mesej berikut:\n\n"Saya sayang keluarga saya, mereka yang terbaik!"',
    options: [
      { id: 'o1', text: 'Papar', isCorrect: true },
      { id: 'o2', text: 'Padam', isCorrect: false },
    ],
    explanation: 'Mesej yang positif dan meluahkan kasih sayang adalah selamat dan sesuai untuk dipaparkan di profil anda.',
  },
  {
    id: 28,
    text: 'Anda sedang mengemas kini profil media sosial anda. Pilih tindakan yang sesuai untuk mesej berikut:\n\n"Guru saya sangat menjengkelkan. Saya benci dia!"',
    options: [
      { id: 'o1', text: 'Padam', isCorrect: true },
      { id: 'o2', text: 'Papar', isCorrect: false },
    ],
    explanation: 'Menyebarkan kebencian atau memburukkan orang lain di media sosial adalah satu bentuk buli siber jenayah. Anda harus memadam mesej seperti ini.',
  },
  {
    id: 29,
    text: 'Pilih betul atau salah.\n\n"Teknologi seperti media sosial (seperti Facebook, Twitter, Instagram) hanya boleh digunakan untuk menyakiti orang."',
    options: [
      { id: 'o1', text: 'Betul', isCorrect: false },
      { id: 'o2', text: 'Salah', isCorrect: true },
    ],
    explanation: 'Teknologi dan media sosial boleh digunakan untuk kebaikan seperti berkongsi maklumat, belajar, dan berhubung dengan rakan-rakan.',
  },
  {
    id: 30,
    text: 'Pilih betul atau salah.\n\n"Anda menghadapi masalah melakukan aktiviti dalam laman web yang selamat di sekolah anda. Rakan anda ingin membantu. Jadi, anda memberitahu kata laluan (kata kunci) anda kepadanya."',
    options: [
      { id: 'o1', text: 'Betul', isCorrect: false },
      { id: 'o2', text: 'Salah', isCorrect: true },
    ],
    explanation: 'Kata laluan adalah rahsia peribadi. Anda tidak seharusnya berkongsi kata laluan dengan sesiapa pun, termasuk rakan, demi keselamatan akaun anda.',
  },
  {
    id: 31,
    text: 'Pilih betul atau salah.\n\n"Adalah salah untuk memberikan nombor telefon saya kepada seseorang yang tidak dikenali melalui media sosial (seperti Facebook, Twitter, Instagram)."',
    options: [
      { id: 'o1', text: 'Betul', isCorrect: true },
      { id: 'o2', text: 'Salah', isCorrect: false },
    ],
    explanation: 'Maklumat peribadi seperti nombor telefon tidak patut dikongsi dengan orang yang tidak dikenali untuk mengelakkan penipuan dan bahaya.',
  },
  {
    id: 32,
    text: 'Anda sedang mendaftar untuk menyertai laman web yang hebat diperkatakan oleh rakan-rakan anda. Antara berikut, apakah maklumat yang SELAMAT untuk dikongsi semasa pendaftaran laman web tersebut?',
    options: [
      { id: 'o1', text: 'Nama Penuh', isCorrect: false },
      { id: 'o2', text: 'Nama Samaran', isCorrect: true },
      { id: 'o3', text: 'Alamat E-mel', isCorrect: false },
      { id: 'o4', text: 'Nombor Telefon Rumah', isCorrect: false },
    ],
    explanation: 'Nama samaran (nickname) selamat digunakan semasa mendaftar akaun baru di laman web, manakala maklumat peribadi seperti nama penuh, alamat e-mel, nombor telefon, nombor kad kredit, nama sekolah, dan alamat rumah TIDAK SELAMAT untuk dikongsikan sewenang-wenangnya.',
  },
];
