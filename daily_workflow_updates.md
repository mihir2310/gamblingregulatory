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

JSON returned looks like -

```
[
    {
        "term": "1. Users must be 18 years or older to participate in this platform.",
        "violations": [
            {
                "Category": "SEC. 102. MODIFICATION OF EXISTING PROHIBITION.",
                "Explanation": "The user's statement does not violate the law. The law provided pertains to the use of communication facilities for transmitting bets or wagers, while the user's statement simply sets an age requirement for participation on their platform.",
                "Law Name": "UIGEA",
                "Law Text": "Section 1084 of title 18, United States Code, is amended to read as  follows: ``Sec. 1084. Use of a communication facility to transmit bets or                wagers; criminal penalties     ``(a) Except as otherwise provided in this section, whoever, being  engaged in a gambling business, knowingly--             ``(1) uses a communication facility for the transmission in          interstate or foreign commerce, within the special maritime and          territorial jurisdiction of the United States, or to or from          any place outside the jurisdiction of any nation with respect          to any transmission to or from the United States, of--                     ``(A) bets or wagers;                     ``(B) information assisting in the placing of bets                  or wagers; or                     ``(C) a communication, which entitles the recipient                  to receive money or credit as a result of bets or                  wagers, or for information assisting in the placing of                  bets or wagers; or             ``(2) accepts, in connection with the transmission of a          communication in interstate or foreign commerce, within the          special maritime and territorial jurisdiction of the United          States, or to or from any place outside the jurisdiction of any          nation with respect to any transmission to or from the United          States of bets or wagers or information assisting in the          placing of bets or wagers--                     ``(A) credit, or the proceeds of credit, extended                  to or on behalf of another (including credit extended                  through the use of a credit card);                     ``(B) an electronic fund transfer or funds                  transmitted by or through a money transmitting                  business, or the proceeds of an electronic fund                  transfer or money transmitting service, from or on                  behalf of the other person;                     ``(C) any check, draft, or similar instrument which                  is drawn by or on behalf of the other person and is                  drawn on or payable through any financial institution;                  or                     ``(D) the proceeds of any other form of financial                  transaction as the Secretary of the Treasury and the                  Board of Governors of the Federal Reserve System may                  prescribe by regulation which involves a financial                  institution as a payor or financial intermediary on                  behalf of or for the benefit of the other person, shall be fined under this title or imprisoned not more than five years,  or both.     ``(b) Nothing in this section prohibits--             ``(1) the transmission of information assisting in the          placing of bets or wagers for use in news reporting if such          transmission does not solicit or provide information for the          purpose of facilitating or enabling the placing or receipt of          bets or wagers in a jurisdiction where such betting is illegal;             ``(2) the transmission of information assisting in the          placing of bets or wagers from a State or foreign country where          such betting or wagering is permitted under Federal, State,          tribal, or local law into a State or foreign country in which          such betting on the same event is permitted under Federal,          State, tribal, or local law; or             ``(3) the interstate transmission of information relating          to a State-specific lottery between a State or foreign country          where such betting or wagering is permitted under Federal,          State, tribal, or local law and an out-of-State data center for          the purposes of assisting in the operation of such State-         specific lottery.     ``(c) Nothing in this section prohibits the use of a communication  facility for the transmission of bets or wagers or information  assisting in the placing of bets or wagers, if--             ``(1) at the time the transmission occurs, the individual          or entity placing the bets or wagers or information assisting          in the placing of bets or wagers, the gambling business, and,          subject to section 1084(b)(3), any individual or entity acting          in concert with a gambling business to process the bets or          wagers are physically located in the same State, and for class          II or class III gaming under the Indian Gaming Regulatory Act,          are physically located on Indian lands within that State;             ``(2) the State or tribe has explicitly authorized such          bets and wagers, the State or tribal law requires a secure and          effective location and age verification system to assure          compliance with age and location requirements, and the gambling          business and any individual or entity acting in concert with a          gambling business to process the bets or wagers complies with          such law;             ``(3) the State has explicitly authorized and licensed the          operation of the gambling business and any individual or entity          acting in concert with a gambling business to process the bets          and wagers within its borders or the tribe has explicitly          authorized and licensed the operation of the gambling business          and any individual or entity acting in concert with a gambling          business to process the bets and wagers, on Indian lands within          its jurisdiction;             ``(4) with respect to class II or class III gaming, the          game and gambling business complies with the requirements of          the Indian Gaming Regulatory Act; and             ``(5) with respect to class III gaming under the Indian          Gaming Regulatory Act, the game is authorized under, and is          conducted in accordance with, the respective Tribal-State          compact of the Tribe having jurisdiction over the Indian lands          where the individual or entity placing the bets or wagers or          information assisting in the placing of bets or wagers, the          gambling business, and any individual or entity acting in          concert with a gambling business to process those bets or          wagers are physically located, and such Tribal-State compact          expressly provides that the game may be conducted using a          communication facility to transmit bets or wagers or          information assisting in the placing of bets or wagers. For purposes of this subsection, the intermediate routing of electronic  data constituting or containing all or part of a bet or wager, or all  or part of information assisting in the placing of bets or wagers,  shall not determine the location or locations in which a bet or wager  is transmitted, initiated, received or otherwise made; or from or to  which a bet or wager, or information assisting in the placing of bets  or wagers, is transmitted.     ``(d) Nothing in this section creates immunity from criminal  prosecution under any laws of any State or tribe.     ``(e) Nothing in this section authorizes activity that is  prohibited under chapter 178 of title 28, United States Code.     ``(f) When any common carrier, subject to the jurisdiction of the  Federal Communications Commission, is notified in writing by a Federal,  State, tribal, or local law enforcement agency, acting within its  jurisdiction, that any communication facility furnished by it is being  used or will be used by its subscriber for the purpose of transmitting  or receiving gambling information in interstate or foreign commerce,  within the special maritime and territorial jurisdiction of the United  States, or to or from any place outside the jurisdiction of any nation  with respect to any transmission to or from the United States in  violation of Federal, State, tribal, or local law, it shall discontinue  or refuse, the leasing, furnishing, or maintaining of such facility,  after reasonable notice to the subscriber, but no damages, penalty or  forfeiture, civil or criminal, shall be found against any common  carrier for any act done in compliance with any notice received from a  law enforcement agency. Nothing in this section shall be deemed to  prejudice the right of any person affected thereby to secure an  appropriate determination, as otherwise provided by law, in a Federal  court or in a State, tribal, or local tribunal or agency, that such  facility should not be discontinued or removed, or should be  restored.''.",
                "Score": 0.4781728982925415,
                "Updated On": "2025-03-21",
                "Violation": "No"
            },
            {
                "Category": "General",
                "Explanation": ". The user's statement does not violate the law. The user is simply stating an age requirement for participation on their platform, which is a common practice to ensure compliance with legal age restrictions.",
                "Law Name": "Wire Act of 1961",
                "Law Text": "(a) Whoever being engaged in the business of  betting or wagering knowingly uses a wire com- munication facility for the transmission in  interstate or foreign commerce of bets or wagers  or information assisting in the placing of bets or  wagers on any sporting event or contest, or for  the transmission of a wire communication  which entitles the recipient to receive money or  credit as a result of bets or wagers, or for infor- mation assisting in the placing of bets or wa- gers, shall be fined under this title or impris- oned not more than two years, or both.",
                "Score": 0.483932763338089,
                "Updated On": "2025-03-21",
                "Violation": "No"
            },
            {
                "Category": "General",
                "Explanation": ". The user's statement does not violate the law. The user is simply stating an age requirement for participation on their platform, which is a common practice to ensure compliance with legal regulations regarding age restrictions.",
                "Law Name": "Wire Act of 1961",
                "Law Text": "(b) Nothing in this section shall be construed  to prevent the transmission in interstate or for- eign commerce of information for use in news  reporting of sporting events or contests, or for  the transmission of information assisting in the  placing of bets or wagers on a sporting event or  contest from a State or foreign country where  betting on that sporting event or contest is legal  into a State or foreign country in which such  betting is legal.",
                "Score": 0.49579253792762756,
                "Updated On": "2025-03-21",
                "Violation": "No"
            }
        ]
    },
    {
        "term": "3. By using the platform, users agree to abide by all applicable local and federal laws.",
        "violations": [
            {
                "Category": "General",
                "Explanation": ". The user's statement does not violate the law. The user is simply stating that users of the platform must follow all local and federal laws, which is in line with the law mentioned regarding common carriers and gambling information.",
                "Law Name": "Wire Act of 1961",
                "Law Text": "(d) When any common carrier, subject to the  jurisdiction of the Federal Communications  Commission, is notified in writing by a Federal,  State, or local law enforcement agency, acting  within its jurisdiction, that any facility fur- nished by it is being used or will be used for the  purpose of transmitting or receiving gambling  information in interstate or foreign commerce  in violation of Federal, State or local law, it  shall discontinue or refuse, the leasing, furnish- ing, or maintaining of such facility, after rea- sonable notice to the subscriber, but no dam- ages, penalty or forfeiture, civil or criminal,  shall be found against any common carrier for  any act done in compliance with any notice re- ceived from a law enforcement agency. Nothing  in this section shall be deemed to prejudice the  right of any person affected thereby to secure an  appropriate determination, as otherwise pro- vided by law, in a Federal court or in a State or  local tribunal or agency, that such facility  should not be discontinued or removed, or  should be restored.",
                "Score": 0.39476022124290466,
                "Updated On": "2025-03-21",
                "Violation": "No"
            },
            {
                "Category": "General",
                "Explanation": ". The user's statement does not violate the law. The user is simply stating that users of the platform must follow all local and federal laws, which is in line with the law that there is no immunity from criminal prosecution under any state laws.",
                "Law Name": "Wire Act of 1961",
                "Law Text": "(c) Nothing contained in this section shall cre- ate immunity from criminal prosecution under  any laws of any State.",
                "Score": 0.4153701663017273,
                "Updated On": "2025-03-21",
                "Violation": "No"
            },
            {
                "Category": "SEC. 105. RULES OF CONSTRUCTION.",
                "Explanation": ". The user's statement does not violate the law. The user is simply stating that users must abide by all applicable local and federal laws, which is in line with the provision in the law that nothing in the Act may be construed to prohibit activities allowed under Public Law 95-515 or preempt State laws prohibiting gambling.",
                "Law Name": "UIGEA",
                "Law Text": "(a) Nothing in this Act may be construed to prohibit any activity  that is allowed under Public Law 95-515 as amended (15 U.S.C. 3001 et  seq.).     (b) Nothing in this Act may be construed to preempt State law  prohibiting gambling.",
                "Score": 0.42747339606285095,
                "Updated On": "2025-03-21",
                "Violation": "No"
            }
        ]
    }
]
```

Now just need to create an endpoint that takes in these results and highlights them on the frontend.

---

this whole flask workflow will be executed when the Scan .docx button is pressed on the filepage.jsx.

Same functionality will be available on the analogous button of the Version.jsx page - (button will be called "rescan doc" though) - and will process the most recent saved version.

---

I believe that once these parts are implemented, and basic demo-visible bugs are fixed, the MVP would be ready for Demo!!!!!!!!👍👍👍👍👍👍👍
