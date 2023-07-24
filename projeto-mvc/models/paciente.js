// Classe que representa um paciente
class Paciente {
  constructor(cpf, nome, dataNascimento) {
      this.cpf = cpf;
      this.nome = nome;
      this.dataNascimento = dataNascimento;
  }
}

// Exporta a classe Paciente para ser utilizada em outros módulos
module.exports = Paciente;