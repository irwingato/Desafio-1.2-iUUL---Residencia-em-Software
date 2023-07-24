class Consulta {
    constructor(cpfPaciente, dataConsulta, horaInicio, horaFim, tempo) {
        this.cpfPaciente = cpfPaciente;
        this.dataConsulta = dataConsulta;
        this.horaInicio = horaInicio;
        this.horaFim = horaFim;
        this.tempo = tempo;
    }
}

module.exports = Consulta;