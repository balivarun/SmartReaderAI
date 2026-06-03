# Multi-stage Dockerfile for building and running the Spring Boot backend
# Build stage
FROM gradle:7.6-jdk17 AS builder
WORKDIR /home/gradle/project
# Copy project files
COPY --chown=gradle:gradle . .
# Build the fat jar (skip tests for faster builds; remove -x test if you want tests)
RUN gradle clean bootJar --no-daemon -x test

# Run stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# Copy the built jar from the builder stage
COPY --from=builder /home/gradle/project/build/libs/*.jar app.jar

# Expose the default port (runtime will use the PORT env var when provided)
EXPOSE 8080

# Allow extra JVM options to be passed in via the JAVA_OPTS env var
ENV JAVA_OPTS=""

# On Render the platform provides a PORT environment variable. Spring Boot binds
# to the server.port property; we pass the PORT into the JVM system property so
# the app listens on the expected port.
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar /app/app.jar"]
