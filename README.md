# 🚀 Armagedon Tracker

O **Armagedon Tracker** é uma aplicação web de monitorização espacial que consome dados reais da **API NeoWs (Near Earth Object Web Service) da NASA**. O objetivo do projeto é processar dados astronómicos complexos e transformá-los numa interface intuitiva para análise de asteroides em rota de aproximação com a Terra.

## 🛠️ Tecnologias e Conceitos Aplicados

* **JavaScript (ES6+)**: Implementação de lógica assíncrona utilizando `Async/Await` e `Fetch API` para consumo de dados externos.
* **Manipulação Dinâmica do DOM**: Renderização de interface em tempo real baseada no processamento de objetos JSON.
* **CSS Moderno**: Arquitetura de layout baseada em **CSS Grid** e **Flexbox** para visualização de métricas técnicas.
* **Integração de APIs REST**: Autenticação e consumo de endpoints estruturados da NASA.

## ✨ Funcionalidades Principais

* 🔍 **Consulta por ID**: Localização imediata de objetos específicos no banco de dados da NASA através do seu identificador único.
* 🚨 **Detecção de Ameaças (PHA)**: Algoritmo de filtragem que identifica automaticamente asteroides classificados como **Potencialmente Perigosos**, com base em magnitude absoluta e distância orbital.
* 🛰️ **Painel Orbital Interativo**: Integração do módulo 3D "Eyes on Asteroids" da NASA via `iframe`, com sincronização dinâmica via JavaScript para focar no objeto pesquisado.
* 📊 **Extração de Métricas**: Exibição detalhada de diâmetro estimado, velocidade relativa (km/h), distância em escala lunar e classe de órbita.

<img width="1920" height="1080" alt="Screenshot_20260301_142050" src="https://github.com/user-attachments/assets/7a5867cb-4e56-4973-8e54-021a5387cec8" />
<hr>
<img width="1920" height="1080" alt="Screenshot_20260301_142038" src="https://github.com/user-attachments/assets/684b8b60-877f-4fef-8b6a-4611ec87e3e0" />
<hr>
<img width="1920" height="1080" alt="Screenshot_20260301_142018" src="https://github.com/user-attachments/assets/19f0aa68-554b-49d8-a150-0e38813b9473" />
<hr>
<img width="1920" height="1080" alt="Screenshot_20260301_141543" src="https://github.com/user-attachments/assets/f6ee11ca-d708-4fb6-9bc3-bf5f02c51c84" />

## 🚀 Novas Implementações Técnicas

Recentemente, o projeto recebeu uma atualização na lógica de sincronização:
1.  **Tratamento de Strings**: Implementação de funções para formatar nomes de asteroides (remoção de caracteres especiais e conversão para *snake_case*) para permitir o *Deep Linking* com o mapa 3D da NASA.
2.  **Dashboard de Dados**: Organização das métricas em colunas técnicas para facilitar a leitura comparativa entre dados numéricos e a visualização gráfica.

## 📂 Como Executar o Projeto

1. Faça o clone deste repositório:
   ```bash
   git clone https://github.com/gabrielgoncalves-hub/armagedon-tracker.git
