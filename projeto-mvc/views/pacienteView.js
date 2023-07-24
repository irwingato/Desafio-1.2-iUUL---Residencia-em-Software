// Função para mostrar mensagens de erro
function mostrarMensagemErro(mensagem) {
  console.error('Erro:', mensagem);
}

// Função para exibir a lista de pacientes
function exibirListaPacientes(pacientesListados, ordem) {
  console.log(`Opção 3 selecionada: Listar pacientes (ordenado por ${ordem})`);
  console.log("------------------------------------------------------------------------------");
  console.log("CPF                Nome                                       Dt.Nasc.   Idade");
  console.log("------------------------------------------------------------------------------");

  pacientesListados.forEach((paciente) => {
    const dataNascimento = new Date(paciente.dataNascimento);
    const dataFormatada = dataNascimento.toLocaleDateString("pt-BR");
    console.log(
      paciente.cpf + "  " +
      paciente.nome.padEnd(40) +
      dataFormatada + "  " +
      paciente.idade
    );
  });

  console.log("------------------------------------------------------------------------------");
}

// Exporta as funções que serão utilizadas em outros módulos
module.exports = {
  mostrarMensagemErro,
  exibirListaPacientes,
  exibirListaPacientes
};
