# Loneliness

## Loneliness é uma rede social modular onde você pode criar "quadros" e preenche-los com o que quiser.

Para rodá-lo de forma local, abra um terminal no diretório do projeto e digite o comando: 
`python manage.py runserver`

Para rodá-lo a sério, use o gunicorn:
`gunicorn dynamics.wsgi <porta>`

Não esqueça de instalar as dependências com:
`pip install -r requirements.txt`

Você pode criar uma conta nova no Loneliness ou acessar uma que já deixei no banco de dados, cujas credenciais são:
Username: username
Password: password

Caso opte por criar sua própria conta, crie sua primeira página e navegue até ela, antes disso não é possível criar novos frames. Isto é um bug, mas olhe para isto como se fosse uma feature.

Nota:
para um novo deploy no Heroku é necessário descomentar as linhas relativas ao Heroku em settings. Também é bom descomentar a linha do banco de dados no .gitignore
