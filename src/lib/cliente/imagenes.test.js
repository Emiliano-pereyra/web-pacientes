import { describe, expect, it } from "vitest";
import { MAX_LADO, esOptimizable, medidasReducidas, nombreJpg, optimizarImagen } from "./imagenes";

const archivo = (type, size, name = "foto.jpg") => ({ type, size, name });

describe("optimización de fotos", () => {
  it("achica al lado mayor manteniendo la proporción", () => {
    expect(medidasReducidas(4032, 3024)).toEqual({ ancho: MAX_LADO, alto: 1500 });
    expect(medidasReducidas(3024, 4032)).toEqual({ ancho: 1500, alto: MAX_LADO });
  });

  it("nunca agranda una imagen chica", () => {
    expect(medidasReducidas(800, 600)).toEqual({ ancho: 800, alto: 600 });
  });

  it("solo procesa fotos JPG, PNG o WebP de cierto tamaño", () => {
    expect(esOptimizable(archivo("image/jpeg", 3_000_000))).toBe(true);
    expect(esOptimizable(archivo("image/png", 1_000_000))).toBe(true);
    expect(esOptimizable(archivo("image/jpeg", 200_000))).toBe(false);
    expect(esOptimizable(archivo("application/pdf", 3_000_000))).toBe(false);
    expect(esOptimizable(archivo("video/mp4", 30_000_000))).toBe(false);
    expect(esOptimizable(archivo("image/gif", 3_000_000))).toBe(false);
  });

  it("el archivo optimizado pasa a .jpg", () => {
    expect(nombreJpg("IMG_1234.PNG")).toBe("IMG_1234.jpg");
    expect(nombreJpg("herida.pierna.webp")).toBe("herida.pierna.jpg");
    expect(nombreJpg("scan")).toBe("scan.jpg");
  });

  it("lo que no se puede optimizar se sube tal cual", async () => {
    const pdf = archivo("application/pdf", 3_000_000, "estudio.pdf");
    expect(await optimizarImagen(pdf)).toEqual({ archivo: pdf, optimizada: false, tamanoOriginal: 3_000_000 });
  });
});
