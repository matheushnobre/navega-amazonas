# AquaGO

Projeto fullstack utilizando Python + Django no backend e Angular + Node no frontend.

Este projeto tem como objetivo ser uma aplicação web que permita a venda de passagens fluviais na Região Norte do Brasil.

Dentre as funcionalidades estão:

- Cadastro de empresas;
- Operações de CRUD relacionadas embarcações e viagens por parte dos usuários detentores de empresa;
- Visualização de viagens disponíveis por parte do usuário comum;
- Compra de passagens fluviais;
- Autenticação JWT;
- Vinculação com API de pagamentos do Mercado Pago.

---

## 🚀 0. Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Python
- Angular e Node
- Git

---

## 📥 1. Clonar o projeto

`https://github.com/matheushnobre/navega-amazonas/`

---

## 🐍 2. Configuração do Backend

Entre na pasta Backend:

`cd backend`

### Criar ambiente virtual

`python -m venv venv`

### Ativar o ambiente virtual

Windows:  
`venv\Scripts\activate`

Linux/MacOS:  
`source venv/bin/activate`

### Instalar dependências

`pip install -r requirements.txt`

### Configurar o banco de dados

No arquivo settings.py, dentro do diretório navega_amazonas, procure pelo trecho de código responsável por configurar o banco de dados. Ele estará escrito no seguinte formato:

`DATABASES = ... `

Cole o seguinte trecho no lugar, de forma a configurar o SQLite. Você pode personalizar da maneira que desejar:

```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

### Caso queira configurar a API de pagamentos do Mercado Pago

Crie uma conta no Mercado Pago, preencha as informações necessárias, criando uma aplicação e gerando token de acesso. Adicione este token de acesso ao arquivo .env, que deve estar no diretório backend.


---

## 🖥️ 3. Executando o Backend

`python manage.py runserver`

---

## 🅰️ 4. Executando o Frontend (Angular)

Entre na pasta Frontend:

`cd frontend`

Instale as dependências:

`npm install`

Execute o servidor:

`ng serve`

Acesse:  
`http://localhost:4200`


---

## 👨‍💻 Autor

Projeto mantido por:

- Lucas Ferreira (@lucas-devstudies)  
- Matheus Nobre (@matheushnobre)  
- Robert Cruz (robbydevs)

---