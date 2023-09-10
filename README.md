## Aplicação:
- Aplicação genérica de exemplo, possui um CRUD de uma tabela genérica que possui "id" e "name".
- Endpoints:
    - GET /: Listar todos os itens
    - GET /{id}: Buscar item pelo ID
    - POST /: Criar novo item

## Projetos
### /sam-app
- Aplicação utiliza o AWS SAM (Serverless Application Model)
- API REST

### /sdk-js-app
- Aplicação utilizando CDK da AWS com Node/Javascript
- API REST

### /serverless-app
- Aplicação utilizando o Serverless Framework
- API HTTP 

### outras alternativas:
- Terraform


## Pré-requisitos

- aws cli:
    - Instalação do cli para seu SO no site da AWS
    - Configuração de um profile default ao menos: <code>aws configure</code>
    - Validar a configuração: <code>aws sts get-caller-identity</code>
- serverless
    - Instalação da cli do serverless framework: <code>npm install -g serverless</code>
    - Utilizar os comandos disponíveis:
        - <code>sls deploy</code>
        - <code>sls remove</code>
        - <code>sls offline start</code>
- sam
    - Instalação do cli para seu SO no site da AWS
    - Utilizar os comandos disponíveis:
        - <code>sam local start-api</code>
        - <code>sam local invoke "HelloWorldFunction" --event events/event.json</code>
        - <code>sam build</code>
        - <code>sam deploy --guided</code>
        - <code>sam destroy</code>
- cdk
    - Instalação do cli da cdk: <code>npm install -g aws-cdk</code>
    - Utilizar os comandos disponíveis:
        - <code>cdk bootstrap</code>
        - <code>cdk deploy</code>
        - <code>cdk destroy</code>
        