# Updates by Day

## Guess it's a smart idea to keep track about whats going on and whats not.

### 03/20

So right now, the flask backend has been rudimentally set up and the API Request for scan doc is working. However, the file upload and embedding(RELEVANTLAWS)/violation detection part are all taking place within the same scan-doc api route.

Postman -

1. Run a `POST` Request on `http://127.0.0.1:5000/scan-doc`.
2. Go to the **_Body_** tab
3. Select **_form-data_**.
4. **_Key_**: `file` → **_Value_**: [Upload your Sample ```T&C.docx``` file]
5. **_Key_**: `market_type` → **_Value_**: `dfs` (or whatever category you want)
6. **_Key_**: `state_or_federal` → **_Value_**: `federal`
7. Click **_Send_**.

I need to separate these two, because the scan-doc should only parse the pdf/chunk it up and take in the jurisdiction, market_type information and pass these three parameters to another api endpoint ideally called maybe "return_violation_report," which could be a json object containing for each t&c chunk the full three relevant laws + violation status + explanation (I'll call this JSON file something like doc-violation-summary_json.json).

- Existing bug: there is a faiss_index repo similar to the same one in AI_ALGORITHMS being created in BACKEND whenever the Postman request for the whole scan-doc is ran (need to separate and look into that).

Then, this JSON will be reverse parsed and displayed on the frontend 👍

---

this whole flask workflow will be executed when the Scan .docx button is pressed on the filepage.jsx.

Same functionality will be available on the analogous button of the Version.jsx page - (button will be called "rescan doc" though) - and will process the most recent saved version.

---

I believe that once these parts are implemented, and basic demo-visible bugs are fixed, the MVP would be ready for Demo!!!!!!!!👍👍👍👍👍👍👍
