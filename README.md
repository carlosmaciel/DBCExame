# GIT

Checkout: https://github.com/carlosmaciel/DBCExame

# Requisitos
- Java 8 configurado no JAVA_HOME corretamente.
- Maven versão 3.3.3 instalado.
- Configurar variável de ambiente MAVEN_OPTS para apenas: -Xmx2024m
- MySQL 8.0 instalado.
- Porta 3306 liberada para mysql.
- Garantir que o serviço MySQL80 esteja funcionando em services.msc.
- Garantir usuario root e senha root para a aplicação acessar o mysql. 
- Desenvolvimento feito utilizando Google Chrome como browser padrão.

# Executar
- Acessar pasta raiz do projeto executar: mvn spring-boot:run
- Após sucesso, acessar no browser: http://localhost:8080.

# Observações
- Em relação ao cronometro da sessão, há um cookie criado que permite manter a sessão aberta mesmo que o usuário saia.Portanto, o cronometro continua a contagem independente da aba/browser.

# Explicação breve do porquê das escolhas tomadas durante o desenvolvimento da solução

- Utilizo jQuery/AJAX no frontend por ser bastante interativo com o developer, simples desenvolvimento e não custoso de horas.

- Utilizando Spring Boot como solicitado.

- Requisição REST feita utilizando RestTemplate.

- Estou persistindo com MySQL por ser mais simples e free.

- Decidi optar por manter as páginas (home, associado, pauta e votação) em uma só página para simplificar o desenvolvimento. O que faço é dar um hide e show nelas dependendo da aba que o usuário escolher.

- Utilizei log4j por ser mais simples.

- Os testes estão simples, o máximo que fiz foi mockar algo. Não quis me aprofundar por não ser o foco do exame. Estou utilizando JUnit 4.

- Estou utilizando hibernate/JPA para facilitar o desenvolvimento da persistência.

- Versionando com GIT como solicitado.

# Tarefa Bônus 3 - Como você versionaria a API da sua aplicação? Que estratégia usar?

Eu incluiria o número da versão na própria URL da API. Assim, o desenvolvimento poderia subir a versão sem impactar os clientes que utilizam versões antigas.

