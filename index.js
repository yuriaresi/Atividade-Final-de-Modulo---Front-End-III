let paginaAtual = 1;
let numeroPagina = document.querySelector(".numero-pagina");
let numeroPagina2 = document.querySelector("#numero-pagina");
let personagensAtuais = [];
buscarPersonagens();

async function criarPersonagens(personagens) {
    personagensAtuais = personagens;

    const div = document.querySelector(".personagem");
    div.innerHTML = "";

    personagens.forEach(async (personagem, indice ) => {
       
    
        const personagemStatus = personagem.status === "Alive" ? "🟢 Vivo" : personagem.status === "Dead" ? "🔴 Morto" : "⚪ Desconhecido";
        const personagemLocal = await localizacaoPersonagem(personagem);
        const episodios = await episodioPersonagem(personagem);

        const html = `
        <div onclick="chamarModal(personagensAtuais[${indice}])" class="init-hidden col-12 col-sm-6 col-lg-4 col-xxl-3 mb-5 d-flex justify-content-center">
            <div class="card teste" style="width: 18rem;">
                <img src="${personagem.image}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="text-white card-title">${personagem.name}</h5>
                </div>
                <ul class=" list-group list-group-flush">
                    <li class="teste text-white list-group-item"><b>${personagemStatus} - ${personagem.species}</b></li>
                    <li class="teste text-white list-group-item"><p>Ultima localização conhecida:</p><b>${personagemLocal}</b></li>
                    <li class="teste text-white list-group-item"><p>Episódio:</p><b>${episodios}</b></li>
                </ul>
            </div>
        </div>
        `;

        div.innerHTML += html;

    })
}

async function localizacaoPersonagem(personagem) {
    try {
        const response = await axios.get(personagem.location.url);
        return response.data.name;

    } catch (error) {
        console.log(error.message);
        return "Localização desconhecida";
    }
}

async function episodioPersonagem(personagem) {
    try {
        const response = await axios.get(personagem.episode[0]);
        return response.data.name;
    } catch (error) {
        console.log(error.message);
        return "Episódio desconhecido";
    }
}

async function contadorEpisodio() {
    try {
        const response = await axios.get("https://rickandmortyapi.com/api/episode");
        const contagemEpisodio = response.data.info.count;
        let contadorEpisodio = document.querySelector(".contador-episodio");
        contadorEpisodio.innerHTML = `Episódios:<span class="texto-nome"> <strong>${contagemEpisodio}</strong></span>`;
    } catch (error) {
        console.log(error.message);
    }

}

async function contadorLocalizacao() {
    try {
        const response = await axios.get("https://rickandmortyapi.com/api/location");
        const contagemLocalizacao = response.data.info.count;
        let contadorLocalizacao = document.querySelector(".contador-localizacao");
        contadorLocalizacao.innerHTML = `Localização: <span class="texto-nome"><strong>${contagemLocalizacao}</strong></span>`;
    }
    catch (error) { console.log(error.message); }
}


function buscarPersonagens() {

    axios.get("https://rickandmortyapi.com/api/character?page=" + paginaAtual)
        .then(function (response) {
            const contagemPersonagem = response.data.info.count;
            let contadorPersonagem = document.querySelector(".contador-personagem");
            contadorPersonagem.innerHTML = `Personagens: <span class="texto-nome"><strong>${contagemPersonagem}</strong></span>`;



            const personagens = response.data.results;

            criarPersonagens(personagens);


        })
        .catch(function (error) {
            console.log(error.message);
        });
}


function paginaInicial() {
    const loadingModal = new bootstrap.Modal(document.getElementById("loadingModal"));
    loadingModal.show();
    setTimeout(() => {
        loadingModal.hide();
    }, 500);
    setTimeout(() => {
        paginaAtual = 1;
        numeroPagina.innerHTML = paginaAtual;
        numeroPagina2.innerHTML = paginaAtual;
        buscarPersonagens();
    }, 500);
}
function clickNextBtn() {
    const loadingModal = new bootstrap.Modal(document.getElementById("loadingModal"));
    loadingModal.show();
    setTimeout(() => {
        loadingModal.hide();
    }, 500);
    setTimeout(() => {
        paginaAtual++;
        buscarPersonagens();
        numeroPagina.innerHTML = paginaAtual;
        numeroPagina2.innerHTML = paginaAtual;


    }, 500);

}
function clickPrevBtn() {

    const loadingModal = new bootstrap.Modal(document.getElementById("loadingModal"));
    loadingModal.show();
    setTimeout(() => {
        loadingModal.hide();
    }, 500);
    setTimeout(() => {
        paginaAtual--;
        buscarPersonagens();
        numeroPagina.innerHTML = paginaAtual;
        numeroPagina2.innerHTML = paginaAtual;

    }, 500);
}


contadorEpisodio();
contadorLocalizacao();


async function pesquisarPersonagens(termo) {
    try {

        const response = await axios.get(`https://rickandmortyapi.com/api/character/?name=${termo}`);
        const personagensEncontrados = response.data.results;

        const div = document.querySelector(".personagem");
        div.innerHTML = "";  // Limpa o conteúdo atual

        if (personagensEncontrados.length === 0) {
            div.innerHTML = "<p>Nenhum personagem encontrado.</p>";
        } else {
            criarPersonagens(personagensEncontrados);
        }
    } catch (error) {
        console.log(error.message);
        const div = document.querySelector(".personagem");
        const modal = new bootstrap.Modal(document.getElementById("notFoundModal"));
        modal.show();
    }
}



const searchButton = document.querySelector(".botao");
searchButton.addEventListener("click", function (event) {
    event.preventDefault();
    const searchTerm = document.querySelector(".form-control").value;
    const loadingModal = new bootstrap.Modal(document.getElementById("loadingModal"));
    loadingModal.show();
    setTimeout(() => {
        loadingModal.hide();
    }, 500);
    setTimeout(() => {


        pesquisarPersonagens(searchTerm);
    }, 500);
});



function chamarModal(personagem) {
    const modalContent = document.querySelector("#modalPersonagem");
    modalContent.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${personagem.name}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <img src="${personagem.image}" alt="${personagem.name}" class="img-fluid">
                    <p>Status: ${personagem.status}</p>
                    <p>Espécie: ${personagem.species}</p>
                    <p>Gênero: ${personagem.gender}</p>
                    <!-- Adicione mais detalhes conforme necessário -->
                </div>
            </div>
        </div>
    `;

    const myModalEl = new bootstrap.Modal(document.getElementById('modalPersonagem'));
    myModalEl.show();
}









// async function modalPersonagem() {
//     try {
//         let response = await axios.get("https://rickandmortyapi.com/api/character/"); {
//             const personagens = response.data.results;
//             for (const personagem of personagens) {
//                 const personagemStatus = personagem.status === "Alive" ? "🟢 Vivo" : personagem.status === "Dead" ? "🔴 Morto" : "⚪ Desconhecido";
//                 const div = document.querySelector("#modalPersonagem");
//                 const id = personagem.id;
//                 let html = `
//                 <div class="modal-dialog">
//               <div class="modal-content">
//                 <div class="modal-header">
//                   <h5 class="modal-title">${personagem.name}</h5>
//                   <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                 </div>
//                 <div class="modal-body">
//                   <p>Modal body text goes here.</p>
//                 </div>
//                 <div class="modal-footer">
//                   <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//                   <button type="button" class="btn btn-primary">Save changes</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//                 `;
//                 div.innerHTML = html;

//             }

//         }
//     } catch (error) {
//         console.log(error.message);
//     }
// }


// modalPersonagem();
