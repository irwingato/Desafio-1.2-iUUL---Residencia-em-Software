// Classe que representa uma consulta
class Consulta {
    constructor(cpfPaciente, dataConsulta, horaInicio, horaFim, tempo) {
        this.cpfPaciente = cpfPaciente;
        this.dataConsulta = dataConsulta;
        this.horaInicio = horaInicio;
        this.horaFim = horaFim;
        this.tempo = tempo;
    }
}


// Exporta a classe Consulta para ser utilizada em outros módulos
module.exports = Consulta;