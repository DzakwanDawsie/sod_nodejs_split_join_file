// Mengimport filesystem
const fs = require('fs');

// Mendefinisikan path file sample dan folder untuk menyimpan data chunk
const sampleFilePath = 'sample-file.mp4';
const chunkFilesDirPath = 'chunk-files';

// Membuat folder penyimpanan chunk jika belum terbuat
if (!fs.existsSync(chunkFilesDirPath)) fs.mkdirSync(chunkFilesDirPath);

// Menentukan nilai bytes per chunk (1 MB)
const MAX_CHUNK_SIZE = 1 * 1024 * 1024;

// Membuat buffer dengan maksimal size sesuai dengan MAX_CHUNK_SIZE
let buffer = Buffer.alloc(MAX_CHUNK_SIZE);

// Membuat variable untuk menyimpan nilai bytes sementara
let currentByteSize = MAX_CHUNK_SIZE;

// Membuat variable untuk menyimpan counter untuk chunk file
let chunkFileCounter = 1;

// Membuka file sample
const fdSampleFile = fs.openSync(sampleFilePath, 'r');

// Memproses data chunk menggunakan looping
while (currentByteSize > 0) {
  // Membaca buffer dari file dan menyimpannya ke variabel buffer, dan nilai bytes nya ke variable currentByteSize
  currentByteSize = fs.readSync(fdSampleFile, buffer, { length: MAX_CHUNK_SIZE  });
  
  // Memvalidasi nilai bytes dari buffer untuk menghindari terbuatnya file dengan 0 bytes
  if (currentByteSize > 0) {
    // Membandingkan nilai buffer pada saat ini dengan maksimal size pada MAX_CHUNK_SIZE (memotong buffer dengan ukuran saat ini jika nilainya kurang dari MAX_CHUNK_SIZE)
    const chunk = (currentByteSize < MAX_CHUNK_SIZE) ? buffer.subarray(0, currentByteSize) : buffer;

    // Mendefinisikan path untuk file chunk
    const sampleFileChunkPath = chunkFilesDirPath.concat('/', sampleFilePath, '.part', chunkFileCounter);

    // Membuat file chunk
    const fdSampleFileChunk = fs.openSync(sampleFileChunkPath, 'w');

    // Menuliskan file chunk dengan buffer yang sudah terpotong
    fs.writeSync(fdSampleFileChunk, chunk);

    // Menutup file chunk setelah menuliskan buffer
    fs.closeSync(fdSampleFileChunk);

    // Menambah counter file agar file chunk tidak terduplikasi
    chunkFileCounter++;

    // Mengeprint nilai bytes ke log untuk memastikan nilanya
    console.log(`${currentByteSize} bytes writed to => ${sampleFileChunkPath}`);
  } else {
    // Menutup file sample
    fs.closeSync(fdSampleFile);
  }
}
