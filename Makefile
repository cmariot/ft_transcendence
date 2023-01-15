# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: cmariot <cmariot@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/08/31 16:08:49 by cmariot           #+#    #+#              #
#    Updated: 2022/12/13 21:42:44 by cmariot          ###   ########.fr        #
#                                                                              #
#                                                                              #
# **************************************************************************** #

up:
	docker compose up --build

configure:
	./configure.sh

build:
	docker compose build

run:
	docker compose up

detach:
	docker compose up --detach --build

clean: stop
	docker system prune -a --force

fclean: stop
	docker system prune -a --force --volumes

re: fclean up

sh_backend:
	docker compose exec backend sh

log_backend:
	docker compose logs --follow backend

top_backend:
	docker top backend

sh_database:
	docker compose exec database sh

log_database:
	docker compose logs --follow database

top_database:
	docker top database

sh_frontend:
	docker compose exec frontend sh

log_frontend:
	docker compose logs --follow frontend

top_frontend:
	docker top frontend

sh_proxy:
	docker compose exec proxy sh

ps:
	docker compose ps

list:
	@printf "CONTAINERS LIST :\n"
	@docker container ls
	@printf "\nIMAGES LIST :\n"
	@docker image ls
	@printf "\nVOLUMES LIST :\n"
	@docker volume ls
	@printf "\nNETWORKS LIST :\n"
	@docker network ls

image:
	docker compose images

pause:
	docker compose pause

unpause:
	docker compose unpause

start:
	docker compose start

stop:
	docker compose stop

restart:
	docker compose restart
