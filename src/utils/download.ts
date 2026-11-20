export async function downloadBlob(data: Blob, filename: string) {
  const isAndroid = /Android/i.test(navigator.userAgent);

  if (isAndroid) {
    // Try opening the Blob as a downloadable link
    const url = window.URL.createObjectURL(data);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.target = "_blank";

    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 10000);

    return;
  }

  // Normal browser download
  const url = window.URL.createObjectURL(data);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 1000);
}
