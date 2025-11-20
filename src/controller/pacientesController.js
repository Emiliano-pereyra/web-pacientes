import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const getPacientes = async () => {
  try {
    const listaRef = collection(db, "pacientes", "lista");
    const listaSnap = await getDocs(listaRef);

    const pacientes = listaSnap.docs.map((doc) => ({
      id: doc.id,
      nombre: doc.id.replace(/_/g, " "),
    }));

    return pacientes;
  } catch (error) {
    console.error("Error obteniendo pacientes:", error);
    throw new Error("No se pudieron obtener los pacientes");
  }
};

export const getDatosPaciente = async (idPaciente) => {
  try {
    const datosRef = collection(db, "pacientes", "lista", idPaciente, "datos");
    const datosSnap = await getDocs(datosRef);

    const datos = datosSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return datos;
  } catch (error) {
    console.error("Error obteniendo datos del paciente:", error);
    throw new Error("No se pudieron obtener los datos del paciente");
  }
};
