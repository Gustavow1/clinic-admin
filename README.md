# Utilização

## Rodando manualmente

### Serviços
O primeiro passo é subir o Redis, RabbitMQ e o Postgres rodando docker-compose up -d na pasta raíz do projeto.

### Backend
```bash
# Entre na pasta backend
cd backend

# Crie o arquivo contendo as variáveis de ambiente
cp .env.example .env

# Instale as dependências
npm install

# Aplique a migração no banco de dados
npx prisma migrate deploy

# Rode o backend
npm start
```
### Frontend
```bash
# Entre na pasta frontend
cd frontend

# Crie o arquivo contendo as variáveis de ambiente
cp .env.example .env

# Instale as dependências
npm install

# Faça o build da aplicação
npm run build

# Rode o frontend
npm start
```
# Backend
Para o backend, utilizei NodeJs com NestJs e Prisma.

### Collections
A collection principal é a `Patients`, definida como no exemplo abaixo:
``` json
{
	"id": "89cecb6b-694d-4787-8ffc-bde04be070c6",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1970-01-01T00:00:00.000Z",
    "email": "emailx@gmail.com",
    "addresses": [
      {
        "state": "São Paulo",
        "city": "São Paulo",
        "street": "Rua 10 de janeiro",
        "zipCode": "03011000"
      }
    ],
    "documentIds": [
      {
        "number": "065.548.339-30",
        "type": "cpf"
      }
    ],
    "phoneNumbers": [
      {
        "number": "(44) 99131-6824",
        "type": "work"
      }
    ],
  }
  
```
Além dela, também existe a collection de `Logs`:

``` json
{
	"requestTime": "2024-11-27T17:53:34.111Z",
	"responseTime": "2024-11-27T17:53:34.145Z",
	"method": "POST",
	"url": "/patient",
	"statusCode": 200,
	"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 OPR/104.0.0.0",
	"body": {
    "email": "emailx@gmail.com",
    "lastName": "Doe",
    "addresses": [
      {
        "city": "São Paulo",
        "state": "São Paulo",
        "street": "Rua 10 de janeiro",
        "zipCode": "03011000"
      }
    ],
    "firstName": "John",
    "dateOfBirth": "1970-01-01T00:00:00.000Z",
    "documentIds": [
      {
        "type": "cpf",
        "number": "065.548.339-30"
      }
    ],
    "phoneNumbers": [
      {
        "type": "work",
        "number": "(44) 99131-6824"
      }
    ]
  },
	"params": {},
	"query": {}
}
```
### Autenticação
A autenticação é feita através de uma palavra chave, presente na variável de ambiente API_KEY. Para validar uma palavra chave, uma requisição é feita na rota http://localhost:5000/auth, passando no body a chave apiKey, e então a api retorna um token JWT (que contém a palavra chave testada pelo usuário) e se é válido. Este token é salvo no Redis e a cada requisição nas rotas protegidas pelo middleware de autenticação, é feita uma consulta no redis para verificar se o token está presente, e se a palavra chave é válida. Toda requisição protegida pelo middleware deve conter a chave token no header. Exemplo de body:

``` json
{
   "apiKey": "KEY_WORD"
}
```

### Validadores de input
Para validar os inputs recebidos pela API, utilizei o `class-validator` e criei funções de validação utilizando regex para verificar campos como email, número de telefone, documento, CEP.

### Limitadores
Apliquei um limite de requisições para a rota patients de 50 requisições por minuto para funções gerais e 2 requisições de criação por minuto.

### Middlewares
Dois middlewares foram implementados:
- Middleware de autenticação
- Middleware de log

### Testes automatizados
A aplicação conta com teste e2e, testando todas funcionalidades do sistema.

Para rodar, basta utilizar o comando `npm run test:e2e` (na pasta backend)

![image](https://github.com/Gustavow1/clinic/blob/main/assets/testE2E.png)

### Documentação (Swagger)
A documentação completa da API pode ser acessada em `http://localhost:5000/api-docs`

![image](https://github.com/Gustavow1/clinic/blob/main/assets/swagger.png)

### Fila (RabbitMQ)
A utilização do RabbitMQ se da para a escrita de um novo registro na collection de Logs. Para cada requisição que passa pelo middleware de logs, é publicada uma mensagem para ser consumida de forma assíncrona pelo consumer, e então gerar o novo registro na collection. A ideia é que a escrita do novo log não gere gargalo nas requisições padrões. O consumidor pode ser ligado ou desligado através da variável de ambiente `LOGGER`, que por padrão vem com o valor `ON`.

### Redis
O Redis foi utilziado para implementar um sistema de cache, com o objetivo de validar a autenticação do usuário e armazenar as informações dos pacientes. A validação é feita buscando o token na memória do redis, e extraindo dele a palavra chave. Cada vez que um usuário tenta validar uma apiKey, é salvo um novo registro no Redis. O armazenamento das informações dos pacientes é realizada na primeira vez que o cliente faz a requisição e sempre que um novo paciente é criado.

### Docker compose
4 serviços estão presentes no `docker-compose.yml`:
- Redis (porta 6379)
- RabbitMQ (porta 5672)
- Painel RabbitMQ (porta 15672)
- Postgres (porta 5432)

# Frontend
Para o frontend, optei por usar IA para criar um front base e modifiquei/adicionei funções que eram necessárias. O layout se baseia em 4 principais sessões: 
- Login de funcionários com nome de usuário e senhas fixas ("admin")
- Dashboard, com listagem, criação, atualização e exclusão de pacientes
- Modal para criação de um novo paciente
- Tabela de logs para listagem dos registros

Prints para uma melhor visualização:
![image](https://github.com/Gustavow1/clinic/blob/main/assets/login.png)

![image](https://github.com/Gustavow1/clinic/blob/main/assets/dashboard.png)

![image](https://github.com/Gustavow1/clinic/blob/main/assets/edit-delete-patient.png)

![image](https://github.com/Gustavow1/clinic/blob/main/assets/new-patient.png)

![image](https://github.com/Gustavow1/clinic/blob/main/assets/logs.png)

![image](https://github.com/Gustavow1/clinic/blob/main/assets/extended-log-info.png)


