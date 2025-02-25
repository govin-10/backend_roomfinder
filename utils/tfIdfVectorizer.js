export class CustomVectorizer {
  constructor() {
    this.vocabulary = new Map();
    this.idf = new Map();
  }

  tokenize(text) {
    if (!text) return [];
    console.log("tokenizing text", text);
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/);
  }

  fit(corpus) {
    const docCount = corpus.length;
    const termDocFreq = new Map();

    corpus.forEach((doc) => {
      const words = new Set(this.tokenize(doc));
      words.forEach((word) => {
        termDocFreq.set(word, (termDocFreq.get(word) || 0) + 1);
      });
    });

    this.vocabulary = new Map(
      [...termDocFreq.keys()].map((word, i) => [word, i])
    );
    termDocFreq.forEach((count, word) => {
      this.idf.set(word, Math.log(docCount / (count + 1))); // Smoothing
    });
  }

  transform(text, min_price, max_price, price, facilities) {
    const words = this.tokenize(text);
    const vector = new Array(this.vocabulary.size + 5).fill(0); // 4 facilities + 1 price

    words.forEach((word) => {
      if (this.vocabulary.has(word)) {
        const index = this.vocabulary.get(word);
        vector[index] += this.idf.get(word) || 0;
      }
    });

    // Normalize price
    vector[this.vocabulary.size] =
      (price - min_price) / (max_price - min_price);

    // Encode facility preferences (Binary 1 or 0)
    vector[this.vocabulary.size + 1] = facilities.wifi ? 1 : 0;
    vector[this.vocabulary.size + 2] = facilities.electricity ? 1 : 0;
    vector[this.vocabulary.size + 3] = facilities.parking ? 1 : 0;
    vector[this.vocabulary.size + 4] = facilities.ac ? 1 : 0;

    return vector;
  }

  cosineSimilarity(vec1, vec2) {
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val ** 2, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val ** 2, 0));

    return magnitude1 && magnitude2
      ? dotProduct / (magnitude1 * magnitude2)
      : 0;
  }
}
