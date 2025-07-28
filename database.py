import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    return psycopg2.connect(
        dbname="ayushman_ai_login_signup",
        user="postgres",
        host="localhost",
        port="5432",
        password=os.getenv("POSTGRE_SQL")
    )
