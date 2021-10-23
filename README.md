# Requisitos
- Java 8 configurado no JAVA_HOME corretamente.
- Configurar variável de ambiente MAVEN_OPTS para: -Xmx2024m
- MySQL 8.0 instalado.
- Porta 3306 liberada para mysql.
- Garantir usuario root e senha root para a aplicação acessar o mysql. 

# Executar:
- MySQL precisa estar aberto (garantir que o serviço MySQL80 esteja funcionando em services.msc)
- Acessar pasta raiz do projeto executar:
mvn spring-boot:run