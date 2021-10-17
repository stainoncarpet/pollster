const _sanitizeForUrl = (str) => str.toLowerCase().replace(/[^a-zA-Z0-9-\s]/g, "").trim().replaceAll(' ', '-');

const sanitizeForTitle = (str) => str.trim();

const getUri = (section, subject, id) => `/${section}/${_sanitizeForUrl(subject)}-${id}`;

export {sanitizeForTitle};

export default getUri;