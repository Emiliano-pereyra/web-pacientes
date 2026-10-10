import { describe, expect, it } from "vitest";
import { pathDeUrlFirebase, rutaFotoPerfil } from "./fotos";

const BASE = "https://firebasestorage.googleapis.com/v0/b/pacientes-2c28e.firebasestorage.app/o/";

describe("ruta desde un enlace viejo de Firebase Storage", () => {
  it("decodifica la ruta y descarta el token", () => {
    expect(pathDeUrlFirebase(`${BASE}pacientes%2Fabc123%2Fperfil_1.jpg?alt=media&token=xyz`)).toBe(
      "pacientes/abc123/perfil_1.jpg",
    );
  });

  it("respeta espacios y tildes del nombre", () => {
    expect(pathDeUrlFirebase(`${BASE}pacientes%2Fabc%2Fan%C3%A1lisis%20sangre.pdf?alt=media`)).toBe(
      "pacientes/abc/análisis sangre.pdf",
    );
  });

  it.each([
    ["enlace de otro dominio", "https://lh3.googleusercontent.com/foto.jpg"],
    ["enlace firmado nuevo", "https://storage.googleapis.com/bucket/pacientes/a.jpg?X-Goog-Signature=1"],
    ["el «-» del modelo viejo", "-"],
    ["vacío", ""],
    ["no es texto", undefined],
  ])("no es de Firebase Storage: %s", (_, url) => {
    expect(pathDeUrlFirebase(url)).toBeNull();
  });
});

describe("ruta de la foto de perfil", () => {
  it("usa fotoPerfilPath si existe", () => {
    expect(rutaFotoPerfil({ fotoPerfilPath: "pacientes/a/perfil.jpg", urlFoto: "" })).toBe("pacientes/a/perfil.jpg");
  });

  it("en pacientes viejos la saca de urlFoto", () => {
    expect(rutaFotoPerfil({ urlFoto: `${BASE}pacientes%2Fa%2Fp.png?alt=media&token=t` })).toBe("pacientes/a/p.png");
  });

  it("sin foto (o con el «-» viejo) devuelve null", () => {
    expect(rutaFotoPerfil({ urlFoto: "-" })).toBeNull();
    expect(rutaFotoPerfil({})).toBeNull();
    expect(rutaFotoPerfil(undefined)).toBeNull();
  });
});
