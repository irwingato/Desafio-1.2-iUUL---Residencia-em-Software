const { DateTime } = require('luxon');
const Paciente = require('../models/paciente');

const pacientes = [];

function incluirPaciente(cpf, nome, dataNascimento) {
    const paciente = new Paciente(cpf, nome, dataNascimento);
    pacientes.push(paciente);
}

function verificarPacienteCadastrado(cpf) {
    return pacientes.find((paciente) => paciente.cpf === cpf);
}

function excluirPacienteDoCadastro(cpf) {
    const index = pacientes.findIndex((paciente) => paciente.cpf === cpf);
    if (index !== -1) {
        pacientes.splice(index, 1);
    }
}

function calcularIdade(dataNascimento) {
    const dataNasc = DateTime.fromFormat(dataNascimento, 'dd/MM/yyyy');
    const hoje = DateTime.now();

    let idade = hoje.year - dataNasc.year;

    if (hoje.month < dataNasc.month || (hoje.month === dataNasc.month && hoje.day < dataNasc.day)) {
        idade--;
    }

    return idade;
}

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

function listarPacientesOrdenadosPorCPF() {
    const pacientesOrdenadosPorCPF = pacientes.slice().sort((a, b) => a.cpf.localeCompare(b.cpf));
    return pacientesOrdenadosPorCPF;
}

function listarPacientesOrdenadosPorNome() {
    const pacientesOrdenadosPorNome = pacientes.slice().sort((a, b) => a.nome.localeCompare(b.nome));
    return pacientesOrdenadosPorNome;
}

module.exports = {
    incluirPaciente,
    verificarPacienteCadastrado,
    excluirPacienteDoCadastro,
    listarPacientesOrdenadosPorCPF,
    listarPacientesOrdenadosPorNome,
    listarPacientes,
};
