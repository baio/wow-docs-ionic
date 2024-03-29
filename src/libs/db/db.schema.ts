export const schemaV1 = `
CREATE TABLE IF NOT EXISTS docs (
    id TEXT PRIMARY KEY NOT NULL,
    imgBase64 TEXT,
    storedProvider TEXT,
    storedUrl TEXT,
    storedStatus TEXT,
    labeledLabel TEXT,
    content TEXT,
    lastName TEXT,
    firstMiddleName TEXT,
    createDate INT,
    tags TEXT,
    comment TEXT,
    attachments TEXT
);
CREATE TABLE IF NOT EXISTS attachments (
  id TEXT PRIMARY KEY NOT NULL,
  imgBase64 TEXT
);
CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY NOT NULL,
    createDate TEXT
);
`;
