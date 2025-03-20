import json
from datetime import datetime
from openai import OpenAI
import os
from dotenv import load_dotenv

# Load API Key
load_dotenv()
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Violation detection using GPT - takes in the query and the relevant laws from query_faiss.GETRELEVANTLAWS
def detect_violation(query_text, law_data):
    print("Law Data:", law_data)  # Debugging statement

    results = []

    # Ensure law_data is a list of dictionaries
    if law_data:
        law_data = [entry[0] if isinstance(entry, tuple) else entry for entry in law_data]

    print("Extracted Law Data:", law_data)  # Debugging statement

    for entry in law_data:
        law_name = entry["Law Name"]
        category = entry.get("Category", "General")
        law_text = entry["Law Text"]
        updated_on = datetime.now().strftime('%Y-%m-%d')
        score = entry["Score"]

        prompt = f"""
        Law: {law_text}
        User Statement: {query_text}

        Does the user's statement violate the law? Respond with "Yes" or "No", followed by a brief explanation.
        """

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=100,
            temperature=0.0
        )

        answer = response.choices[0].message.content.strip()
        violation = "Yes" in answer
        explanation = answer.split("Yes" if violation else "No", 1)[-1].strip()

        results.append({
            "Law Name": law_name,
            "Category": category,
            "Law Text": law_text,
            "Violation": "Yes" if violation else "No",
            "Explanation": explanation,
            "Updated On": updated_on,
            "Score": score
        })

    # Return results as JSON
    return results

