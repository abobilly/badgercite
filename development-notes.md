# BadgerCite Development Notes

**Date:** September 27, 2025

---

// In server/railway.json, remove these lines:
"healthcheckPath": "/health",
"healthcheckTimeout": 300,


## 🤖 AI Assistant Conversation - September 27, 2025

### User Question: "if i didnt focus on citation format guidelines, and instead focused on the code, what would i do?"

### AI Response: Code-First Implementation Approach

If you focus on **CODE** instead of citation guidelines, here's the step-by-step approach:

#### **Step 1: Build the Core API Structure**
**File:** `server/routes/citation.js`

```javascript
// Basic citation processing endpoints
app.post('/api/citation/parse', (req, res) => {
  // Parse raw legal text into structured data
});

app.post('/api/citation/format', (req, res) => {
  // Format structured data into proper citations
});

app.post('/api/citation/validate', (req, res) => {
  // Validate citation format and completeness
});
```

#### **Step 2: Create Citation Parser**
**File:** `server/services/CitationParser.js`

```javascript
class CitationParser {
  parseCase(text) {
    // Extract: party names, reporter, volume, page, court, year
    // Return structured object
  }
  
  parseStatute(text) {
    // Extract: code title, section, year, publisher
    // Return structured object
  }
  
  detectType(text) {
    // Determine if text is case, statute, regulation, etc.
    // Return citation type
  }
}
```

#### **Step 3: Build Citation Formatter**
**File:** `server/services/CitationFormatter.js`

```javascript
class CitationFormatter {
  formatBluebook(parsedCitation) {
    // Apply Bluebook rules to structured data
    // Return formatted citation string
  }
  
  formatTexasGreenbook(parsedCitation) {
    // Apply Texas-specific rules
    // Return formatted citation string
  }
  
  generateShortForm(citation) {
    // Create Id./supra short citations
    // Track previous citations for context
  }
}
```

#### **Step 4: Create Frontend Components**
**Files:** `client/src/components/`

```jsx
// CitationInput.jsx
function CitationInput() {
  return (
    <textarea 
      placeholder="Paste your legal text here..."
      onChange={handleTextChange}
    />
  );
}

// CitationOutput.jsx  
function CitationOutput({ citations }) {
  return (
    <div>
      {citations.map(cite => (
        <div key={cite.id} className="citation">
          <div className="formatted">{cite.formatted}</div>
          <div className="confidence">Confidence: {cite.confidence}%</div>
        </div>
      ))}
    </div>
  );
}

// CitationApp.jsx (main component)
function CitationApp() {
  const [input, setInput] = useState('');
  const [citations, setCitations] = useState([]);
  
  const handleSubmit = async () => {
    const response = await fetch('/api/citation/format', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input })
    });
    const result = await response.json();
    setCitations(result.citations);
  };
  
  return (
    <div>
      <CitationInput value={input} onChange={setInput} />
      <button onClick={handleSubmit}>Format Citations</button>
      <CitationOutput citations={citations} />
    </div>
  );
}
```

#### **Step 5: Add Data Processing**
**Use your existing JSON files:**

```javascript
// Load existing citation data
const T1Data = require('../data/T1.json');
const T6T9Data = require('../data/T6-T9.json'); 
const T10Data = require('../data/T10.json');

// Create lookup functions
function findReporter(reporterName) {
  return T1Data.reporters.find(r => r.name === reporterName);
}

function abbreviatePartyName(partyName) {
  return T6T9Data.abbreviations[partyName] || partyName;
}
```

#### **Step 6: Implement Core Processing**
**Focus Areas:**

1. **Text cleaning** - Remove OCR artifacts, normalize whitespace
2. **Pattern matching** - Regex patterns to identify citation components  
3. **Data validation** - Check against known courts, reporters, date ranges
4. **Rule application** - Apply formatting rules systematically
5. **Error handling** - Graceful degradation when parsing fails

#### **Step 7: Add Testing**
**File:** `server/tests/citation.test.js`

```javascript
describe('Citation Processing', () => {
  test('should parse basic case citation', async () => {
    const input = 'Smith v. Jones, 123 F.3d 456 (5th Cir. 2001)';
    const result = await CitationParser.parseCase(input);
    
    expect(result.parties).toBe('Smith v. Jones');
    expect(result.reporter).toBe('F.3d');
    expect(result.volume).toBe('123');
    expect(result.page).toBe('456');
    expect(result.court).toBe('5th Cir.');
    expect(result.year).toBe('2001');
  });
});
```

#### **🎯 Code-First Approach Benefits:**

1. **Immediate Functionality** - Users can start processing citations right away
2. **Iterative Improvement** - Add citation rules gradually as you test
3. **Data-Driven** - Use your existing JSON files as the foundation
4. **Testable Components** - Each piece can be unit tested independently
5. **Scalable Architecture** - Easy to add new citation types and formats

**This approach gets you to a working MVP fastest, then you can refine the legal rules based on real user feedback!** 🚀

---

## ═══════════════════════════════════════════════════════════════

**ORIGINAL EXPERT NOTES BELOW** (Pre-AI Conversation)

---

## Expert Analysis & Implementation Notes

Here's my quick take:

### Overall Approach

* **Yes to a vector store:** load your Bluebook/Greenbook excerpts + your rules JSON + your test sets. Use it for style/rule grounding, not for primary law. Pair it with live web search for authority lookup/confirmation.
* **Pipeline:** (1) clean & segment raw paste (dedupe whitespace, fix OCR artifacts), (2) detect task (case vs. statute vs. memo), (3) NER/resolve candidates (party names, reporters, code titles), (4) verify via web, (5) format per Bluepages + Greenbook, (6) emit HTML with typographic tags and shortcites logic.
* **Output:** HTML for the site with `<i>` (italics), `<u>` (underline—use sparingly), and small caps via CSS (`<span class="sc">` + `.sc{font-variant:small-caps;}`).

### Functionality to Build In

* **Case resolver:** fuzzy match on party names + reporter/year hints; confirm with docket/court when available; fill unknowns as "(unknown)" rather than guessing.
* **Statute fetcher:** exact-match section detection; if text is short, Hash-Indentation exact text; if long, return cite + "link to official/current text" placeholder string (you can swap in a URL on the frontend if you want).
* **Shortcite manager:** one shortcite per authority per response; for paragraphs, emit trailing "shortcites" block in cited order.
* **Texas overrides:** S.W./S.W.2d/S.W.3d reporters; correct parentheticals (Tex.; Tex. Crim. App.; Tex. App.—City [Dist.] Year); petition/writ history; Houston districts; Business Court/Fifteenth COA neutral cite if present.
* **Confidence & diagnostics:** include a lightweight confidence note and list of "authorities_considered" so you can spot weak matches.

### Typography Notes

* **Bluepages practitioner style** is mostly roman; italicize case names and certain procedural phrases. Small caps for court abbreviations works well in HTML via CSS; avoid relying on font-specific small-caps.
* **Underline** is rarely needed on the web—allow it, but reserve for user-specified emphasis or house style.

### Limitations / Risks

* **Raw OCR noise:** garbage punctuation and broken party names will tank resolver accuracy; add a pre-pass normalizer (e.g., join hyphen-broken words, strip zero-width chars).
* **Ambiguity:** "Smith v. Jones" collisions—must return multiple candidates or mark "Authority unspecified (multiple matches possible)."
* **Web reliance:** site rate limits, paywalls, and stale pages; you'll need caching and backoffs. Also beware unofficial aggregators with incorrect metadata.
* **Vector store drift:** your Bluebook OCR is not authoritative; store it, but don't let it override verified formats—treat as secondary style guidance.
* **Regression coverage:** your current test sets are template-y; add edge cases (mem. op., per curiam, subsequent history, en banc, unpublished, session-law enactments, old reporters).

### Data You Already Have (How I'd Use It)

* **50_state_citation_rules_v1_7.json:** rules scaffold; extend with explicit Greenbook fields (petition history, Houston districts, Business Court neutral cites). Add typography hints (italics/small caps/underline flags).
* **citation_tests_v2_0.json:** wire into CI as format guards (regex), but supplement with semantic checks (court-year consistency, reporter-court compatibility).
* **citation_regression_set_v1_9_all.jsonl:** keep as smoke tests; expand Texas-heavy cases and statutes, especially Penal Code § 42.07/Title 7 speech cases, Health & Safety nuisances, etc.

### Implementation Tips

* **Do a two-pass generation:** pass 1 (identify/verify authorities), pass 2 (render with typography + shortcites). Keeps style separate from retrieval.
* **Emit a structured JSON alongside HTML** (authorities array with fields: type, full_cite, shortcite, court, year, reporter, status, confidence). Frontend displays HTML; backend stores JSON for analytics.
* **Add a strict "no-fabrication" guardrail:** if any field is uncertain, leave blank or "(unknown)"—don't guess pincites or petition histories.

**Net:** your plan is sound. Use vectors for style/rules, the web for authority truth, and keep rendering deterministic with a small formatter that enforces Bluepages + Greenbook + your shortcite rules.

---

## Detailed Implementation Requirements

**Short answer:** you're close, but you still need reporter/jurisdiction tables, more Texas-specific overrides, and some rendering/QA scaffolding.

**What you already have** (so we don't duplicate work): patterns and typefaces for cases/periodicals/statutes (including small caps/italics flags) and several signal/parenthetical rules; plus abbreviation payloads for T6/T7/T8/T9 subsets.

**What's still needed for Pass-2 "render with typography + shortcites" to be solid:**

1. **Reporter & geography tables:** Full Bluebook T1 (preferred reporters) and full T10/T10.1/T10.2/T10.3 lists. Your rules refer out to these but they're not present, so the engine can't reliably abbreviate reporters or places or decide whether to omit the state in the court/year parenthetical.

2. **Remaining abbreviation tables:** Complete T11 (Judges & Officials), T12 (Months), T13 (Periodicals), T14 (Publishing Terms), T15 (Services), T16 (Subdivisions). These are referenced in the Bluebook extracts you're using but aren't fully captured in the JSONs you attached.

3. **Texas Greenbook expansions:**
   • Normalized court-name strings and districts for COAs, Business Court, and Fifteenth Court of Appeals, including neutral-citation patterns and when to pair them with S.W.3d. Your current JSON flags these as emerging/uncertain.
   • Statute publisher/date parentheticals (e.g., "West") captured as deterministic templates (right now it's only prose).

4. **Statute short-form logic:** machine rules for shortening codes/sections (when to use "§§", when to drop titles, how to cite ranges, how to repeat/non-repeat years and publishers). Your statutes section lacks explicit short-form schemas.

5. **Services & electronic sources:** concrete renderer rules for WL/Lexis/FDsys/GovInfo/agency PDFs (provider strings, currency parentheticals, URL suppression in court filings), including federal-statute "no year" rule as a guardrail. You have the "no year" note and a general digital-materials rule, but not provider-specific templates.

6. **Shortcite emission rules across authorities:** conditions + exact output templates for cases, statutes, books, periodicals, regulations, and internet sources (e.g., when "Id." is allowed; when "supra"/"hereinafter" can be used; how many footnotes back; how to format pincites in shortcites). You have partial case/secondary rules, but not coverage across all source types.

7. **Typography rendering spec:** a compact "style map" the API can apply uniformly (e.g., HTML spans/classes for <small-caps>, italics, and permissible underline fallback in Bluepages contexts), plus rules for punctuation inside italics and the en-dash vs hyphen requirement for page ranges. You have the concepts, but not a render-layer contract.

8. **Case-name normalization algorithms:** explicit transforms for party-name cleanup (drop given names, "et al.," business suffixes, generic geo terms; never abbreviate "United States"), wired to T6/T10 for abbreviations. You have prose rules; encode them as deterministic steps with on/off flags and exceptions.

9. **Parenthetical ordering & content coverage:** you've started this, but expand with all common weights (per curiam, en banc), quoting/cited-by parentheticals, explanatory verbs, and subsequent-history sequences from T8—each as enumerated lists with canonical strings.

10. **Error-handling & uncertainty fields:** schema slots for "confidence," "unmapped_token," and "needs_human_review," plus a loggable "rule_source" pointer (Bluebook B-rule/T-table/Greenbook page key) so an API assistant can cite the provision it used. Your JSON already embeds source markers—promote that to first-class fields.

11. **Ordering logic within citation clauses:** a machine rule for "logical order" with tie-breakers (authority type > jurisdiction hierarchy > recency), so multi-authority signals render consistently. You note the principle but not an executable ordering graph.

12. **Bluepages vs Whitepages toggles:** flags to switch between underlining vs italics, optional small caps, and footnote vs text conventions—per document context. You mention permissibility; encode it as a runtime mode.

**If you add the items above, Pass-2 can be fully deterministic and production-ready.**