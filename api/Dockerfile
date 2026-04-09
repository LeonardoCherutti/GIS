FROM golang:1.26-alpine AS builder
WORKDIR /build
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /api ./cmd/api

FROM alpine:3.19
RUN apk add --no-cache wget
WORKDIR /app
COPY --from=builder /api .
COPY --from=builder /build/migrations ./migrations
EXPOSE 8080
CMD ["./api"]
