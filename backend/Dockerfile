# ==============================================================================
# Multi-Stage Dockerfile for Spring Boot 3 Backend Service
# Thermal Power Plant Store & Spares Management System (SMS)
# Target Platform: Google Cloud Run (Containerized Java 21)
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build & Package with Maven & Eclipse Temurin JDK 21
# ------------------------------------------------------------------------------
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Cache Maven dependencies by copying pom.xml first
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy application source code
COPY src ./src

# Compile and package application jar (skipping unit tests for fast reproducible builds)
RUN mvn clean package -DskipTests -B

# Extract fat JAR layers for optimized Docker caching (optional layer extraction)
RUN mkdir -p target/extracted && \
    java -Djarmode=layertools -jar target/*.jar extract --destination target/extracted || true

# ------------------------------------------------------------------------------
# Stage 2: Minimal Distroless / JRE Runtime for Google Cloud Run
# ------------------------------------------------------------------------------
FROM eclipse-temurin:21-jre-alpine AS runner

# Create non-root application user for least-privilege security
RUN addgroup -S smsgroup && adduser -S smsuser -G smsgroup

WORKDIR /app

# Copy the built jar from the builder stage
COPY --from=builder /build/target/*.jar /app/sms-backend.jar

# Set ownership to non-root user
RUN chown -R smsuser:smsgroup /app

USER smsuser:smsgroup

# Cloud Run binds to $PORT (default 8080)
ENV PORT=8080 \
    SPRING_PROFILES_ACTIVE=gcp \
    JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError"

EXPOSE 8080

# Health check using Spring Boot Actuator / API endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/api/inventory/items || exit 1

# Execute Spring Boot application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT} -jar /app/sms-backend.jar"]
