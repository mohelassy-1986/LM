function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve({
      name: file.name,
      type: file.type,
      base64: reader.result.split(',')[1]
    });
    reader.onerror = error => reject(error);
  });
}

function blobToBase64(blob, filename) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve({
      name: filename,
      type: blob.type,
      base64: reader.result.split(',')[1]
    });
    reader.onerror = error => reject(error);
  });
}