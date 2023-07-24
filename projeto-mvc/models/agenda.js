class Agenda {
  constructor() {
      this.consultas = [];
  }

  agendarConsulta(consulta) {
      this.consultas.push(consulta);
  }

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

  listarConsultasFuturas() {
      const dataAtual = DateTime.now();
      return this.consultas.filter(
          (consulta) => DateTime.fromFormat(consulta.dataConsulta, 'dd/MM/yyyy') > dataAtual
      );
  }

  listarConsultasPeriodo(dataInicial, dataFinal) {
      const dataInicialFormatada = DateTime.fromFormat(dataInicial, 'dd/MM/yyyy');
      const dataFinalFormatada = DateTime.fromFormat(dataFinal, 'dd/MM/yyyy');
      return this.consultas.filter((consulta) => {
          const dataConsulta = DateTime.fromFormat(consulta.dataConsulta, 'dd/MM/yyyy');
          return dataConsulta >= dataInicialFormatada && dataConsulta <= dataFinalFormatada;
      });
  }
}

module.exports = Agenda;