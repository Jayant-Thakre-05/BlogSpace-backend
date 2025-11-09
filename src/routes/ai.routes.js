const express = require("express");
const axios = require("axios");
const router = express.Router();

function applyCorrections(text, matches) {
  if (!text) return "";
  if (!Array.isArray(matches) || matches.length === 0) return text;
  // Sort by offset to apply left-to-right
  const sorted = [...matches].sort((a, b) => a.offset - b.offset);
  let improvedText = "";
  let cursor = 0;
  for (const m of sorted) {
    const start = m.offset;
    const end = m.offset + m.length;
    if (cursor < start) improvedText += text.slice(cursor, start);
    const replacement = (m.replacements && m.replacements[0] && m.replacements[0].value) || text.slice(start, end);
    improvedText += replacement;
    cursor = end;
  }
  if (cursor < text.length) improvedText += text.slice(cursor);
  return improvedText;
}

router.post("/improve", async (req, res) => {
  const { text } = req.body || {};
  try {
    const params = new URLSearchParams();
    params.append("text", text || "");
    params.append("language", "en-US");

    const response = await axios.post(
      "https://api.languagetool.org/v2/check",
      params.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const improved = applyCorrections(text || "", response.data?.matches || []);
    res.json({ improvedText: improved });
  } catch (err) {
    res.status(500).json({ message: "AI request failed" });
  }
});

module.exports = router;
