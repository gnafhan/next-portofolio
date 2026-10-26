/**
 * Course certificates. Images are the issuer's own certificate renders (hosted on Imgur / Sololearn,
 * served through next/image). Entries without an image render as a typeset card instead.
 * `date` is only set where the month is known (LinkedIn); the rest stay undated rather than guessed.
 */
export type Certificate = {
  title: string;
  issuer: string;
  date?: string; // YYYY-MM
  image?: string;
  url?: string;
  id?: string;
  featured?: boolean;
};

export const certificates: Certificate[] = [
  { title: "Generative AI Leader", issuer: "Google", date: "2025-10", featured: true },
  { title: "Introduction to Databases for Back-End Development", issuer: "Meta", date: "2024-03" },
  { title: "Version Control", issuer: "Meta", date: "2024-03" },
  { title: "Programming in Python", issuer: "Meta", date: "2024-01" },
  { title: "Introduction to Back-End Development", issuer: "Meta", date: "2024-01" },
  { title: "Algorithm & Data Structures with Python (Gold)", issuer: "Skilvul", date: "2024-02" },
  { title: "Python Lanjutan (Gold)", issuer: "Skilvul", date: "2024-02" },
  { title: "Python Dasar (Gold)", issuer: "Skilvul", date: "2024-02" },
  { title: "Google Data Analytics Specialization", issuer: "Google", date: "2024-01", image: "https://i.imgur.com/Ae1MnH7.png", url: "https://coursera.org/verify/professional-cert/FK52RPKADU6W", id: "FK52RPKADU6W", featured: true },
  { title: "Google Data Analytics Capstone: Complete a Case Study", issuer: "Google", date: "2023-12", image: "https://i.imgur.com/bBUZMGU.png", url: "https://coursera.org/verify/9C28Q9DHRJ6H", id: "9C28Q9DHRJ6H" },
  { title: "Data Analysis with R Programming", issuer: "Google", image: "https://i.imgur.com/rLGFexO.png", url: "https://coursera.org/verify/UE6DVL676MLB", id: "UE6DVL676MLB" },
  { title: "Share Data Through the Art of Visualization", issuer: "Google", image: "https://i.imgur.com/chAoomJ.png", url: "https://coursera.org/verify/K9EXYHWR5ARE", id: "K9EXYHWR5ARE" },
  { title: "Analyze Data to Answer Questions", issuer: "Google", image: "https://i.imgur.com/66XdPXv.png", url: "https://coursera.org/verify/KPXN4GPWY46Y", id: "KPXN4GPWY46Y" },
  { title: "Data Analyst: Process Data from Dirty to Clean", issuer: "Google", image: "https://i.imgur.com/G8SHDEi.png", url: "https://coursera.org/verify/2DXZ39G9GFGH", id: "2DXZ39G9GFGH" },
  { title: "Data Analyst: Prepare Data for Exploration", issuer: "Google", image: "https://i.imgur.com/u7g1zFk.png", url: "https://www.coursera.org/account/accomplishments/verify/TQG27GFRDEFV", id: "TQG27GFRDEFV" },
  { title: "Data Analyst: Ask Questions to Make Data-Driven Decisions", issuer: "Google", image: "https://i.imgur.com/olnhBhW.png", url: "https://www.coursera.org/account/accomplishments/verify/4RSTLFQV5J79", id: "4RSTLFQV5J79" },
  { title: "Data Analyst: Foundations: Data, Data, Everywhere", issuer: "Google", image: "https://i.imgur.com/ZNoQaRc.png", url: "https://www.coursera.org/account/accomplishments/verify/SYBT9KD4V7GE", id: "SYBT9KD4V7GE" },
  { title: "Best Project of Software Engineering Class", issuer: "OmahTI UGM", image: "https://i.imgur.com/rPev41w.png", url: "https://drive.google.com/file/d/18kUsL84miQkwZRU04JXirrwJkY0wBghF/view?usp=sharing" },
  { title: "Alibaba Cloud Certified Developer", issuer: "Alibaba Cloud", url: "https://drive.google.com/file/d/1bXTiSDzdh8aPkp7caOwXVhgMsNo1Vt0-/view", id: "ACCD0119700100000999", featured: true },
  { title: "Machine Learning: Introduction to Deep Learning", issuer: "Kaggle", image: "https://i.imgur.com/BhnfFfT.png", url: "https://www.kaggle.com/learn/certification/ghifarinafhan/intro-to-deep-learning", featured: true },
  { title: "Machine Learning: Intermediate Machine Learning", issuer: "Kaggle", image: "https://i.imgur.com/wu0EQEO.png", url: "https://www.kaggle.com/learn/certification/ghifarinafhan/intermediate-machine-learning" },
  { title: "Machine Learning: Intro to Machine Learning", issuer: "Kaggle", image: "https://i.imgur.com/vf1XC1n.png", url: "https://www.kaggle.com/learn/certification/ghifarinafhan/intro-to-machine-learning" },
  { title: "Memulai Pemrograman dengan Dart", issuer: "Dicoding Indonesia", image: "https://i.imgur.com/A0N8A2h.png", url: "https://www.dicoding.com/certificates/53XE47QWVZRN", id: "53XE47QWVZRN" },
  { title: "Machine Learning: Memulai Dasar Visualisasi Data", issuer: "Dicoding Indonesia", image: "https://i.imgur.com/9OmoqEj.png", url: "https://www.dicoding.com/certificates/4EXG4N95GPRL", id: "4EXG4N95GPRL" },
  { title: "Memulai Machine Learning untuk Pemula", issuer: "Dicoding Indonesia", image: "https://i.imgur.com/OLICs95.png", url: "https://www.dicoding.com/certificates/L4PQ88M52ZO1", id: "L4PQ88M52ZO1" },
  { title: "Memulai Pemrograman dengan Python", issuer: "Dicoding Indonesia", image: "https://i.imgur.com/bDsxIjK.png", url: "https://www.dicoding.com/certificates/81P27377OZOY", id: "81P27377OZOY" },
  { title: "Belajar Dasar Structured Query Language (SQL)", issuer: "Dicoding Indonesia", image: "https://i.imgur.com/lvqQvsB.png", url: "https://www.dicoding.com/certificates/81P23D278XOY", id: "81P23D278XOY" },
  { title: "Project Manager: Belajar Manajemen Proyek", issuer: "Dicoding Indonesia", image: "https://i.imgur.com/3WcR1WZ.png", url: "https://www.dicoding.com/certificates/07Z6VE1DRXQR", id: "07Z6VE1DRXQR" },
  { title: "Memulai Dasar Pemrograman untuk Pengembang Software", issuer: "Dicoding Indonesia", image: "https://i.imgur.com/n5IDzZY.png", url: "https://www.dicoding.com/certificates/2VX3JED3QPYQ", id: "2VX3JED3QPYQ" },
  { title: "Belajar Jaringan Komputer untuk Pemula", issuer: "Dicoding Indonesia", image: "https://i.imgur.com/2oe0PQl.png", url: "https://www.dicoding.com/certificates/N9ZO4K76RZG5", id: "N9ZO4K76RZG5" },
  { title: "Memulai Pemrograman Dengan Java", issuer: "Dicoding Indonesia", image: "https://i.imgur.com/dmGitSB.png", url: "https://www.dicoding.com/certificates/NVP79DQ04ZR0", id: "NVP79DQ04ZR0" },
  { title: "Dev Ops: Belajar Dasar-Dasar DevOps", issuer: "Dicoding Indonesia", image: "https://i.imgur.com/ZanSloX.png", url: "https://www.dicoding.com/certificates/EYX4956DRPD", id: "EYX4956DRPDL" },
  { title: "Cloud Practitioner Essentials (Belajar Dasar AWS Cloud)", issuer: "Dicoding Indonesia", image: "https://i.imgur.com/tssAI9s.png", url: "https://www.dicoding.com/certificates/QLZ9K41J7Z5D", id: "QLZ9K41J7Z5D", featured: true },
  { title: "Belajar Membuat Aplikasi Back-End untuk Pemula", issuer: "Dicoding Indonesia", image: "https://i.imgur.com/drLDvsc.png", url: "https://www.dicoding.com/certificates/1RXYM14WKXVM", id: "1RXYM14WKXVM" },
  { title: "Belajar Dasar Pemrograman JavaScript", issuer: "Dicoding Indonesia", image: "https://i.imgur.com/EfImCpL.png", url: "https://www.dicoding.com/certificates/JLX1GWV5JZ72", id: "JLX1GWV5JZ72" },
  { title: "Architecting on AWS (Membangun Arsitektur Cloud di AWS)", issuer: "Dicoding Indonesia", image: "https://i.imgur.com/V72Nd5t.png", url: "https://www.dicoding.com/certificates/MRZMD8MWRZYQ", id: "MRZMD8MWRZYQ", featured: true },
  { title: "Machine Learning: Data Preparation 101", issuer: "AI Planet", image: "https://i.imgur.com/FnUMFYp.png", url: "https://aiplanet.com/course/certificates/verify/c1bcdc74-d458-44ae-980a-8c8b8c8e6b38/", id: "c1bcdc74-d458-44ae-980a-8c8b8c8e6b38" },
  { title: "Introduction to Data Visualization with Matplotlib", issuer: "AI Planet", image: "https://i.imgur.com/gRnVxUK.png", url: "https://aiplanet.com/course/certificates/verify/12cd35d1-3a0c-4b61-9059-016bd858ac6a/", id: "12cd35d1-3a0c-4b61-9059-016bd858ac6a" },
  { title: "Introduction to Exploratory Data Analysis", issuer: "AI Planet", image: "https://i.imgur.com/miXvR6i.png", url: "https://aiplanet.com/course/certificates/verify/0f84da62-94a1-4bf4-a365-d14a8ad805ad/", id: "0f84da62-94a1-4bf4-a365-d14a8ad805ad" },
  { title: "Introduction to Implementation of Classification & Regression Models", issuer: "AI Planet", image: "https://i.imgur.com/dqDgTEy.png", url: "https://aiplanet.com/course/certificates/verify/b7c0f85a-a2bb-4afe-b478-5cc2a3a480ce/", id: "b7c0f85a-a2bb-4afe-b478-5cc2a3a480ce" },
  { title: "Machine Learning: Introduction to Numpy", issuer: "AI Planet", image: "https://i.imgur.com/rXy8IKq.png", url: "https://aiplanet.com/course/certificates/verify/69375f77-07d5-4de1-9373-a869b67e133c/", id: "69375f77-07d5-4de1-9373-a869b67e133c" },
  { title: "Machine Learning: Introduction to Pandas", issuer: "AI Planet", image: "https://i.imgur.com/mOzBEsb.png", url: "https://aiplanet.com/course/certificates/verify/0a37382f-d95d-43d6-b026-14099d6f76d9/", id: "0a37382f-d95d-43d6-b026-14099d6f76d9" },
  { title: "Machine Learning: Introduction to Python - Intermediate", issuer: "AI Planet", image: "https://i.imgur.com/egTRCJy.png", url: "https://aiplanet.com/course/certificates/verify/a9dfcbb0-b18b-4a7d-8c43-4af5101c2506/", id: "a9dfcbb0-b18b-4a7d-8c43-4af5101c2506" },
  { title: "Introduction to Python Basics for Data Science", issuer: "AI Planet", image: "https://i.imgur.com/tyeRT5F.png", url: "https://aiplanet.com/course/certificates/verify/b30afa32-3e73-4727-a560-faf8ce74c259/", id: "b30afa32-3e73-4727-a560-faf8ce74c259" },
  { title: "Machine Learning: Unsupervised Learning", issuer: "AI Planet", image: "https://i.imgur.com/ljz2U1v.png", url: "https://aiplanet.com/course/certificates/verify/1f110e75-800b-4330-915e-c3ae1e73c1a7/", id: "1f110e75-800b-4330-915e-c3ae1e73c1a7" },
  { title: "Supervised Learning Algorithms - Classification", issuer: "AI Planet", image: "https://i.imgur.com/SY5Qoo0.png", url: "https://aiplanet.com/course/certificates/verify/46731803-bf55-4536-b13d-9b18947ad76e/", id: "46731803-bf55-4536-b13d-9b18947ad76e" },
  { title: "Supervised Learning Algorithms - Regression", issuer: "AI Planet", image: "https://i.imgur.com/2zrFBpd.png", url: "https://aiplanet.com/course/certificates/verify/0fbfb588-9622-481b-8c55-971c502e7533/", id: "0fbfb588-9622-481b-8c55-971c502e7533" },
  { title: "Kelas Belajar JavaScript Asynchronous", issuer: "Codepolitan", url: "https://www.codepolitan.com/c/NJLO6WQ/", id: "NJLO6WQ" },
  { title: "Belajar GIT untuk Pemula", issuer: "Codepolitan", image: "https://i.imgur.com/UFHSBpj.png", url: "https://codepolitan.com/c/BHBYAMK", id: "BHBYAMK" },
  { title: "Kelas Pemrograman Python untuk Pemula", issuer: "Codepolitan", image: "https://i.imgur.com/UjlnUwm.png", url: "https://codepolitan.com/c/KBYRNAT", id: "KBYRNATA" },
  { title: "Kelas Pengenalan Database Menggunakan MySQL", issuer: "Codepolitan", image: "https://i.imgur.com/GZ47ZKT.png", url: "https://codepolitan.com/c/BQ7T6R0", id: "BQ7T6R0" },
  { title: "Kelas Algoritma dan Pemrograman Dasar", issuer: "Codepolitan", image: "https://i.imgur.com/sNyfxYM.png", url: "https://www.codepolitan.com/c/2BVVUHR/", id: "2BVVUHR" },
  { title: "Kelas Belajar Dasar-dasar HTML dan CSS", issuer: "Codepolitan", image: "https://i.imgur.com/PUU8hZM.png", url: "https://www.codepolitan.com/c/4V9KR83/", id: "4V9KR83" },
  { title: "Kelas Belajar JQuery Dasar", issuer: "Codepolitan", image: "https://i.imgur.com/h25SNTV.png", url: "https://www.codepolitan.com/c/8M2QJNW/", id: "8M2QJNW" },
  { title: "Kelas Belajar JavaScript Dasar", issuer: "Codepolitan", image: "https://i.imgur.com/zOmRqJG.png", url: "https://www.codepolitan.com/c/8SKXZ9B/", id: "8SKXZ9B" },
  { title: "Kelas Mengenal Pemrograman Komputer", issuer: "Codepolitan", image: "https://i.imgur.com/pZfm8wd.png", url: "https://www.codepolitan.com/c/ABYNFKL/", id: "ABYNFKL" },
  { title: "PHP Programming Language Certificate", issuer: "Sololearn", image: "https://api2.sololearn.com/v2/certificates/CC-MQ7MZSQ5/image/jpg", url: "https://www.sololearn.com/en/certificates/CC-MQ7MZSQ5", id: "CC-MQ7MZSQ5" },
  { title: "Introduction to JavaScript Certificate", issuer: "Sololearn", image: "https://api2.sololearn.com/v2/certificates/CC-43QECBVU/image/jpg", url: "https://www.sololearn.com/en/certificates/CC-43QECBVU", id: "CC-43QECBVU" },
  { title: "Kotlin Programming Language Certificate", issuer: "Sololearn", image: "https://api2.sololearn.com/v2/certificates/CC-S1SKDEHD/image/jpg", url: "https://www.sololearn.com/en/certificates/CC-S1SKDEHD", id: "CC-S1SKDEHD" },
  { title: "React + Redux Course Certificate", issuer: "Sololearn", image: "https://api2.sololearn.com/v2/certificates/CT-SNMUOFKZ/image/jpg", url: "https://www.sololearn.com/certificates/CT-SNMUOFKZ", id: "CT-SNMUOFKZ" },
];

/** Issuers in display order, with their certificates. */
export const ISSUER_ORDER = ["Google", "Meta", "Kaggle", "Alibaba Cloud", "Dicoding Indonesia", "AI Planet", "Skilvul", "Codepolitan", "Sololearn", "OmahTI UGM"];

export function certificatesByIssuer() {
  return ISSUER_ORDER.map((issuer) => ({ issuer, items: certificates.filter((c) => c.issuer === issuer) })).filter((g) => g.items.length);
}

/** Certificates that have an image, best first: used for the stacked pile. */
export function pileCertificates(n: number) {
  const withImg = certificates.filter((c) => c.image);
  return [...withImg.filter((c) => c.featured), ...withImg.filter((c) => !c.featured)].slice(0, n);
}

export function formatCertDate(d?: string) {
  if (!d) return undefined;
  const [y, m] = d.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}
