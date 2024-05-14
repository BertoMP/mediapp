export interface CitaSpecificDataModel {
    datos_cita: {
        id: number,
        fecha: string,
        hora: string,
    },
    datos_especialista: {
        especialista_id: number,
        nombre: string,
        primer_apellido: string,
        segundo_apellido: string,
        datos_especialidad: {
            especialidad_id: number,
            especialidad_nombre: string
        },
        datos_consulta: {
            consulta_id: number,
            consulta_nombre: string
        }
    },
    datos_paciente: {
        paciente_id: number,
        nombre: string,
        primer_apellido: string,
        segundo_apellido: string,
    }
    informe_id: number

}
