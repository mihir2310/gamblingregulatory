from openai import OpenAI

client = OpenAI(api_key="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")

def question_request(prompt):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()

