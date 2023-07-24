const { DateTime } = require('luxon');
const Paciente = require('../models/paciente');
const Consulta = require('../models/consulta');
const Agenda = require('../models/agenda');
const { verificarPacienteCadastrado } = require('./pacienteController');
const consultas = [];
const pacientes = [];
const agenda = new Agenda();
const { mostrarMensagemErro } = require('../views/pacienteView'); // Adicione esta linha

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove todos os caracteres não numéricos do CPF

    if (cpf.length !== 11) { // Verifica se o CPF possui 11 dígitos
        return false; // Retorna falso se o CPF não possui 11 dígitos
    }

    if (/^(\d)\1+$/.test(cpf)) { // Verifica se o CPF possui todos os dígitos iguais
        return false; // Retorna falso se o CPF possui todos os dígitos iguais
    }

    // Realiza a validação do dígito verificador do CPF
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
        resto = 0;
    }
    if (resto !== parseInt(cpf.charAt(9))) {
        return false;
    }

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
        resto = 0;
    }
    if (resto !== parseInt(cpf.charAt(10))) {
        return false;
    }

    return true; // Retorna verdadeiro se o CPF é válido
}

function validarNome(nome) {
    return nome.length >= 5; // Retorna verdadeiro se o nome possui pelo menos 5 caracteres
}

function validarDataNascimento(dataNascimento) {
    const dataAtual = DateTime.now(); // Obtém a data e hora atuais
    const dataNasc = DateTime.fromFormat(dataNascimento, 'dd/MM/yyyy'); // Converte a string da data de nascimento para um objeto DateTime

    return dataNasc.isValid && dataAtual.diff(dataNasc, 'years').years >= 13; // Verifica se a data de nascimento é válida e se o paciente tem pelo menos 13 anos
}

function calcularTempoConsulta(horaInicial, horaFinal) {
    const formatoHora = 'HHmm';
    const horaInicialFormatada = DateTime.fromFormat(horaInicial, formatoHora); // Converte a string da hora inicial para um objeto DateTime
    const horaFinalFormatada = DateTime.fromFormat(horaFinal, formatoHora); // Converte a string da hora final para um objeto DateTime

    const duracao = horaFinalFormatada.diff(horaInicialFormatada, 'minutes'); // Calcula a diferença de tempo em minutos entre a hora final e a hora inicial
    return duracao.minutes; // Retorna a duração da consulta em minutos
}
function lerDadosPaciente(prompt) {
    while (true) {
        const cpf = prompt('CPF: ');
        if (!validarCPF(cpf)) {
            mostrarMensagemErro('CPF inválido. Tente novamente.');
            continue;
        }

        const nome = prompt('Nome: ');
        if (!validarNome(nome)) {
            mostrarMensagemErro('Nome inválido. O nome deve ter pelo menos 5 caracteres.');
            continue;
        }

        const dataNascimento = prompt('Data de nascimento (formato DD/MM/YYYY): ');
        if (!validarDataNascimento(dataNascimento)) {
            mostrarMensagemErro('Data de nascimento inválida. O paciente deve ter pelo menos 13 anos.');
            continue;
        }

        return { cpf, nome, dataNascimento };
    }
}

function agendarConsulta(prompt) {
    while (true) {
        const { cpf, nome, dataNascimento } = lerDadosPaciente(prompt);

        if (!agendaController.verificarPacienteCadastrado(cpf)) {
            console.log('Erro: paciente não cadastrado.');
            continue;
        }

        const dataConsulta = prompt('Digite a data da consulta (DD/MM/YYYY): ');
        const horaInicial = prompt('Digite a hora inicial da consulta (HHmm): ');
        const horaFinal = prompt('Digite a hora final da consulta (HHmm): ');

        const dataConsultaFormatada = DateTime.fromFormat(dataConsulta, 'dd/MM/yyyy');
        const horaInicialFormatada = DateTime.fromFormat(horaInicial, 'HHmm');
        const horaFinalFormatada = DateTime.fromFormat(horaFinal, 'HHmm');
        const dataAtual = DateTime.now();

        if (dataConsultaFormatada <= dataAtual || (dataConsultaFormatada === dataAtual && horaInicialFormatada <= dataAtual)) {
            console.log('Erro: A data e hora da consulta devem ser para um período futuro.');
            continue;
        }

        if (horaFinalFormatada <= horaInicialFormatada) {
            console.log('Erro: A hora final da consulta deve ser depois da hora inicial.');
            continue;
        }

        const tempo = calcularTempoConsulta(horaInicial, horaFinal);

        const consulta = new Consulta(cpf, dataConsulta, horaInicial, horaFinal, tempo);
        agenda.agendarConsulta(consulta);
        console.log('Agendamento realizado com sucesso!');
        break;
    }
}

function cancelarAgendamento(prompt) {
    while (true) {
        const cpf = prompt('Digite o CPF do paciente: ');
        const dataConsulta = prompt('Digite a data da consulta (DD/MM/YYYY): ');
        const horaInicial = prompt('Digite a hora inicial da consulta (HHmm): ');

        const consultaEncontrada = agenda.consultas.find(
            (consulta) =>
                consulta.cpfPaciente === cpf &&
                consulta.dataConsulta === dataConsulta &&
                consulta.horaInicio === horaInicial
        );

        if (consultaEncontrada) {
            const agendamentoCancelado = agenda.cancelarAgendamento(cpf, dataConsulta, horaInicial);

            if (agendamentoCancelado) {
                console.log('Agendamento cancelado com sucesso!');
            } else {
                console.log('Erro: Não foi possível cancelar o agendamento.');
            }
            break;
        } else {
            console.log('Agendamento não encontrado. Tente novamente.');
        }
    }
}

function listarAgenda(opcaoAgenda) {
    console.log('------------------------------------------------------------------------------');
    console.log('Data           H.Ini   H.Fim Tempo Nome                    Dt.Nasc.');
    console.log('------------------------------------------------------------------------------');

    const dataAtual = DateTime.now();

    if (opcaoAgenda.toUpperCase() === 'T') {
        const consultasAgendadas = agenda.listarConsultasFuturas();

        if (consultasAgendadas.length === 0) {
            console.log('Não há consultas agendadas.');
        } else {
            for (const consulta of consultasAgendadas) {
                imprimirConsulta(consulta);
            }
        }
    } else if (opcaoAgenda.toUpperCase() === 'P') {
        while (true) {
            const dataInicial = prompt('Informe a data inicial (DD/MM/AAAA): ');
            const dataFinal = prompt('Informe a data final (DD/MM/AAAA): ');

            const dataInicialFormatada = DateTime.fromFormat(dataInicial, 'dd/MM/yyyy');
            const dataFinalFormatada = DateTime.fromFormat(dataFinal, 'dd/MM/yyyy');

            if (dataFinalFormatada < dataInicialFormatada) {
                console.log('Erro: A data final deve ser igual ou depois da data inicial.');
                continue;
            }

            const consultasAgendadas = agenda.listarConsultasPeriodo(dataInicial, dataFinal);

            if (consultasAgendadas.length === 0) {
                console.log('Não há consultas agendadas nesse período.');
            } else {
                for (const consulta of consultasAgendadas) {
                    imprimirConsulta(consulta);
                }
            }
            break;
        }
    } else {
        console.log('Opção inválida. Tente novamente.');
    }

    console.log('------------------------------------------------------------------------------');
}

function temConsultaFutura(cpf) {
    const consultasFuturas = consultas.filter(
        (consulta) => consulta.cpf === cpf && DateTime.fromISO(consulta.data) > DateTime.now()
    ); // Filtra as consultas do paciente com CPF fornecido que estão no futuro

    return consultasFuturas.length > 0; // Retorna verdadeiro se existir pelo menos uma consulta futura
}

function obterConsultasPassadas(cpf) {
    const consultasPassadas = consultas.filter(
        (consulta) => consulta.cpf === cpf && DateTime.fromISO(consulta.data) < DateTime.now()
    ); // Filtra as consultas do paciente com CPF fornecido que já ocorreram

    return consultasPassadas; // Retorna as consultas passadas encontradas
}


module.exports = {
    agendarConsulta,
    cancelarAgendamento,
    listarAgenda,
    pacientes,
    agenda,
    lerDadosPaciente,
};
