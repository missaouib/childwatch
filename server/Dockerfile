FROM openjdk:8-jdk-alpine
VOLUME /tmp
COPY  ./build/libs/cw2-latest.jar cw2-latest.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/cw2-latest.jar"]