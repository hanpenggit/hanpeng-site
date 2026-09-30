# sources/ — private writing for the "Ask Sahil" chatbot (RAG)

Drop your **PDF / DOCX / MD** files here — cover letters, articles, essays,
documents you've written. Subfolders are fine.

**These files are gitignored** (see `.gitignore`) — they are **never committed**
to this public repository. Only this README is tracked.

### How they're used
An ingestion script extracts the text, splits it into chunks, drops
near-duplicates, and upserts the chunks into **Upstash Vector** (private). At
question time, `/api/chat` retrieves the most relevant passages and feeds them
to the model so it answers in Sahil's voice with real depth.

### Updating
Add / remove / edit files here, then re-run the ingestion script to refresh the
index. The raw files stay on disk and in Upstash — never in the repo.
