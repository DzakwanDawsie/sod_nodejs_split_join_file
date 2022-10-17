// Mengimport filesystem
const fs = require('fs');

// Mendefinisikan path file result dan folder penyimpanan data chunk
const sampleFileResultPath = 'sample-file-result.mp4';
const chunkFilesDirPath = 'chunk-files';

// Mengecek apakah telah melakukan split file sebelumnya
if (!fs.existsSync(chunkFilesDirPath)) return console.log('There is no chunk files to processed, please run `node split.js` first');

// Membaca semua file yang ada pada folder penyimpanan data chunk
const chunkFilesName = fs.readdirSync(chunkFilesDirPath).sort((fileNameA, fileNameB) => {
  const numberA = fileNameA.split('.').slice(-1)[0];
  const numberB = fileNameB.split('.').slice(-1)[0];
  
  return numberA.localeCompare(numberB, undefined, { numeric: true, sensitivity: 'base' });
});

// Membuat file result
const fdSampleFileResult = fs.openSync(sampleFileResultPath, 'w');

// Melakukan looping pada isi folder penyimpanan data chunk
for (const chunkFileName of chunkFilesName) {
  // Mendefinisikan path file chunk
  const chunkFilePath = chunkFilesDirPath.concat('/', chunkFileName);
  
  // Mengecek nilai bytes pada file chunk
  const chunkFileByte = fs.lstatSync(chunkFilePath).size;

  // Membuat buffer dengan maksimal nilai sesuai dengan ukuran file chunk
  let buffer = Buffer.alloc(chunkFileByte);

  // Membuka file chunk
  const fdSampleFileChunk = fs.openSync(chunkFilePath);

  // Membaca buffer dari file dan menyimpannya ke variabel buffer
  const byteSize = fs.readSync(fdSampleFileChunk, buffer, { length: chunkFileByte });

  // Menuliskan buffer ke file result
  fs.writeSync(fdSampleFileResult, buffer);

  // Menutup file chunk
  fs.closeSync(fdSampleFileChunk);

  // Mengeprint nilai bytes ke log untuk memastikan nilanya
  console.log(`${byteSize} bytes writed from => ${chunkFilePath} to => ${sampleFileResultPath}`);
}

// Menutup file result
fs.closeSync(fdSampleFileResult);
