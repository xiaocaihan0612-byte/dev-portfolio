// 简历数据加载/保存工具：内容默认来自 public/profile/*.json，
// 若主人在编辑页保存过自定义内容，则优先读取浏览器 localStorage 中的覆盖版本。

const OVERRIDE_PREFIX = 'profile_override:';

// 读取某个板块的数据（如 'profile/home.json'）。
// 优先返回 localStorage 覆盖值，否则 fetch 原始 JSON。
export function loadProfile(url) {
  const key = OVERRIDE_PREFIX + url;
  const cached = localStorage.getItem(key);
  if (cached) {
    try {
      return Promise.resolve(JSON.parse(cached));
    } catch (e) {
      localStorage.removeItem(key);
    }
  }
  return fetch(url, { method: 'GET' }).then((res) => res.json());
}

// 保存某板块的覆盖数据到 localStorage。
export function saveProfile(url, value) {
  localStorage.setItem(OVERRIDE_PREFIX + url, JSON.stringify(value));
}

// 删除某板块的覆盖数据，恢复为默认 JSON。
export function clearProfile(url) {
  localStorage.removeItem(OVERRIDE_PREFIX + url);
}

// ---- 编辑密码（纯前端校验，用于防止访客误入编辑）----
const EDIT_PASSWORD = '981106';

export function verifyPassword(input) {
  return input === EDIT_PASSWORD;
}
