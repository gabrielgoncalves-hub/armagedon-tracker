const api_key = "6oaOhff67yHUTYX1lt0MP0Fn4DPcgKck8Yk4p9JC";

function renderizarCard(dados) {
    const maxDiam = dados.estimated_diameter.meters.estimated_diameter_max;
    const minDiam = dados.estimated_diameter.meters.estimated_diameter_min;
    const isPerigoso = dados.is_potentially_hazardous_asteroid;
    const velocidade = parseFloat(dados.close_approach_data[0].relative_velocity.kilometers_per_hour).toLocaleString('pt-BR');
    const distanciaLunar = parseFloat(dados.close_approach_data[0].miss_distance.lunar).toFixed(1);
    const orbitaTipo = dados.orbital_data?.orbit_class?.orbit_class_type || "N/A";

    return `
        <div class="asteroid-card">
            <div class="card-header">
                <h3>${dados.name}</h3>
                <span class="badge ${isPerigoso ? 'danger' : 'safe'}">
                    ${isPerigoso ? 'PERIGOSO' : 'SEGURO'}
                </span>
            </div>
            <div class="card-body">
                <div class="info-row"><span>Diâmetro Máximo:</span> <strong>${maxDiam.toFixed(2)} m</strong></div>
                <div class="info-row"><span>Diâmetro Mínimo:</span> <strong>${minDiam.toFixed(2)} m</strong></div>
            </div>
            <div class="card-body-grid">
                <div class="info-item"><span>🚀 Velocidade</span><strong>${velocidade} km/h</strong></div>
                <div class="info-item"><span>🌙 Distância</span><strong>${distanciaLunar}x Lua</strong></div>
                <div class="info-item"><span>🔭 Classe</span><strong>${orbitaTipo}</strong></div>
                <div class="info-item"><span>✨ Magnitude</span><strong>${dados.absolute_magnitude_h}</strong></div>
            </div>
            <div style="text-align: center; margin-top: 15px;">
                <a style="color: #FFFE7E;" href="${dados.nasa_jpl_url}" target="_blank" class="link-nasa">Ver detalhes no site da NASA</a>
            </div>
        </div>
    `;
}

async function mostrarAsteroid() {
    let id = document.getElementById("id_asteroid").value;
    let container = document.querySelector(".principal-asteroid");
    let iframe = document.getElementById("meu-iframe-nasa");

    try {
        const response = await fetch(`https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=${api_key}`);
        if (!response.ok) throw new Error("ID não encontrado");
        const dados = await response.json();
        let nomeOriginal = dados.name;
        let nomeTratado = nomeOriginal
            .replace(/[()]/g, "")   
            .trim()                
            .toLowerCase()       
            .replace(/\s+/g, "_");

        container.innerHTML = renderizarCard(dados);
        console.log(nomeTratado)

        if (iframe) {
            iframe.src = `https://eyes.nasa.gov/apps/asteroids/#/${nomeTratado}`;
        }
    } catch (erro) {
        container.innerHTML = `<p style="color: red;">Erro: ${erro.message}</p>`;
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
