const BASE_URL = "typicode.com";

export const apiClient = {
  get: (endpoint) =>
    fetch(`${BASE_URL}${endpoint}`).then((res) => {
      if (!res.ok) throw new Error("Сүлжээний алдаа гарлаа");
      return res.json();
    }),

  post: (endpoint, data) =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    }).then((res) => {
      if (!res.ok) throw new Error("Мэдээлэл илгээж чадсангүй");
      return res.json();
    }),

  delete: (endpoint) =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
    }).then((res) => {
      if (!res.ok) throw new Error("Устгаж чадсангүй");
      return true;
    }),
};