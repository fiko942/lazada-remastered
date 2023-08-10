function removeWordsCaseInsensitive(paragraph, wordsToRemove) {
    const words = paragraph.split(' ');
    const modifiedWords = words.filter(word => !wordsToRemove.includes(word.toLowerCase()));
    const modifiedParagraph = modifiedWords.join(' ');
    return modifiedParagraph;
}