.PHONY: up down

COMPOSE = docker compose

up:
	$(COMPOSE) up --build -d

down:
	$(COMPOSE) down
