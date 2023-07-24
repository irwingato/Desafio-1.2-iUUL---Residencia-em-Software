const PromptSync = require('prompt-sync');
const pacienteController = require('./controllers/pacienteController');
const agendaController = require('./controllers/agendaController');

const prompt = PromptSync({ sigint: true });
let sairDoPrograma = false;

// Função para exibir o menu principal do programa
function exibirMenuPrincipal() {
    while (!sairDoPrograma) {
        console.log('Menu Principal');
        console.log('1 - Cadastro de pacientes');
        console.log('2 - Agenda');
        console.log('3 - Fim');

        const opcaoPrincipal = prompt('Escolha uma opção: ');

        if (opcaoPrincipal === '1') {
            exibirMenuCadastroPacientes();
        } else if (opcaoPrincipal === '2') {
            exibirMenuAgenda();
        } else if (opcaoPrincipal === '3') {
            console.log('Opção 3 selecionada: Fim');
            sairDoPrograma = true;
        } else {
            console.log('Opção inválida. Tente novamente.');
        }
    }
}

// Função para exibir o menu de cadastro de pacientes
function exibirMenuCadastroPacientes() {
    while (!sairDoPrograma) {
        console.log('Cadastro de pacientes');
        console.log('1 - Incluir paciente');
        console.log('2 - Excluir paciente');
        console.log('3 - Listar pacientes (ordenado por CPF)');
        console.log('4 - Listar pacientes (ordenado por nome)');
        console.log('5 - Voltar');

        const opcaoCadastro = prompt('Escolha uma opção: ');

        if (opcaoCadastro === '1') {
            console.log('Opção 1 selecionada: Incluir paciente');
            const dadosPaciente = agendaController.lerDadosPaciente(prompt); // Passe o 'prompt' como argumento aqui
            pacienteController.incluirPaciente(dadosPaciente.cpf, dadosPaciente.nome, dadosPaciente.dataNascimento);
        
            console.log('Paciente cadastrado com sucesso!');
        } else if (opcaoCadastro === '2') {
            console.log('Opção 2 selecionada: Excluir paciente');
            const cpf = prompt('Digite o CPF do paciente: ');
            pacienteController.excluirPacienteDoCadastro(cpf);
        } else if (opcaoCadastro === '3') {
            const pacientesOrdenadosPorCPF = pacienteController.listarPacientesOrdenadosPorCPF();
            pacienteController.listarPacientes(pacientesOrdenadosPorCPF, 'CPF');
        } else if (opcaoCadastro === '4') {
            const pacientesOrdenadosPorNome = pacienteController.listarPacientesOrdenadosPorNome();
            pacienteController.listarPacientes(pacientesOrdenadosPorNome, 'Nome');
        } else if (opcaoCadastro === '5') {
            console.log('Opção 5 selecionada: Voltar');
            break;
        } else {
            console.log('Opção inválida. Tente novamente.');
        }
    }
}

// Função para exibir o menu da agenda
function exibirMenuAgenda() {
    let sairDoMenuAgenda = false;

    while (!sairDoMenuAgenda) {
        console.log('Menu Agenda');
        console.log('1 - Agendar consulta');
        console.log('2 - Cancelar agendamento');
        console.log('3 - Listar agenda');
        console.log('4 - Voltar');

        const opcaoAgenda = prompt('Escolha uma opção: ');

        if (opcaoAgenda === '1') {
            console.log('Opção 1 selecionada: Agendar consulta');
            agendaController.agendarConsulta(prompt);
        } else if (opcaoAgenda === '2') {
            console.log('Opção 2 selecionada: Cancelar agendamento');
            agendaController.cancelarAgendamento(prompt);
        } else if (opcaoAgenda === '3') {
            console.log('Opção 3 selecionada: Listar agenda');
            const opcaoListagem = prompt('Apresentar a agenda T-Toda ou P-Periodo: ').toUpperCase();
            agendaController.listarAgenda(opcaoListagem);
        } else if (opcaoAgenda === '4') {
            console.log('Opção 4 selecionada: Voltar');
            sairDoMenuAgenda = true; // Atualize o valor da variável para sair do loop
        } else {
            console.log('Opção inválida. Tente novamente.');
        }
    }
}

// Inicia o programa exibindo o menu principal
exibirMenuPrincipal();
