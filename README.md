Passos durante a execução do projeto

Primeiro passo foi configurar o ambiente, uso windows 11 então resolvi usar WSL2 com linux ubuntu 22.04 que é o que uso para meus projetos.
Instalação do Docker Desktop e deixei o meu linux como padrão.
Configurei o VS Code para conseguir acessar o WSL.
Pelo VS Code aberto no diretório do linux, instalei o nvm e node, ultima versão disponível no git oficial
Após reiniciar o VS Code, instalei o Angular cli
Comecei criando a estrutura das pastas na pasta do projeto
Iniciei o npm dentro da pasta backend
Depois de pesquisar as dependencias que o projeto teria fiz a instalação delas, express, amqplib, uuid, dotenv e cors
Próximo foi configurar a conexão com o RabbitMQ, os endpoint HTTP, quem consome as mensagens e o arquivo com as constantes (variáveis de ambiente)
Iniciei a parte de docker para levantar o back com mais segurança e menor chance de conflito entre versões etc
Rodei o arquivo docker usando o docker compose 
Após, usando o angular cli criei o projeto frontend 
Na pasta gerada foi instalado a dependencia do uuid e iniciado o trabalho front
Criação dos serviços de notificação usando o angular 
Depois criei a parte visual para o usuário enviar as notificações
Após parte visual, usei o próprio angular para iniciar em localhost o resultado
Tive problema com zone mas logo resolvido e projeto finalizado 
Para rodar, naveguei até a pasta raiz, subi o docker-compose, naveguei até a pasta front e iniciei o server com o Angular
