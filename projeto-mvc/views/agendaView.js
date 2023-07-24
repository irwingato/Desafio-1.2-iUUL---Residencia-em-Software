const { DateTime } = require('luxon');

function imprimirConsulta(consulta) {
    console.log(
        `${consulta.dataConsulta}     ${consulta.horaInicio}     ${consulta.horaFim} ${consulta.tempo}    ${consulta.nome}        ${consulta.dataNascimento}`
    );
}

function imprimirAgenda(consultas) {
    console.log('------------------------------------------------------------------------------');
    console.log('Data           H.Ini   H.Fim Tempo Nome                    Dt.Nasc.');
    console.log('------------------------------------------------------------------------------');

    const dataAtual = DateTime.now();

    if (consultas.length === 0) {
        console.log('Não há consultas agendadas.');
    } else {
        for (const consulta of consultas) {
            imprimirConsulta(consulta);
        }
    }

    console.log('------------------------------------------------------------------------------');
}

module.exports = {
    imprimirAgenda,
};
