from flask import Flask, render_template, request, jsonify, flash, redirect, url_for, session
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from database import get_db_connection
from dotenv import load_dotenv
from datetime import timedelta
import os
import psycopg2

app = Flask(__name__)
app.secret_key = "your_secret_key"
app.permanent_session_lifetime = timedelta(minutes=10)

load_dotenv()

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')

# Gemini LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-pro",
    temperature=0.4,
    google_api_key=GEMINI_API_KEY
)

# System prompt
system_prompt = (
    "Hi! You're Ayushman AI, a friendly healthcare assistant here to help users understand medical info clearly and simply. "
    "You keep things short, accurate, and easy to follow—like you're talking to a friend. "
    "Stick to three sentences max, avoid complex jargon, and if you're not sure about something, let the user know."
    "Always end your responses with a helpful concluding line — a brief summary, a suggestion for what to do next, or a reassuring remark. (e.g., “Hope that clears it up!” or “Let me know if you want more details.”)"
    "Ensure every sentence ends with proper punctuation, especially full stops at the end of responses."
)

# Prompt template
prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}")
])

# Route for homepage
@app.route('/')
def home():
    user_name = session.get('user_name')
    return render_template('index.html', user_name=user_name)

# Route for chatbot page
@app.route('/chat')
def chat():
    user_name = session.get('user_name')
    return render_template('bot.html', user_name=user_name)

# Route for login page
@app.route('/login', methods=['GET', 'POST'])
def login_signup():
    if request.method == 'POST':
        action = request.form.get("action")

        conn = get_db_connection()
        cur = conn.cursor()

        if action == "signup":
            name = request.form.get("signup-name")
            email = request.form.get("signup-email")
            mobile = request.form.get("signup-mobile")
            password = request.form.get("signup-password")
            confirm_password = request.form.get("signup-confirm-password")

            if password != confirm_password:
                flash("Passwords do not match.", "danger")
            else:
                cur.execute("SELECT * FROM users WHERE email = %s", (email,))
                existing_user = cur.fetchone()
                if existing_user:
                    flash("User already exists.", "danger")
                else:
                    cur.execute("INSERT INTO users (name, email, mobile, password) VALUES (%s, %s, %s, %s)",
                                (name, email, mobile, password))
                    conn.commit()
                    flash("Signup successful!", "success")

        elif action == "login":
            email = request.form.get("login-email")
            password = request.form.get("login-password")

            cur.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
            user = cur.fetchone()
            
            if user:
                session['user_name'] = user[1]   # user[1] is name
                flash("Login successful!", "success")
                return redirect(url_for('home'))  # Redirect to chatbot if login successful
            else:
                flash("Invalid login credentials.", "danger")

        cur.close()
        conn.close()
        return redirect(url_for('login_signup'))

    return render_template("login_page.html")

# Route of Logout
@app.route('/logout')
def logout():
    session.clear()
    flash("Logged out successfully.", "info")
    return redirect(url_for('home'))


# API route for chatbot messages
@app.route('/get', methods=['POST'])
def chatbot_response():
    try:
        data = request.get_json()
        user_message = data['contents'][0]['parts'][0]['message']

        formatted_prompt = prompt.format_messages(input=user_message)
        response = llm.invoke(formatted_prompt)

        print("AIMessage content:", response.content)
        print("Raw message dir:", dir(response))  # Optional

        return jsonify({'response': response.content})
    
    except Exception as e:
        print("Error:", e)
        return jsonify({'response': "❌ Server error. Please try again later." }), 500

if __name__ == '__main__':
    app.run(debug=True)
