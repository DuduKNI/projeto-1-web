document.addEventListener("DOMContentLoaded", function(){
    const musicasContainer = document.getElementById('musicas');
    const popupDetalhesMusica = document.getElementById('popupDetalhesMusica');
    const detalhesMusicaContainer = document.getElementById('detalhesMusica');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const tituloMusicas = document.querySelector('h1');

    //Função para buscar músicas
    async function buscarMusicas(termo){
        //Limpa a consulta anterior
        musicasContainer.innerHTML = '';
        //URL da API do itunes
        const apiUrl = `https://itunes.apple.com/search?term=${termo}&entity=musicTrack&limit=10`;

        try {
            const resposta = await axios.get(apiUrl);
            const musicasData = resposta.data.results;
            if (musicasData.length === 0) {
                exibirErro('Nenhuma música encontrada.');
            } else {
                exibirMusicas(musicasData);
            }
        } catch (error) {
            console.error('Erro ao carregar as músicas :(', error);
        }
    }

    //Função para exibir músicas da página
    function exibirMusicas(musicas){
        musicas.forEach(musica => {
            const musicaDiv = document.createElement('div');
            musicaDiv.classList.add('musica');

            const titulo = document.createElement('h2');
            titulo.textContent = musica.trackName;

            const artista = document.createElement('p');
            artista.textContent = 'Artista: ' + musica.artistName;

            const imagem = document.createElement('img');
            imagem.src = musica.artworkUrl100;
            imagem.alt = `${musica.trackName} - ${musica.artistName}`;
            imagem.classList.add('musica-imagem');

            musicaDiv.addEventListener('click', function(){
                exibirDetalhesMusica(musica);
            });

            musicaDiv.appendChild(imagem);
            musicaDiv.appendChild(titulo);
            musicaDiv.appendChild(artista);

            musicasContainer.appendChild(musicaDiv);
        });
    }

    // Função para exibir mensagem de erro
    function exibirErro(mensagem) {
        const erroContainer = document.getElementById('erroContainer');
        erroContainer.textContent = mensagem;
        erroContainer.style.display = 'block';
    }

    // Função para ocultar mensagem de erro
    function ocultarErro() {
        const erroContainer = document.getElementById('erroContainer');
        erroContainer.style.display = 'none';
    }

    //Adiciona um evento de clique no botao de pesquisa
    searchButton.addEventListener('click', function(){
        const termo = searchInput.value.trim();
        if (termo !== '') {
            buscarMusicas(termo);
        } else {
            exibirErro('Por favor, digite um termo de pesquisa');
        }
    });

    //Adiciona um evento de pressionar Enter
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const termo = searchInput.value.trim();
            if (termo !== '') {
                buscarMusicas(termo);
            } else {
                exibirErro('Por favor, digite um termo de pesquisa');
            }
        }
    });

    //Adiciona um popup quando clicar em uma música
    function exibirDetalhesMusica(musica){
        detalhesMusicaContainer.innerHTML = `
            <h2>${musica.collectionName}</h2>
            <p>Artista: ${musica.artistName}</p>
            <p>Data de Lançamento: ${new Date(musica.releaseDate).toLocaleDateString()}</p>
            <p>Gênero: ${musica.primaryGenreName}</p>
            <p>Preço do Álbum: ${musica.collectionPrice} ${musica.currency}</p>
            <img src="${musica.artworkUrl100}" alt="${musica.collectionName} - ${musica.artistName}" class="musica-imagem">
        `;
        popupDetalhesMusica.style.display = 'block';
    }

    // Função para fechar o popup
    function fecharPopup(){
        popupDetalhesMusica.style.display = 'none';
        detalhesMusicaContainer.innerHTML = '';
    }

    tituloMusicas.addEventListener('click', function(){
        ocultarErro();
    });

    document.getElementById('closeButton').addEventListener('click', fecharPopup);
});
