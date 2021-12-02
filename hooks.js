(() => {
  console.log(window.xhr_json);
  const xhr_json_original = window.xhr_json;
  window.xhr_json = (type, url) => {
    console.log(type, url);
    if (url.startsWith("/apps/database/mesh2cap/query/scene0116_00")) {
      url = "http://kaldir.vc.in.tum.de:8080" + url;
    }
    return xhr_json_original(type, url)
  }
})();
