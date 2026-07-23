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

/**
 * Comprimeer een foto zo dat hij gegarandeerd onder een bepaalde
 * bestandsgrootte blijft (standaard 900KB, ruim onder de 1MB-limiet
 * per Firestore-document). Probeert eerst een goede kwaliteit, en
 * verkleint/comprimeert automatisch verder als het nog te groot is.
 * Geeft ook aan of het gelukt is om onder de limiet te komen.
 */
export async function compressImageForStorage(
  file: File,
  maxBytes = 900_000
): Promise<{ dataUrl: string; withinLimit: boolean }> {
  const pogingen = [
    { maxWidth: 1400, quality: 0.7 },
    { maxWidth: 1400, quality: 0.5 },
    { maxWidth: 1000, quality: 0.5 },
    { maxWidth: 1000, quality: 0.35 },
    { maxWidth: 700, quality: 0.35 },
    { maxWidth: 500, quality: 0.3 },
  ];

  let laatsteResultaat = "";

  for (const poging of pogingen) {
    const dataUrl = await compressImageFile(
      file,
      poging.maxWidth,
      poging.quality
    );

    laatsteResultaat = dataUrl;

    // Base64 is ~33% groter dan de eigenlijke bytes; dit schat de
    // echte bestandsgrootte in zonder een aparte Blob te hoeven maken.
    const geschatteBytes = Math.ceil((dataUrl.length * 3) / 4);

    if (geschatteBytes <= maxBytes) {
      return { dataUrl, withinLimit: true };
    }
  }

  return { dataUrl: laatsteResultaat, withinLimit: false };
}
