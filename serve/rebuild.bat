@echo off
echo Cleaning and rebuilding project...
call mvn clean
call mvn dependency:purge-local-repository -DmanualInclude="com.baomidou:mybatis-plus-boot-starter"
call mvn clean install -U -DskipTests
echo.
echo Build completed! You can now run:
echo   mvn spring-boot:run
echo or
echo   java -jar target/express-delivery-1.0.0.jar
pause

