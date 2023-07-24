// Classe que representa a agenda de consultas
class Agenda {
  constructor() {
      this.consultas = [];
  }

  // Método para agendar uma consulta
  agendarConsulta(consulta) {
      this.consultas.push(consulta);
  }

  // Método para cancelar o agendamento de uma consulta
  cancelarAgendamento(cpf, dataConsulta, horaInicio) {
      const index = this.consultas.findIndex(
          (consulta) =>
              consulta.cpfPaciente === cpf &&
              consulta.dataConsulta === dataConsulta &&
              consulta.horaInicio === horaInicio
      );

      if (index !== -1) {
          this.consultas.splice(index, 1);
          return true;
      }
      return false;
  }
  
  // Método para listar as consultas futuras da agenda
  listarConsultasFuturas() {
      const dataAtual = DateTime.now();
      return this.consultas.filter(
          (consulta) => DateTime.fromFormat(consulta.dataConsulta, 'dd/MM/yyyy') > dataAtual
      );
  }
  
  // Método para listar as consultas em um período específico da agenda
  listarConsultasPeriodo(dataInicial, dataFinal) {
      const dataInicialFormatada = DateTime.fromFormat(dataInicial, 'dd/MM/yyyy');
      const dataFinalFormatada = DateTime.fromFormat(dataFinal, 'dd/MM/yyyy');
      return this.consultas.filter((consulta) => {
          const dataConsulta = DateTime.fromFormat(consulta.dataConsulta, 'dd/MM/yyyy');
          return dataConsulta >= dataInicialFormatada && dataConsulta <= dataFinalFormatada;
      });
  }
}

// Exporta a classe Agenda para ser utilizada em outros módulos
module.exports = Agenda;