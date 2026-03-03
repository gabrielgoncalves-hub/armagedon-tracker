const api_key = "6oaOhff67yHUTYX1lt0MP0Fn4DPcgKck8Yk4p9JC";

function renderizarCard(dados) {
    const isPerigoso = dados.is_potentially_hazardous_asteroid;
    const maxDiam = dados.estimated_diameter.meters.estimated_diameter_max;
    const minDiam = dados.estimated_diameter.meters.estimated_diameter_min;
    
    const aproximacaoAtual = dados.close_approach_data[0];
    const velocidade = parseFloat(aproximacaoAtual.relative_velocity.kilometers_per_hour).toLocaleString('pt-BR');
    const distanciaLunar = parseFloat(aproximacaoAtual.miss_distance.lunar).toFixed(1);
    
    const dataDescBrasil = dados.orbital_data.first_observation_date.split('-').reverse().join('/');
    
    const incerteza = dados.orbital_data.orbit_uncertainty;
    const confianca = incerteza <= 1 ? "Máxima" : incerteza <= 4 ? "Alta" : "Moderada";

    let proximaDataHtml = "";
    if (isPerigoso) {
        const hoje = new Date();
        const proximaAproximacao = dados.close_approach_data.find(ap => {
            const dataAp = new Date(ap.close_approach_date);
            return dataAp > hoje;
        });

        if (proximaAproximacao) {
            const dataProxBrasil = proximaAproximacao.close_approach_date.split('-').reverse().join('/');
            proximaDataHtml = `
                <div class="alerta-proximidade">
                    <span>⚠️ Próxima Aproximação Máxima:</span>
                    <strong>${dataProxBrasil}</strong>
                </div>
            `;
        }
    }

    return `
        <div class="asteroid-card">
            <div class="card-header">
                <h3>${dados.name}</h3>
                <span class="badge ${isPerigoso ? 'danger' : 'safe'}">
                    ${isPerigoso ? 'PERIGOSO' : 'SEGURO'}
                </span>
            </div>

            <div class="card-diametros">
                <p>Descoberto em: <strong>${dataDescBrasil}</strong></p>
                <p>Diâmetro Máx: <strong>${maxDiam.toFixed(2)} m</strong></p>
            </div>

            ${proximaDataHtml}

            <div class="card-body-grid">
                <div class="info-item"><span>🚀 Velocidade</span><strong>${velocidade} km/h</strong></div>
                <div class="info-item"><span>🌙 Distância</span><strong>${distanciaLunar}x Lua</strong></div>
                <div class="info-item"><span>🔭 Confiança</span><strong>${confianca}</strong></div>
                <div class="info-item"><span>✨ Magnitude</span><strong>${dados.absolute_magnitude_h}</strong></div>
            </div>
            
            <div style="text-align: center; margin-top: 15px;">
                <a href="${dados.nasa_jpl_url}" target="_blank" style="color: inherit; font-size: 0.8rem;">Ver detalhes no site da NASA</a>
            </div>
        </div>
    `;
}

async function mostrarAsteroid() {
    let id = document.getElementById("id_asteroid").value;
    let container = document.querySelector(".principal-asteroid");
    let iframe = document.getElementById("meu-iframe-nasa");

    if (!id) return;

    try {
        const response = await fetch(`https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=${api_key}`);
        if (!response.ok) throw new Error("ID não encontrado");
        const dados = await response.json();
        let nomeTratado = dados.name
            .replace(/[()]/g, "")   
            .trim()                
            .toLowerCase()       
            .replace(/\s+/g, "_");

        container.innerHTML = renderizarCard(dados);
        console.log(dados)

        if (iframe) {
            iframe.src = `https://eyes.nasa.gov/apps/asteroids/#/${nomeTratado}`;
        }
    } catch (erro) {
        container.innerHTML = `<p style="color: red;">Erro: ${erro.message}</p>`;
    }
}

function resetarMapa() {
    const iframe = document.getElementById("meu-iframe-nasa");
    if (iframe) {
        iframe.src = "https://eyes.nasa.gov/apps/asteroids/";
    }
}

async function buscarPerigososHoje() {
    let container = document.querySelector(".principal-asteroid");
    const hoje = new Date().toISOString().split('T')[0];
    
    container.innerHTML = "<p>Buscando ameaças no espaço...</p>";

    try {
        const response = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${hoje}&end_date=${hoje}&api_key=${api_key}`);
        const dados = await response.json();
        
        const asteroidesHoje = dados.near_earth_objects[hoje];
        const perigosos = asteroidesHoje.filter(a => a.is_potentially_hazardous_asteroid === true);

        if (perigosos.length > 0) {
            container.innerHTML = `<h4>⚠️ ${perigosos.length} ameaça(s) detectada(s)!</h4>` + renderizarCard(perigosos[0]);
        } else {
            container.innerHTML = "<p>✅ Nenhum dos asteroides monitorados hoje é perigoso.</p>";
        }
    } catch (erro) {
        container.innerHTML = "<p>Erro ao conectar com a NASA.</p>";
    }
}

async function buscarClimaDinamico() {
    const weather_key = "1ab579b25b06552a1976828bab62cb6f";;

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weather_key}&units=metric&lang=pt_br`;
            
            await processarDadosClima(url);
        }, async (erro) => {
            console.warn("Localização negada. Usando Bragança Paulista como padrão.");
            const urlPadrao = `https://api.openweathermap.org/data/2.5/weather?q=Braganca Paulista&appid=${weather_key}&units=metric&lang=pt_br`;
            await processarDadosClima(urlPadrao);
        });
    }
}

async function processarDadosClima(url) {
    try {
        const response = await fetch(url);
        const dados = await response.json();

        document.getElementById("clima-cidade").innerText = dados.name.toUpperCase();
        document.getElementById("clima-temp").innerText = `${Math.round(dados.main.temp)}°C`;
        document.getElementById("clima-desc").innerText = dados.weather[0].description.toUpperCase();

        const statusObs = document.getElementById("clima-status-obs");
        if (dados.clouds.all < 30) {
            statusObs.innerText = "🔭 Céu limpo: Ideal para observação!";
            statusObs.style.color = "#000000";
        } else {
            statusObs.innerText = "☁️ Céu nublado: Visibilidade reduzida.";
            statusObs.style.color = "#000000";
        }
    } catch (erro) {
        console.error("Erro na API de clima:", erro);
    }
}

// Inicializa a busca ao carregar a página
window.addEventListener('load', buscarClimaDinamico);