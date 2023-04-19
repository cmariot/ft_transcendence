#!/bin/bash

set_env_variables() {
    export BACKEND_PORT="3000"
    export FRONTEND_PORT="4000"
    export PGADMIN_PORT="5000"
    export DATABASE_PORT="5432"
    export REVERSE_PROXY_PORT="8443"
    export DATABASE_CONTAINER="database"
    export NODE_ENV="development"
    export PGADMIN_CONFIG_SERVER_MODE="False"

    GREEN='\033[0;32m'
    YELLOW='\033[0;33m'
    BLUE='\033[0;34m'
    NC='\033[0m' 
}

destroy_env() {
    print_yellow "Removing environment files ..."

    local directories=(
        "app/database"
        "app/backend"
        "app/frontend"
        "app/pgadmin"
    )

    for dir in "${directories[@]}"; do
        local env_file="${dir}/.env"
        if [ -f "${env_file}" ]; then
            echo "Removing ${env_file}"
            rm -f "${env_file}"
        fi
    done

    print_success "Previous environment files destroyed."
}

create_directory() {
    local dir=$1
    mkdir -p "${dir}"
}

generate_password() {
  local length=${1:-25} # longueur du mot de passe, défaut de 25 caractères
  local password=$(head /dev/urandom | LC_ALL=C tr -dc 'A-Za-z0-9' | head -c ${length}) # génère une chaîne aléatoire de caractères alphanumériques de longueur spécifiée
  echo "${password}"
}

read_input() {
	local prompt=$1
	local variable_name=$2
	local file=$3
	local is_secret=$4

	echo -n "$prompt : "
	if [ "$is_secret" = "true" ]; then
		read -s variable_value
		echo
	else
		read variable_value
	fi
	echo "$variable_name=\"$variable_value\"" >> "$file"
}

print_section() {
    echo -e "${YELLOW}==>${NC} ${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_yellow() {
    echo -e "${YELLOW}[START]${NC} $1"
}

create_database()
{
	print_section "Database initialization : "
	create_directory ./app/database
	local env_file=./app/database/.env
	
	read_input "Please enter the POSTGRES_USER" "POSTGRES_USER" "${env_file}" false
    read_input "Please enter the POSTGRES_PASSWORD" "POSTGRES_PASSWORD" "${env_file}" true
    read_input "Please enter the POSTGRES_DB" "POSTGRES_DB" "${env_file}" false

	source "${env_file}"
}

create_backend()
{
    local env_file=./app/backend/.env

    read_input "Please enter the UID_42_SECRET" "UID_42_SECRET" "${env_file}" true
    read_input "Please enter the PASSWORD_SECRET_42" "PASSWORD_SECRET_42" "${env_file}" true
    read_input "Please enter the REDIRECT_URL" "CALLBACK_URL" "${env_file}" false
    read_input "Please enter the EMAIL_HOST" "EMAIL_HOST" "${env_file}" false
    read_input "Please enter the EMAIL_PORT" "EMAIL_PORT" "${env_file}" false
    read_input "Please enter the EMAIL_ADDR" "EMAIL_ADDR" "${env_file}" false
    read_input "Please enter the EMAIL_PASS" "EMAIL_PASS" "${env_file}" true
    
	jwt_password=$(generate_password 25)
	echo "DB_USER=${POSTGRES_USER}" 							>> "${env_file}"
    echo "DB_PASS=${POSTGRES_PASSWORD}" 						>> "${env_file}"
    echo "DB_SCHEMA=${POSTGRES_DB}" 							>> "${env_file}" 
    echo "JWT_SECRET=\"$jwt_password\"" 						>> "${env_file}"
    echo "HOST=\"https://$(hostname):$REVERSE_PROXY_PORT/\"" 	>> "${env_file}"
    echo "NODE_ENV=\"${NODE_ENV}\"" 							>> "${env_file}"
    echo "DB_HOST=\"${DATABASE_CONTAINER}\"" 					>> "${env_file}"
    echo "DB_PORT=\"${DATABASE_PORT}\"" 						>> "${env_file}"
    echo "BACKEND_PORT=\"${BACKEND_PORT}\"" 					>> "${env_file}"
	echo "TZ=\"Europe/Paris\"" 									>> "${env_file}"
}

create_frontend()
{
    local socket_host=https://$(hostname):$REVERSE_PROXY_PORT

	echo "PORT=\"${FRONTEND_PORT}\""							> ./app/frontend/.env
	echo "TZ=\"Europe/Paris\""									>> ./app/frontend/.env
	echo "WDS_SOCKET_PORT=\"${REVERSE_PROXY_PORT}\""			>> ./app/frontend/.env
	echo "GENERATE_SOURCEMAP=false"								>> ./app/frontend/.env
	echo "VITE_SOCKETHOST=\"$socket_host\""						>> ./app/frontend/.env
}

create_pgadmin()
{
    print_section "PGAdmin initialization : "
    create_directory "./app/pgadmin"
    local env_file=./app/pgadmin/.env
    
    read_input "Please enter the PGADMIN_EMAIL" "PGADMIN_DEFAULT_EMAIL" "${env_file}" false
    read_input "Please enter the PGADMIN_PASSWORD" "PGADMIN_DEFAULT_PASSWORD" "${env_file}" true

	echo "PGADMIN_CONFIG_SERVER_MODE=\"${PGADMIN_CONFIG_SERVER_MODE}\""	>> ./app/pgadmin/.env
	echo "PGADMIN_LISTEN_PORT=\"${PGADMIN_PORT}\""						>> ./app/pgadmin/.env
}

main()
{
	print_section "Initialization"
	set_env_variables
	destroy_env
	create_database
	create_backend
	create_frontend
	create_pgadmin
}

main
