import PromptSync from 'prompt-sync'; // Importa a biblioteca 'prompt-sync' para receber input do usuário
import moment from 'moment'; // Importa a biblioteca 'moment' para trabalhar com datas e horários
import { DateTime } from 'luxon'; // Importa a classe 'DateTime' da biblioteca 'luxon' para trabalhar com datas e horários

const prompt = PromptSync({ sigint: true }); // Cria uma instância do prompt-sync para receber input do usuário

class Paciente {
    constructor(cpf, nome, dataNascimento) {
        this.cpf = cpf; // Atribui o valor do CPF fornecido ao atributo 'cpf' do paciente
        this.nome = nome; // Atribui o valor do nome fornecido ao atributo 'nome' do paciente
        this.dataNascimento = dataNascimento; // Atribui o valor da data de nascimento fornecida ao atributo 'dataNascimento' do paciente
    }
}

const pacientes = []; // Cria um array vazio para armazenar os pacientes cadastrados
const consultas = []; // Cria um array vazio para armazenar as consultas agendadas
let agenda = []; // Cria um array vazio para armazenar a agenda de consultas

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

function incluirPaciente() {
    while (true) {
        const cpf = prompt('CPF: '); // Solicita ao usuário que digite o CPF
        if (!validarCPF(cpf)) { // Verifica se o CPF é válido usando a função validarCPF
            console.log('CPF inválido. Tente novamente.');
            continue; // Reinicia o loop se o CPF for inválido
        }

        const nome = prompt('Nome: '); // Solicita ao usuário que digite o nome
        if (!validarNome(nome)) { // Verifica se o nome é válido usando a função validarNome
            console.log('Nome inválido. O nome deve ter pelo menos 5 caracteres.');
            continue; // Reinicia o loop se o nome for inválido
        }

        const dataNascimento = prompt('Data de nascimento (formato DD/MM/AAAA): '); // Solicita ao usuário que digite a data de nascimento
        if (!validarDataNascimento(dataNascimento)) { // Verifica se a data de nascimento é válida usando a função validarDataNascimento
            console.log('Data de nascimento inválida. O paciente deve ter pelo menos 13 anos.');
            continue; // Reinicia o loop se a data de nascimento for inválida
        }

        const paciente = new Paciente(cpf, nome, dataNascimento); // Cria um novo objeto Paciente com os dados fornecidos
        if (pacientes.find((p) => p.cpf === paciente.cpf)) { // Verifica se já existe um paciente cadastrado com o mesmo CPF
            console.log('Erro: CPF já cadastrado. Tente novamente.');
            continue; // Reinicia o loop se o CPF já estiver cadastrado
        }

        pacientes.push(paciente); // Adiciona o paciente ao array de pacientes
        console.log('Paciente cadastrado com sucesso!');
        break; // Sai do loop
    }
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

function verificarPacienteCadastrado(cpf) {
    return pacientes.some((paciente) => paciente.cpf === cpf); // Verifica se existe um paciente cadastrado com o CPF fornecido
}

function excluirPacienteDoCadastro(cpf) {
    const indicePaciente = pacientes.findIndex((paciente) => paciente.cpf === cpf); // Encontra o índice do paciente com o CPF fornecido no array de pacientes

    if (indicePaciente !== -1) { // Verifica se o paciente foi encontrado no array
        pacientes.splice(indicePaciente, 1); // Remove o paciente do array
        console.log(`Paciente com CPF ${cpf} excluído do cadastro.`);
    } else {
        console.log(`Paciente com CPF ${cpf} não encontrado.`);
    }
}

function excluirConsultaPassada(cpf, data) {
    const consultasAgendadas = obterConsultasPassadas(cpf); // Obtém as consultas passadas do paciente com o CPF fornecido
    const indiceConsulta = consultasAgendadas.findIndex((consulta) => consulta.data === data); // Encontra o índice da consulta com a data fornecida no array de consultas passadas

    if (indiceConsulta !== -1) { // Verifica se a consulta foi encontrada no array
        consultasAgendadas.splice(indiceConsulta, 1); // Remove a consulta do array
        console.log(`Consulta agendada para o paciente com CPF ${cpf} na data ${data} excluída.`);
    } else {
        console.log(`Consulta agendada para o paciente com CPF ${cpf} na data ${data} não encontrada.`);
    }
}

function excluirPaciente(cpf) {
    const pacienteCadastrado = verificarPacienteCadastrado(cpf); // Verifica se o paciente está cadastrado

    if (!pacienteCadastrado) {
        console.log('Erro: Paciente não cadastrado.');
        return;
    }

    if (temConsultaFutura(cpf)) {
        console.log('Erro: Paciente está agendado.');
        return;
    }

    const consultasPassadas = obterConsultasPassadas(cpf); // Obtém as consultas passadas do paciente

    excluirPacienteDoCadastro(cpf); // Remove o paciente do cadastro

    for (const consulta of consultasPassadas) {
        excluirConsultaPassada(consulta.cpf, consulta.data); // Remove as consultas passadas do paciente
    }

    console.log('Paciente excluído com sucesso.');
}

function calcularTempoConsulta(horaInicial, horaFinal) {
    const formatoHora = 'HHmm';
    const horaInicialFormatada = DateTime.fromFormat(horaInicial, formatoHora); // Converte a string da hora inicial para um objeto DateTime
    const horaFinalFormatada = DateTime.fromFormat(horaFinal, formatoHora); // Converte a string da hora final para um objeto DateTime

    const duracao = horaFinalFormatada.diff(horaInicialFormatada, 'minutes'); // Calcula a diferença de tempo em minutos entre a hora final e a hora inicial
    return duracao.minutes; // Retorna a duração da consulta em minutos
}

function pesquisarPacientePorCPF(cpf) {
    return pacientes.find((paciente) => paciente.cpf === cpf) || null; // Pesquisa o paciente com o CPF fornecido no array de pacientes e retorna o paciente encontrado ou null se não for encontrado
}

function agendarConsulta() {
    const cpf = prompt('Digite o CPF: '); // Solicita ao usuário que digite o CPF
    const paciente = pesquisarPacientePorCPF(cpf); // Pesquisa o paciente com o CPF fornecido

    if (!paciente) {
        console.log('Erro: paciente não cadastrado.');
        return;
    }

    while (true) {
        const dataConsulta = prompt('Digite a data da consulta (DD/MM/YYYY): '); // Solicita ao usuário que digite a data da consulta
        const horaInicial = prompt('Digite a hora inicial da consulta (HHmm): '); // Solicita ao usuário que digite a hora inicial da consulta
        const horaFinal = prompt('Digite a hora final da consulta (HHmm): '); // Solicita ao usuário que digite a hora final da consulta

        const dataConsultaFormatada = DateTime.fromFormat(dataConsulta, 'dd/MM/yyyy'); // Converte a string da data da consulta para um objeto DateTime
        const horaInicialFormatada = DateTime.fromFormat(horaInicial, 'HHmm'); // Converte a string da hora inicial para um objeto DateTime
        const horaFinalFormatada = DateTime.fromFormat(horaFinal, 'HHmm'); // Converte a string da hora final para um objeto DateTime

        const dataAtual = DateTime.now(); // Obtém a data e hora atuais

        if (dataConsultaFormatada <= dataAtual || (dataConsultaFormatada === dataAtual && horaInicialFormatada <= dataAtual)) {
            console.log('Erro: A data e hora da consulta devem ser para um período futuro.');
            continue;
        }

        // Restante do código de validação...

        const tempo = calcularTempoConsulta(horaInicial, horaFinal); // Calcula a duração da consulta em minutos usando a função calcularTempoConsulta

        const consulta = {
            cpfPaciente: cpf,
            dataConsulta: dataConsulta,
            horaInicio: horaInicial,
            horaFim: horaFinal,
            tempo: tempo,
            nome: paciente.nome,
            dataNascimento: paciente.dataNascimento
        }; // Cria um objeto com os dados da consulta

        consultas.push(consulta); // Adiciona a consulta ao array de consultas
        console.log('Agendamento realizado com sucesso!');
        break; // Sai do loop
    }
}


function calcularIdade(dataNascimento, dataAtual) {
    const diffYears = dataAtual.diff(dataNascimento, 'years').years; // Calcula a diferença de anos entre a data de nascimento e a data atual
    return diffYears >= 0 ? diffYears : null; // Retorna a idade em anos se for maior ou igual a zero, caso contrário, retorna null
}

function listarPacientesOrdenadosPorCPF() {
    console.log('Opção 3 selecionada: Listar pacientes (ordenado por CPF)');
    console.log('------------------------------------------------------------------------------');
    console.log('CPF                Nome                                       Dt.Nasc.   Idade');
    console.log('------------------------------------------------------------------------------');
    pacientes.sort((a, b) => a.cpf.localeCompare(b.cpf)); // Ordena o array de pacientes pelo CPF em ordem crescente

    const dataAtual = DateTime.now();

    for (const paciente of pacientes) {
        const dataNascimento = DateTime.fromFormat(paciente.dataNascimento, 'dd/MM/yyyy'); // Converte a string da data de nascimento para um objeto DateTime
        const idade = calcularIdade(dataNascimento, dataAtual); // Calcula a idade do paciente usando a função calcularIdade
        const idadeFormatada = idade && typeof idade === 'number' ? Math.floor(idade).toString().padStart(3) : 'N/A'; // Formata a idade como string e preenche com zeros à esquerda se necessário
        console.log(`${paciente.cpf}        ${paciente.nome.padEnd(43)}${paciente.dataNascimento} ${idadeFormatada}`);
    }

    console.log('------------------------------------------------------------------------------');
}

function listarPacientesOrdenadosPorNome() {
    const pacientesOrdenados = pacientes.slice().sort((a, b) => a.nome.localeCompare(b.nome)); // Cria uma cópia do array de pacientes e ordena pelo nome em ordem alfabética

    console.log('Opção 4 selecionada: Listar pacientes (ordenado por nome)');
    console.log('------------------------------------------------------------------------------');
    console.log('CPF                Nome                                       Dt.Nasc.   Idade');
    console.log('------------------------------------------------------------------------------');

    const dataAtual= DateTime.now();

    for (const paciente of pacientesOrdenados) {
        const dataNascimento = DateTime.fromFormat(paciente.dataNascimento, 'dd/MM/yyyy'); // Converte a string da data de nascimento para um objeto DateTime
        const idade = calcularIdade(dataNascimento, dataAtual); // Calcula a idade do paciente usando a função calcularIdade
        const idadeFormatada = idade && typeof idade === 'number' ? Math.floor(idade).toString().padStart(3) : 'N/A'; // Formata a idade como string e preenche com zeros à esquerda se necessário
        console.log(`${paciente.cpf}        ${paciente.nome.padEnd(43)}${paciente.dataNascimento} ${idadeFormatada}`);

        const consultasAgendadas = obterConsultasPassadas(paciente.cpf); // Obtém as consultas passadas do paciente
        if (consultasAgendadas.length > 0) {
            for (const consulta of consultasAgendadas) {
                console.log(`${' '.repeat(20)}Agendado para: ${consulta.dataConsulta}`);
                console.log(`${' '.repeat(20)}${consulta.horaInicio} às ${consulta.horaFim}`);
            }
        }
    }

    console.log('------------------------------------------------------------------------------');
}

function cancelarAgendamento() {
    const cpf = prompt('Digite o CPF do paciente: '); // Solicita ao usuário que digite o CPF do paciente
    const dataConsulta = prompt('Digite a data da consulta (DD/MM/YYYY): '); // Solicita ao usuário que digite a data da consulta
    const horaInicial = prompt('Digite a hora inicial da consulta (HHmm): '); // Solicita ao usuário que digite a hora inicial da consulta

    const consultaEncontrada = consultas.find(
        (consulta) =>
            consulta.cpfPaciente === cpf &&
            consulta.dataConsulta === dataConsulta &&
            consulta.horaInicio === horaInicial
    ); // Procura a consulta no array de consultas usando o CPF, data e hora fornecidos

    if (consultaEncontrada) { // Verifica se a consulta foi encontrada
        const indiceConsulta = consultas.indexOf(consultaEncontrada); // Encontra o índice da consulta no array de consultas
        consultas.splice(indiceConsulta, 1); // Remove a consulta do array
        console.log('Agendamento cancelado com sucesso!');
    } else {
        console.log('Agendamento não encontrado.');
    }
}

function listarAgenda() {
    const opcaoAgenda = prompt('Apresentar a agenda T-Toda ou P-Periodo: P '); // Solicita ao usuário que escolha a opção de visualização da agenda
    console.log('------------------------------------------------------------------------------');
    console.log('Data           H.Ini   H.Fim Tempo Nome                    Dt.Nasc.');
    console.log('------------------------------------------------------------------------------');

    const dataAtual = DateTime.now();

    if (opcaoAgenda.toUpperCase() === 'T') { // Verifica se a opção selecionada é 'T' (toda a agenda)
        const consultasAgendadas = consultas.filter(
            (consulta) => DateTime.fromFormat(consulta.dataConsulta, 'dd/MM/yyyy') > dataAtual
        ); // Filtra as consultas agendadas que ainda não ocorreram

        if (consultasAgendadas.length === 0) {
            console.log('Não há consultas agendadas.');
        } else {
            for (const consulta of consultasAgendadas) {
                console.log(
                    `${consulta.dataConsulta}     ${consulta.horaInicio}     ${consulta.horaFim} ${consulta.tempo}    ${consulta.nome}        ${consulta.dataNascimento}`
                );
            }
        }
    } else if (opcaoAgenda.toUpperCase() === 'P') { // Verifica se a opção selecionada é 'P' (período)
        const dataInicial = prompt('Informe a data inicial (DD/MM/AAAA): '); // Solicita ao usuário que digite a data inicial do período
        const dataFinal = prompt('Informe a data final (DD/MM/AAAA): '); // Solicita ao usuário que digite a data final do período

        const dataInicialFormatada = DateTime.fromFormat(dataInicial, 'dd/MM/yyyy'); // Converte a string da data inicial para um objeto DateTime
        const dataFinalFormatada = DateTime.fromFormat(dataFinal, 'dd/MM/yyyy'); // Converte a string da data final para um objeto DateTime

        const consultasAgendadas = consultas.filter((consulta) => {
            const dataConsulta = DateTime.fromFormat(consulta.dataConsulta, 'dd/MM/yyyy'); // Converte a string da data da consulta para um objeto DateTime
            return dataConsulta >= dataInicialFormatada && dataConsulta <= dataFinalFormatada; // Verifica se a data da consulta está dentro do período especificado
        });

        if (consultasAgendadas.length === 0) {
            console.log('Não há consultas agendadas nesse período.');
        } else {
            for (const consulta of consultasAgendadas) {
                console.log(
                    `                ${consulta.dataConsulta} ${consulta.horaInicio} ${consulta.horaFim} ${consulta.tempo} ${consulta.nome} ${consulta.dataNascimento}`
                );
            }
        }
    } else {
        console.log('Opção inválida.');
    }

    console.log('------------------------------------------------------------------------------');
}


let sairDoPrograma = false; // Variável que controla se o programa deve sair

function exibirMenuPrincipal() {
    while (!sairDoPrograma) { // Loop principal do menu
        console.log('Menu Principal');
        console.log('1 - Cadastro de pacientes');
        console.log('2 - Agenda');
        console.log('3 - Fim');

        const opcaoPrincipal = prompt('Escolha uma opção: '); // Solicita ao usuário que escolha uma opção

        if (opcaoPrincipal === '1') {
            exibirMenuCadastroPacientes(); // Chama a função para exibir o menu de cadastro de pacientes
        } else if (opcaoPrincipal === '2') {
            exibirMenuAgenda(); // Chama a função para exibir o menu da agenda
        } else if (opcaoPrincipal === '3') {
            console.log('Opção 3 selecionada: Fim');
            sairDoPrograma = true; // Define a variável para sair do programa
        } else {
            console.log('Opção inválida. Tente novamente.');
        }
    }
}

function exibirMenuCadastroPacientes() {
    while (!sairDoPrograma) { // Loop do menu de cadastro de pacientes
        console.log('Cadastro de pacientes');
        console.log('1 - Incluir paciente');
        console.log('2 - Excluir paciente');
        console.log('3 - Listar pacientes (ordenado por CPF)');
        console.log('4 - Listar pacientes (ordenado por nome)');
        console.log('5 - Voltar');

        const opcaoCadastro = prompt('Escolha uma opção: '); // Solicita ao usuário que escolha uma opção

        if (opcaoCadastro === '1') {
            console.log('Opção 1 selecionada: Incluir paciente');
            incluirPaciente(); // Chama a função para incluir um paciente
        } else if (opcaoCadastro === '2') {
            console.log('Opção 2 selecionada: Excluir paciente');
            const cpf = prompt('Digite o CPF do paciente: '); // Solicita ao usuário que digite o CPF do paciente
            excluirPaciente(cpf); // Chama a função para excluir um paciente
        } else if (opcaoCadastro === '3') {
            listarPacientesOrdenadosPorCPF(); // Chama a função para listar os pacientes ordenados por CPF
        } else if (opcaoCadastro === '4') {
            listarPacientesOrdenadosPorNome(); // Chama a função para listar os pacientes ordenados por nome
        } else if (opcaoCadastro === '5') {
            console.log('Opção 5 selecionada: Voltar');
            break; // Sai do loop do menu de cadastro e volta para o menu principal
        } else {
            console.log('Opção inválida. Tente novamente.');
        }
    }
}

function exibirMenuAgenda() {
    while (!sairDoPrograma) { // Loop do menu da agenda
        console.log('Menu Agenda');
        console.log('1 - Agendar consulta');
        console.log('2 - Cancelar agendamento');
        console.log('3 - Listar agenda');
        console.log('4 - Voltar');

        const opcaoAgenda = prompt('Escolha uma opção: '); // Solicita ao usuário que escolha uma opção

        if (opcaoAgenda === '1') {
            console.log('Opção 1 selecionada: Agendar consulta');
            agendarConsulta(); // Chama a função para agendar uma consulta
        } else if (opcaoAgenda === '2') {
            console.log('Opção 2 selecionada: Cancelar agendamento');
            cancelarAgendamento(); // Chama a função para cancelar um agendamento
        } else if (opcaoAgenda === '3') {
            console.log('Opção 3 selecionada: Listar agenda');
            listarAgenda(); // Chama a função para listar a agenda
        } else if (opcaoAgenda === '4') {
            console.log('Opção 4 selecionada: Voltar');
            break; // Sai do loop do menu da agenda e volta para o menu principal
        } else {
            console.log('Opção inválida. Tente novamente.');
        }
    }
}

exibirMenuPrincipal(); // Inicia o programa chamando a função para exibir o menu principal
