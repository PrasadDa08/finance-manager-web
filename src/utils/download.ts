export async function downloadBlob(data: Blob, filename: string) {
  const file = new File([data], filename, {
    type: data.type || "text/csv",
  });

  if (
    navigator.share &&
    navigator.canShare &&
    navigator.canShare({ files: [file] })
  ) {
    await navigator.share({
      files: [file],
      title: "Finance Manager Export",
    });

    return;
  }

  // Fallback for browsers without file sharing
  const url = URL.createObjectURL(data);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
