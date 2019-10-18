
const cheerio = require('cheerio'); 
const rp = require('request-promise'); 
let fs = require('fs');


const url = 'https://resultados.as.com/resultados/futbol/primera/2019_2020/jornada/regular_a_1/';

const objectRequest = {
    url,
    method: 'GET',
    headders: {
        'Content-type': 'text/html'
    }
}


rp(objectRequest)
    .then(response => {
        let $ = cheerio.load(response);
  

        let equiposLocales = $('.equipo-local > a > .nombre-equipo');
        let equiposVisitantes = $('.equipo-visitante > a > .nombre-equipo');
        let fechas = $('.info-evento > time[itemprop="startDate"]');
        let estadios = $('div.desplegable-info-evento > div > dl > dd');
        let resultados = $('.cont-resultado > .resultado');

        // equiposLocales.map((index, value) => {
        //     console.log(value.children[0].data);
        // });

        let resultadoFinal = [];
        let resultadoCSV = 'Equipo local; Equipo visitante; Fecha; Estadio; Resultado;\n';

        equiposLocales.each((index, value) => {
            
            let date = new Date(fechas[index].attribs.content).toUTCString().replace('GMT','');
            resultadoFinal[index] = {
                local: value.children[0].data,
                visitante: equiposVisitantes[index].children[0].data,
                fecha: date,
                estadio: estadios[index].children[0].data,
                resultado: resultados[index].children[0].data.trim().split('-').join('--')
            };
            resultadoCSV += `${resultadoFinal[index].local};${resultadoFinal[index].visitante};${resultadoFinal[index].fecha};${resultadoFinal[index].estadio};${resultadoFinal[index].resultado};\n`
        });


        fs.writeFileSync('./tabla_datos.csv', resultadoCSV);
        console.log("Registro almacenados correctamente en tabla_datos.csv")
    })
    .catch(err => {
        console.log('Error: ', err);
    });