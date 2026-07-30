const basePath =
  import.meta.env.BASE_URL === "/"
    ? ""
    : import.meta.env.BASE_URL.replace(/\/$/, "");

function withBasePath(path) {
  if (
    typeof path !== "string" ||
    !path.startsWith("/") ||
    path.startsWith("//") ||
    (basePath && (path === basePath || path.startsWith(`${basePath}/`)))
  ) {
    return path;
  }
  return `${basePath}${path}`;
}

function stripBasePath(pathname) {
  if (!basePath) return pathname;
  if (pathname === basePath) return "/";
  return pathname.startsWith(`${basePath}/`)
    ? pathname.slice(basePath.length)
    : pathname;
}

export { stripBasePath, withBasePath };
