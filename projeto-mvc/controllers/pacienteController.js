const { DateTime } = require('luxon');
const Paciente = require('../models/paciente');

const pacientes = [];

// Função para incluir um novo paciente no cadastro
function incluirPaciente(cpf, nome, dataNascimento) {
    const paciente = new Paciente(cpf, nome, dataNascimento);
    pacientes.push(paciente);
}

// Função para verificar se um paciente está cadastrado
function verificarPacienteCadastrado(cpf) {
    return pacientes.find((paciente) => paciente.cpf === cpf);
}

// Função para excluir um paciente do cadastro
function excluirPacienteDoCadastro(cpf) {
    const index = pacientes.findIndex((paciente) => paciente.cpf === cpf);
    if (index !== -1) {
        pacientes.splice(index, 1);
    }
}

// Função para calcular a idade de um paciente com base na data de nascimento
function calcularIdade(dataNascimento) {
    const dataNasc = DateTime.fromFormat(dataNascimento, 'dd/MM/yyyy');
    const hoje = DateTime.now();

    let idade = hoje.year - dataNasc.year;

    if (hoje.month < dataNasc.month || (hoje.month === dataNasc.month && hoje.day < dataNasc.day)) {
        idade--;
    }

    return idade;
}

// Função para listar os pacientes cadastrados
function listarPacientes(pacientesListados, ordem) {
    console.log(`Opção 3 selecionada: Listar pacientes (ordenado por ${ordem})`);
    console.log("------------------------------------------------------------------------------");
    console.log("CPF                Nome                                       Dt.Nasc.   Idade");
    console.log("------------------------------------------------------------------------------");

    pacientesListados.forEach((paciente) => {
        const dataNascimento = DateTime.fromFormat(paciente.dataNascimento, 'dd/MM/yyyy');
        const dataFormatada = dataNascimento.toLocaleString({ month: '2-digit', day: '2-digit', year: 'numeric' });
        const idade = calcularIdade(paciente.dataNascimento);

        console.log(
            paciente.cpf + "        " +
            paciente.nome.padEnd(40) +
            dataFormatada + "     " +
            idade
        );
    });

    console.log("------------------------------------------------------------------------------");
}

// Função para listar os pacientes ordenados por CPF
function listarPacientesOrdenadosPorCPF() {
    const pacientesOrdenadosPorCPF = pacientes.slice().sort((a, b) => a.cpf.localeCompare(b.cpf));
    return pacientesOrdenadosPorCPF;
}

// Função para listar os pacientes ordenados por nome
function listarPacientesOrdenadosPorNome() {
    const pacientesOrdenadosPorNome = pacientes.slice().sort((a, b) => a.nome.localeCompare(b.nome));
    return pacientesOrdenadosPorNome;
}

// Exporta as funções que serão utilizadas em outros módulos
module.exports = {
    incluirPaciente,
    verificarPacienteCadastrado,
    excluirPacienteDoCadastro,
    listarPacientesOrdenadosPorCPF,
    listarPacientesOrdenadosPorNome,
    listarPacientes,
};
