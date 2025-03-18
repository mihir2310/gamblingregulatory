# Current Data Engineering workflow:

## pdf_ingestion.py -> law_jsonbuilder.py -> faiss_index_builder.py -> query_faiss.py -> main.py (main.py runs the actual querying)

### 1. pdf_ingestion.py
Use pdf_ingestion.py is a file that parses a law document and generates an add-on json file called pdf_ingest_output.json which follows the same structure as legal_embeddings (legal_embeddings contains ALL the LAWS)
Current pdf parsing is manual (Been using chatgpt to tweak the script per separate doc)
Run python /Users/mihirsavkar/Desktop/gamblingregulatory/BACKEND/pdf_ingestion.py >pdf_ingest_output.json 2>&1

### 2. law_jsonbuilder.py
law_jsonbuilder.py merges the add-on content of pdf_ingest_output into the main legal_embeddings.json file.
Run python /Users/mihirsavkar/Desktop/gamblingregulatory/BACKEND/law_jsonbuilder.py

### 3. faiss_index_builder.py
faiss_index_builder.py embeds the actual laws from the legal_embeddings.json file into the particular faiss file structured: {market}_{jurisdiction}_faiss.index or creates it and then adds into it if not already existing.
Run python /Users/mihirsavkar/Desktop/gamblingregulatory/BACKEND/faiss_index_builder.py
* Currently goes through the entire legal_embeddings.json file (so you need to clear the json, delete all the faiss files fully and start from scratch each time you want to embed laws) so best get the full legal_embeddings.json file fully there before running the embedding.
* Just have been using this structure for the MVP

### 4. query_faiss.py
query_faiss.py actually searches from the embedded content to find laws most relevant to query passed in main.py
Run python /Users/mihirsavkar/Desktop/gamblingregulatory/BACKEND/query_faiss.py

### 5. main.py
main.py currently only contains test queries which work decently well output I/O looks like:

I -
query = "We are conducting illegal sports betting across multiple states, state prosecution and grants us full immunity, full immunity."    
market_type="sportsbooks"
state_or_federal="federal"

Function runs (GETRELEVANTLAWS).....

O - 
Matched Law: Wire Act of 1961 (Category: General)
Law Text: (c) Nothing contained in this section shall cre-
ate immunity from criminal prosecution under 
any laws of any State.... (Score: 0.4032228887081146)


Matched Law: Wire Act of 1961 (Category: General)
Law Text: (a) Whoever being engaged in the business of 
betting or wagering knowingly uses a wire com-
munication facility for the transmission in 
interstate or foreign commerce of bets or wagers 
or information assisting in the placing of bets or 
wagers on any sporting event or contest, or for 
the transmi... (Score: 0.410343736410141)


Matched Law: UIGEA (Category: SEC. 105. RULES OF CONSTRUCTION.)
Law Text: (a) Nothing in this Act may be construed to prohibit any activity 
that is allowed under Public Law 95-515 as amended (15 U.S.C. 3001 et 
seq.).
    (b) Nothing in this Act may be construed to preempt State law 
prohibiting gambling.... (Score: 0.41592782735824585)

Embedding, algorithm, and scripts for now are not bad to proceed with, now back to app-building.
