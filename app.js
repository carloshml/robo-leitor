const puppeteer = require('puppeteer');

async function start(){
    async  function loadMore(page, selector){
        // apenas o primeiro $
        const moreButton = await page.$(selector);
        if(moreButton){
            console.log('Ocorreu mais um clique');
           await moreButton.click();
           await page.waitFor(selector,{ timeout:4000})
                     .catch( e =>{ console.log('TimeoutError');})
           await loadMore(page, selector);
        }
    };
    async  function getComment(page, selector){
        // Todos $$
        const comments = await page.$$eval(selector, links=>{
            return  links.map(link=>{
              return  link.innerText;
            });
        });   
        
        return comments;
    };
    
   const browser = await puppeteer.launch();
   const page = await browser.newPage();
   await page.goto('https://www.instagram.com/p/CC92z3DhnKr/');
   await loadMore(page, '.dCJp8'); 
   const arrobasEmComentarios = await getComment(page, '.C4VMK span a');   
   const arrobasOrdenados = ordenar(count(arrobasEmComentarios));   
   for (let index = 0; index < arrobasOrdenados.length; index++) {      
        console.log('\x1b[36m',
         `${index}o Lugar: ${arrobasOrdenados[index].arroba}, quantidade:${arrobasOrdenados[index].qtd}` ,
         '\x1b[0m');
   }    
   await browser.close();
}
 

// constar arrobas repetidas;
function count(arrobas){
    const count = {};
    arrobas.forEach(arrobas => {
        count[arrobas] = (count[arrobas]|| 0)+1;       
    });
    return count;    
}

function ordenar(counted){
    const entries= [];
    for(prop in counted){
        entries.push({arroba: prop, qtd: counted[prop]})
    }
    const organizados = entries.sort((a,b)=>{
    return  b.qtd - a.qtd;
    });
    return organizados;
}

// console.log(count(arrobafake));
// const retorno = ordenar(count(arrobafake));
// console.log('retorno', retorno);

start();
