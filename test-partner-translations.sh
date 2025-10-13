#!/bin/bash

echo "🧪 Testing Partner Match Page Translations..."
echo ""

# Test English
echo "🌍 Testing English (EN)..."
CONTENT_EN=$(curl -s -H "Accept-Language: en" http://localhost:3000/partner-match 2>/dev/null | grep -o "Find Your Perfect Dance Partner\|Browse Partners\|Search Partners" | head -3)
if [[ ! -z "$CONTENT_EN" ]]; then
    echo "  ✓ English text found: $(echo $CONTENT_EN | head -20)"
else
    echo "  ⚠️  No English text found"
fi

echo ""

# Test Spanish
echo "🌍 Testing Spanish (ES)..."
curl -s -H "Accept-Language: es" -H "Cookie: i18nextLng=es" http://localhost:3000/partner-match > /tmp/partner-es.html 2>/dev/null
CONTENT_ES=$(grep -o "Encuentra\|Buscar\|Socios\|Filtros" /tmp/partner-es.html | head -5)
PAGE_SIZE=$(wc -c < /tmp/partner-es.html)
echo "  → Page size: $PAGE_SIZE bytes"
if [[ ! -z "$CONTENT_ES" ]]; then
    echo "  ✓ Spanish keywords found: $(echo $CONTENT_ES | head -20)"
else
    echo "  ⚠️  No Spanish translation detected"
fi

echo ""

# Test French  
echo "🌍 Testing French (FR)..."
curl -s -H "Accept-Language: fr" -H "Cookie: i18nextLng=fr" http://localhost:3000/partner-match > /tmp/partner-fr.html 2>/dev/null
CONTENT_FR=$(grep -o "Trouvez\|Rechercher\|Partenaires\|Filtres" /tmp/partner-fr.html | head -5)
PAGE_SIZE=$(wc -c < /tmp/partner-fr.html)
echo "  → Page size: $PAGE_SIZE bytes"
if [[ ! -z "$CONTENT_FR" ]]; then
    echo "  ✓ French keywords found: $(echo $CONTENT_FR | head -20)"
else
    echo "  ⚠️  No French translation detected"
fi

echo ""

# Check for TranslatedText component usage
echo "📝 Checking component usage in source..."
COMPONENT_COUNT=$(grep -c "TranslatedText" /Users/hemantd/DL/dance-platform-staging/app/\(public\)/partner-match/page.tsx)
echo "  → TranslatedText used $COMPONENT_COUNT times in partner-match page"

echo ""
echo "✅ Translation test completed!"