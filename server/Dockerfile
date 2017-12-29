FROM openjdk:8
WORKDIR /usr/src/childwatch-server
RUN wget -q https://services.gradle.org/distributions/gradle-4.4.1-bin.zip && unzip gradle-4.4.1-bin.zip -d /opt && rm gradle-4.4.1-bin.zip
ENV GRADLE_HOME /opt/gradle-4.4.1
ENV PATH $PATH:/opt/gradle-4.4.1/bin
COPY . .
RUN gradle assemble
CMD ["java", "-Djava.security.egd=file:/dev/./urandom", "-Dspring.profiles.active=prod", "-jar", "/usr/src/childwatch-server/build/libs/cw2-latest.jar"]