#!/bin/bash

export BACKEND_PORT="3000"
export NODE_ENV="developpment"

export FRONTEND_PORT="4000"

export PGADMIN_PORT="5000"
export PGADMIN_CONFIG_SERVER_MODE="False"

export DATABASE_PORT="5432"
export DATABASE_CONTAINER="database"

create_database()
{
	echo "Database initialization : "
	mkdir -p app/database
	echo -n "Please enter the POSTGRES_USER : "
	read database_user
	echo -n "Please enter the POSTGRES_PASSWORD : "
	read database_password
	echo -n "Please enter the POSTGRES_DB : "
	read database_db
	echo "POSTGRES_USER=\"$database_user\""			>  ./app/database/.env
	echo "POSTGRES_PASSWORD=\"$database_password\""	>> ./app/database/.env
	echo "POSTGRES_DB=\"$database_db\""				>> ./app/database/.env
}

create_backend()
{
	echo "NODE_ENV=\"${NODE_ENV}\""							>  ./app/backend/.env
	echo "DB_USER=\"$database_user\""						>> ./app/backend/.env
	echo "DB_PASS=\"$database_password\""					>> ./app/backend/.env
	echo "DB_SCHEMA=\"$database_db\""						>> ./app/backend/.env
	echo "DB_HOST=\"${DATABASE_CONTAINER}\""				>> ./app/backend/.env
	echo "DB_PORT=\"${DATABASE_PORT}\""						>> ./app/backend/.env
	echo "BACKEND_PORT=\"${BACKEND_PORT}\""					>> ./app/backend/.env
	echo "NODE_OPTIONS=\"${NODE_OPTIONS}\""					>> ./app/backend/.env
	echo "JWT_SECRET=\"$database_password\""				>> ./app/backend/.env
	echo "TZ=\"Europe/Paris\""								>> ./app/backend/.env

	echo -n "Please enter the UID_42_SECRET : "
	read uid_42_secret
	echo "UID_42_SECRET=\"$uid_42_secret\""					>> ./app/backend/.env
	echo -n "Please enter the PASSWORD_SECRET_42 : "
	read password_secret_42
	echo "PASSWORD_SECRET_42=\"$password_secret_42\""		>> ./app/backend/.env
	echo -n "Please enter the REDIRECT_URL : "
	read redirect_secret_42
	echo "CALLBACK_URL=\"$redirect_secret_42\""				>> ./app/backend/.env
}

create_frontend()
{
	echo "PORT=\"${FRONTEND_PORT}\""						> ./app/frontend/.env
	echo "TZ=\"Europe/Paris\""								>> ./app/frontend/.env
}

create_pgadmin()
{
	echo "PGAdmin initialization : "
	mkdir -p ./app/pgadmin
	echo -n "Please enter the PGADMIN_EMAIL : "
	read pgadmin_email
	echo -n "Please enter the PGADMIN_PASSWORD : "
	read pgadmin_password
	echo "PGADMIN_DEFAULT_EMAIL=\"$pgadmin_email\""						>  ./app/pgadmin/.env
	echo "PGADMIN_DEFAULT_PASSWORD=\"$pgadmin_password\""				>> ./app/pgadmin/.env
	echo "PGADMIN_CONFIG_SERVER_MODE=\"${PGADMIN_CONFIG_SERVER_MODE}\""	>> ./app/pgadmin/.env
	echo "PGADMIN_LISTEN_PORT=\"${PGADMIN_PORT}\""						>> ./app/pgadmin/.env
}

main()
{
	echo "Initialization"
	create_database
	create_backend
	create_frontend
	create_pgadmin
}

main
