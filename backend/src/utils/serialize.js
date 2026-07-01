function serializeDoc(document) {
  if (!document) return null;
  const object = typeof document.toObject === 'function' ? document.toObject() : document;
  const { _id, __v, password, ...rest } = object;
  return { id: _id ? _id.toString() : object.id, ...rest };
}

function serializeList(documents) {
  return documents.map(serializeDoc);
}

module.exports = { serializeDoc, serializeList };
