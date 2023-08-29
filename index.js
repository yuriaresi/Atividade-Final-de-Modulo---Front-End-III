let paginaAtual = 1;



async function criarPersonagens(personagens) {
    const div = document.querySelector(".personagem");
    div.innerHTML = "";

    for (const personagem of personagens) {
        const personagemStatus = personagem.status === "Alive" ? "🟢 Vivo" : personagem.status === "Dead" ? "🔴 Morto" : "⚪ Desconhecido";
        const personagemLocal = await localizacaoPersonagem(personagem);
        const episodios = await episodioPersonagem(personagem);
        
        const html = `
        <div class=" col-12 col-sm-6 col-lg-4 mb-5 d-flex justify-content-center">
            <div class="card teste" style="width: 18rem;">
                <img src="${personagem.image}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${personagem.name}</h5>
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
    
    }
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
        contadorEpisodio.innerHTML = `Episódios:<span class="text-danger"> ${contagemEpisodio}</span>`;
    } catch (error) {
        console.log(error.message);
    }

}

async function contadorLocalizacao() {
    try {
        const response = await axios.get("https://rickandmortyapi.com/api/location");
        const contagemLocalizacao = response.data.info.count;
        let contadorLocalizacao = document.querySelector(".contador-localizacao");
        contadorLocalizacao.innerHTML = `Localização: <span class="text-danger">${contagemLocalizacao}</span>`;
    }
    catch (error) { console.log(error.message); }
}


function urlAtual(url) {
    axios.get(url)
        .then(function (response) {
            const contagemPersonagem = response.data.info.count;
            let contadorPersonagem = document.querySelector(".contador-personagem");
            contadorPersonagem.innerHTML = `Personagens: <span class="text-danger">${contagemPersonagem}</span>`;

            console.log(response.data.info);

            const personagens = response.data.results;
            criarPersonagens(personagens);
            const proximoPagina = response.data.info.next;
            const paginaAnterior = response.data.info.prev;

            const botaoProximo = document.querySelector(".proximaPagina");
            const botaoVoltar = document.querySelector(".voltarPagina");

            botaoProximo.addEventListener("click", function () {
                if (proximoPagina) {
                    const loadingModal = new bootstrap.Modal(document.getElementById("loadingModal"));
                    loadingModal.show();
                    setTimeout(() => {
                        loadingModal.hide();
                    }, 500);
                    setTimeout(() => {
                        urlAtual(proximoPagina);

                    }, 1000);
                }
            });

            botaoVoltar.addEventListener("click", function () {
                if (paginaAnterior) {
                    const loadingModal = new bootstrap.Modal(document.getElementById("loadingModal"));
                    loadingModal.show();
                    setTimeout(() => {
                        loadingModal.hide();
                    }, 500);
                    setTimeout(() => {
                        urlAtual(paginaAnterior);

                    }, 1000);

                }
            });


            const proximoPagina2 = response.data.info.next;
            const paginaAnterior2 = response.data.info.prev;

            const botaoProximo2 = document.querySelector(".proximaPagina2");
            const botaoVoltar2 = document.querySelector(".voltarPagina2");

            botaoProximo2.addEventListener("click", function () {
                if (proximoPagina2) {
                    const loadingModal = new bootstrap.Modal(document.getElementById("loadingModal"));
                    loadingModal.show();
                    setTimeout(() => {
                        loadingModal.hide();
                    }, 500);
                    setTimeout(() => {
                        urlAtual(proximoPagina2);

                    }, 1000);
                }
            });

            botaoVoltar2.addEventListener("click", function () {
                if (paginaAnterior2) {
                    const loadingModal = new bootstrap.Modal(document.getElementById("loadingModal"));
                    loadingModal.show();
                    setTimeout(() => {
                        loadingModal.hide();
                    }, 500);
                    setTimeout(() => {
                        urlAtual(paginaAnterior2);

                    }, 1000);

                }
            });

        })
        .catch(function (error) {
            console.log(error.message);
        });
}



urlAtual("https://rickandmortyapi.com/api/character?page=" + paginaAtual);
contadorEpisodio();
contadorLocalizacao();

// Função para lidar com a pesquisa de personagens


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



// Adicione o evento de submit do formulário de pesquisa
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
