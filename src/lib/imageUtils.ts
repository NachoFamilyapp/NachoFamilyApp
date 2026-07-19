/**
 * Comprimeer een geselecteerde/gemaakte foto tot een kleine base64-string,
 * zodat hij past in een Firestore-document (limiet ~1MB per document).
 * Hiermee is er geen aparte Firebase Storage-opzet nodig.
 */
export function compressImageFile(
  file: File,
  maxWidth = 900,
  quality = 0.6
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Kon bestand niet lezen"));

    reader.onload = () => {
      const img = new Image();

      img.onerror = () => reject(new Error("Kon afbeelding niet laden"));

      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);

        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Canvas niet beschikbaar"));
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
