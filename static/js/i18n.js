/* ============================================================
   CogniFlow — i18n.js
   UI translations (English + Vietnamese). Loaded before the app
   scripts; every visible string uses data-i18n attributes or
   window.CogniFlowI18n.t(key).

   Fonts: Vietnamese gets a Vietnamese-first stack (Be Vietnam Pro,
   then Segoe UI / Tahoma — both render diacritics correctly).
   body[data-lang] drives the font variables in style.css.
   ============================================================ */

(function () {
  "use strict";

  var LS_SETTINGS = "cogniflow.settings.v1";

  var DICT = {
    en: {
      // ---- brand / topbar ----
      "brand.tag": "Study Workspace",
      "brand.admin": "Admin Console",
      "topbar.account": "Account",

      // ---- sidebar ----
      "nav.newSession": "New session",
      "nav.recentSessions": "Recent sessions",
      "nav.historyEmpty": "Sessions you start will appear here.",
      "nav.signOut": "Sign out",

      // ---- chat head ----
      "chat.modelPillTitle": "Active model — click to change",

      // ---- empty state ----
      "empty.title": "Your study workspace",
      "empty.sub": "Ask a question, paste a problem, or pick a task below. CogniFlow explains step by step and checks your understanding.",
      "empty.pc1.title": "Explain a concept",
      "empty.pc1.desc": "Step-by-step breakdown with an example",
      "empty.pc2.title": "Quiz me",
      "empty.pc2.desc": "Practice questions with feedback",
      "empty.pc3.title": "Build a study plan",
      "empty.pc3.desc": "A realistic schedule for your exam",
      "empty.pc4.title": "Review my work",
      "empty.pc4.desc": "Corrections and concrete fixes",
      "empty.disclaimer": "CogniFlow can make mistakes. Verify important information.",

      // ---- privacy banner ----
      "privacy.title": "Sensitive information detected",
      "privacy.mask": "Mask & send",
      "privacy.sendAnyway": "Send anyway",

      // ---- composer ----
      "composer.placeholder": "Ask a question, or paste your homework…",
      "composer.aria": "Type your message",
      "composer.sendAria": "Send message",
      "composer.hintSend": "send",
      "composer.hintNewline": "new line",
      "composer.hintNewSession": "new session",
      "queue.queued": "{n} queued",

      // ---- account menu ----
      "menu.signOut": "Sign out",

      // ---- settings ----
      "settings.title": "Settings",
      "settings.close": "Close settings",
      "tab.appearance": "Appearance",
      "tab.customization": "Customization",
      "tab.models": "Models & API Keys",
      "tab.plugins": "Plugins",
      "tab.devtools": "Devtools",
      "foot.note": "Changes apply immediately.",
      "foot.done": "Done",

      // ---- keys tab ----
      "keys.groupModel": "Active model",
      "keys.modelLabel": "Model",
      "keys.modelHintDefault": "Choose a model. Default models use Ollama Cloud.",
      "keys.groupKeys": "API keys",
      "keys.keysHint": "Keys live in the local backend's memory only — never written to disk. Add a provider key to unlock its models.",
      "keys.connected": "✓ Connected",
      "keys.noKey": "No key",
      "keys.save": "Save",
      "keys.remove": "Remove",
      "keys.pastePh": "Paste {provider} API key",
      "keys.getKeyAt": "Get a key at",
      "settings.backendOffline": "Backend offline — start the app with npm run electron.",
      "settings.noProviders": "No providers available.",

      // ---- customization tab ----
      "customization.group": "Language & behavior",
      "customization.languageLabel": "Interface language",
      "customization.langDesc": "Changes menus, buttons and messages instantly. Fonts switch to a Vietnamese-safe stack when needed.",
      "customization.instructionsGroup": "AI instructions",
      "customization.instructionsLabel": "Custom instructions",
      "customization.instructionsHint": "Optional. Tell CogniFlow how you want it to behave — tone, subjects, formats. Leave blank to use the standard tutor style. The required tutor rule (soft, warm, step-by-step, no direct answers) is always applied on top and never shown here.",
      "customization.webLabel": "Let the AI search the web",
      "customization.webDesc": "Before answering, CogniFlow checks Wikipedia first, then other sites, and cites its sources.",
      "lang.en": "English",
      "lang.vi": "Tiếng Việt",

      // ---- appearance tab ----
      "appearance.groupTheme": "Theme",
      "appearance.themeName": "App theme",
      "appearance.themeDesc": "Default follows your system. Light is tuned for bright rooms, dark for low light.",
      "theme.default": "Default",
      "theme.light": "Light",
      "theme.dark": "Dark",
      "appearance.groupInterface": "Interface",
      "appearance.modeName": "Interface mode",
      "appearance.modeDesc": "Compact tightens spacing and text for small screens or focus work.",
      "density.compact": "Compact",
      "density.default": "Default",
      "density.developer": "Developer",
      "appearance.densityHintDev": "Developer mode is visible. Toggle “Enable Developer Mode” in the Devtools tab to activate diagnostics.",
      "appearance.densityHintDefault": "Developer mode unlocks the Devtools tab with diagnostics and service connections.",

      // ---- plugins tab ----
      "plugins.group": "Chat plugins",
      "plugins.hint": "Plugins add functions to the chat. Install them with the + button; the admin decides which ones are available.",
      "plugin.cleanui.name": "Clean UI",
      "plugin.cleanui.desc": "Removes avatars and borders in the chat for a calmer, distraction-free reading flow.",
      "plugins.install": "Install",
      "plugins.remove": "Remove",
      "plugins.state.available": "Available",
      "plugins.state.installed": "Installed",
      "plugins.state.enabled": "Enabled",
      "plugins.state.off": "Off",
      "plugins.state.disabledByAdmin": "Disabled by admin",

      // ---- devtools tab ----
      "dev.group": "Developer",
      "dev.modeName": "Enable Developer Mode",
      "dev.modeDesc": "Verbose logging, live diagnostics, and Electron DevTools.",
      "dev.githubName": "Connect GitHub",
      "dev.githubDesc": "Link a personal access token for repo-related AI tasks (push summaries, code help). Stored in memory only.",
      "dev.tokenLabel": "GitHub personal access token",
      "dev.connect": "Connect",
      "dev.disconnect": "Disconnect",
      "dev.tokenHint": "Create a token at github.com/settings/tokens — no scopes needed for read-only use.",
      "dev.diagGroup": "Diagnostics",
      "dev.backend": "Backend",
      "dev.keys": "API keys",
      "dev.model": "Model",
      "dev.auth": "Auth",
      "dev.latency": "AI latency",
      "dev.messages": "Messages",
      "dev.refresh": "Refresh",
      "dev.devtools": "Toggle DevTools",
      "dev.running": "running",
      "dev.offline": "offline",
      "dev.none": "none",
      "dev.signedOut": "signed out",

      // ---- admin terminal ----
      "admin.title": "Admin Terminal",
      "admin.close": "Close admin terminal",
      "admin.hint": "Manage every AI model and chat plugin. Changes apply on this device immediately.",
      "admin.groupModels": "AI models",
      "admin.groupPlugins": "Chat functions (plugins)",
      "admin.enable": "Enable",
      "admin.disable": "Disable",
      "admin.on": "ON",
      "admin.off": "OFF",
      "admin.setDefault": "Set default",
      "admin.isDefault": "DEFAULT",
      "admin.openSettings": "Open Settings",
      "admin.done": "Done",

      // ---- chat dynamics ----
      "convo.new": "New session",
      "code.copy": "Copy",
      "code.copied": "Copied",
      "sources.label": "Sources:",
      "failure.title": "Request failed.",
      "failure.hint": "Check your API keys in Settings → Models & API Keys, then try again.",

      // ---- toasts ----
      "toast.themeSystem": "Following system theme",
      "toast.themeLight": "Light theme",
      "toast.themeDark": "Dark theme",
      "toast.devOn": "Developer mode enabled",
      "toast.devOff": "Developer mode disabled",
      "toast.keySaved": "API key saved",
      "toast.keyRemoved": "API key removed",
      "toast.pasteKeyFirst": "Paste an API key first.",
      "toast.backendDown": "CogniFlow is starting up — please try again in a few seconds.",
      "toast.addKeyFirst": "Add your {provider} API key in Settings first.",
      "toast.copied": "Copied to clipboard",
      "toast.inserted": "Inserted into composer",
      "toast.pluginInstalled": "Plugin installed",
      "toast.pluginRemoved": "Plugin removed",
      "toast.pluginEnabled": "Plugin enabled",
      "toast.pluginDisabled": "Plugin disabled",
      "toast.pluginBlocked": "This plugin is disabled by the admin.",
      "toast.languageSet": "Language updated",
      "toast.modelDisabled": "That model is disabled by the admin.",
      "toast.supabaseOff": "Supabase not configured (auth.js) — running locally.",

      // ---- login window ----
      "login.side1.t": "Step-by-step tutoring",
      "login.side1.d": "Explanations built around understanding, not copying answers.",
      "login.side2.t": "Active practice",
      "login.side2.d": "Quizzes, worked examples, and study plans that adapt to you.",
      "login.side3.t": "Private by design",
      "login.side3.d": "Your key and chats stay on your device. Sensitive data is flagged before it leaves.",
      "login.sideFoot": "CogniFlow Study Workspace · v1.0.0",
      "login.kicker": "Welcome back",
      "login.title": "Sign in to CogniFlow",
      "login.sub": "Your sessions, key, and settings are tied to your account.",
      "login.idLabel": "Email or username",
      "login.idPh": "you@school.edu or username",
      "login.pwLabel": "Password",
      "login.forgot": "Forgot password?",
      "login.submit": "Sign in",
      "login.submitting": "Signing in…",
      "login.alt": "New to CogniFlow?",
      "login.create": "Create an account",
      "login.createDesc": "Opens securely in your browser",
      "login.note": "Account creation happens on our website so your browser can handle email verification safely. After confirming your email, return here and sign in.",
      "login.errEmail": "Enter your email or username.",
      "login.errBackend": "CogniFlow is still starting up. Please wait a few seconds and try again.",
      "login.errSignup": "SIGNUP_URL is not set in static/js/auth.js — account creation lives on the website.",
      "login.errReset": "SIGNUP_URL is not set in static/js/auth.js — password reset lives on the website.",
      "login.errGeneric": "Sign-in failed.",
    },

    vi: {
      "brand.tag": "Không gian học tập",
      "brand.admin": "Bảng quản trị",
      "topbar.account": "Tài khoản",

      "nav.newSession": "Phiên mới",
      "nav.recentSessions": "Phiên gần đây",
      "nav.historyEmpty": "Các phiên bạn bắt đầu sẽ hiện ở đây.",
      "nav.signOut": "Đăng xuất",

      "chat.modelPillTitle": "Mô hình đang dùng — bấm để đổi",

      "empty.title": "Không gian học tập của bạn",
      "empty.sub": "Hỏi một câu, dán bài tập, hoặc chọn một nhiệm vụ bên dưới. CogniFlow giải thích từng bước và kiểm tra cách bạn hiểu.",
      "empty.pc1.title": "Giải thích khái niệm",
      "empty.pc1.desc": "Phân tích từng bước kèm ví dụ",
      "empty.pc2.title": "Kiểm tra tôi",
      "empty.pc2.desc": "Câu hỏi luyện tập kèm phản hồi",
      "empty.pc3.title": "Lập kế hoạch học",
      "empty.pc3.desc": "Lịch trình thực tế cho kỳ thi của bạn",
      "empty.pc4.title": "Xem lại bài làm",
      "empty.pc4.desc": "Chỉnh sửa và cách sửa cụ thể",
      "empty.disclaimer": "CogniFlow có thể sai. Hãy kiểm chứng thông tin quan trọng.",

      "privacy.title": "Phát hiện thông tin nhạy cảm",
      "privacy.mask": "Che & gửi",
      "privacy.sendAnyway": "Vẫn gửi",

      "composer.placeholder": "Đặt câu hỏi, hoặc dán bài tập của bạn…",
      "composer.aria": "Nhập tin nhắn",
      "composer.sendAria": "Gửi tin nhắn",
      "composer.hintSend": "gửi",
      "composer.hintNewline": "dòng mới",
      "composer.hintNewSession": "phiên mới",
      "queue.queued": "{n} đang chờ",

      "menu.signOut": "Đăng xuất",

      "settings.title": "Cài đặt",
      "settings.close": "Đóng cài đặt",
      "tab.appearance": "Giao diện",
      "tab.customization": "Tùy chỉnh",
      "tab.models": "Mô hình & Khóa API",
      "tab.plugins": "Tiện ích",
      "tab.devtools": "Devtools",
      "foot.note": "Thay đổi được áp dụng ngay.",
      "foot.done": "Xong",

      "keys.groupModel": "Mô hình đang dùng",
      "keys.modelLabel": "Mô hình",
      "keys.modelHintDefault": "Chọn một mô hình. Các mô hình mặc định dùng Ollama Cloud.",
      "keys.groupKeys": "Khóa API",
      "keys.keysHint": "Khóa chỉ nằm trong bộ nhớ của backend cục bộ — không bao giờ ghi ra đĩa. Thêm khóa của nhà cung cấp để mở các mô hình.",
      "keys.connected": "✓ Đã kết nối",
      "keys.noKey": "Chưa có khóa",
      "keys.save": "Lưu",
      "keys.remove": "Xóa",
      "keys.pastePh": "Dán khóa API {provider}",
      "keys.getKeyAt": "Lấy khóa tại",
      "settings.backendOffline": "Backend chưa chạy — mở ứng dụng bằng npm run electron.",
      "settings.noProviders": "Không có nhà cung cấp nào.",

      "customization.group": "Ngôn ngữ & hành vi",
      "customization.languageLabel": "Ngôn ngữ giao diện",
      "customization.langDesc": "Đổi menu, nút bấm và thông báo ngay lập tức. Phông chữ tự chuyển sang bộ hỗ trợ tiếng Việt khi cần.",
      "customization.instructionsGroup": "Chỉ dẫn cho AI",
      "customization.instructionsLabel": "Chỉ dẫn tùy chọn",
      "customization.instructionsHint": "Không bắt buộc. Cho CogniFlow biết bạn muốn nó ứng xử thế nào — giọng điệu, môn học, định dạng. Để trống để dùng phong cách gia sư chuẩn. Quy tắc gia sư bắt buộc (dịu dàng, ấm áp, từng bước xác minh, không đưa đáp án trực tiếp) luôn được áp dụng phía trên và không bao giờ hiện ở đây.",
      "customization.webLabel": "Cho AI tìm kiếm trên web",
      "customization.webDesc": "Trước khi trả lời, CogniFlow tra Wikipedia trước, sau đó đến các trang khác, và dẫn nguồn.",
      "lang.en": "English",
      "lang.vi": "Tiếng Việt",

      "appearance.groupTheme": "Chủ đề",
      "appearance.themeName": "Chủ đề ứng dụng",
      "appearance.themeDesc": "Mặc định theo hệ thống. Sáng hợp phòng nhiều ánh sáng, tối hợp nơi ít sáng.",
      "theme.default": "Mặc định",
      "theme.light": "Sáng",
      "theme.dark": "Tối",
      "appearance.groupInterface": "Giao diện",
      "appearance.modeName": "Chế độ hiển thị",
      "appearance.modeDesc": "Gọn làm chặt khoảng cách và chữ cho màn hình nhỏ hoặc khi cần tập trung.",
      "density.compact": "Gọn",
      "density.default": "Thường",
      "density.developer": "Nhà phát triển",
      "appearance.densityHintDev": "Chế độ nhà phát triển đang hiện. Bật “Bật chế độ nhà phát triển” trong tab Devtools để xem chẩn đoán.",
      "appearance.densityHintDefault": "Chế độ nhà phát triển mở tab Devtools với chẩn đoán và kết nối dịch vụ.",

      "plugins.group": "Tiện ích trò chuyện",
      "plugins.hint": "Tiện ích bổ sung chức năng cho khung trò chuyện. Cài bằng nút +; quản trị viên quyết định tiện ích nào khả dụng.",
      "plugin.cleanui.name": "Clean UI",
      "plugin.cleanui.desc": "Bỏ avatar và viền trong khung trò chuyện để đọc mạch lạc, ít xao nhãng hơn.",
      "plugins.install": "Cài đặt",
      "plugins.remove": "Gỡ",
      "plugins.state.available": "Chưa cài",
      "plugins.state.installed": "Đã cài",
      "plugins.state.enabled": "Đang bật",
      "plugins.state.off": "Đang tắt",
      "plugins.state.disabledByAdmin": "Bị quản trị viên tắt",

      "dev.group": "Nhà phát triển",
      "dev.modeName": "Bật chế độ nhà phát triển",
      "dev.modeDesc": "Ghi log chi tiết, chẩn đoán trực tiếp và DevTools của Electron.",
      "dev.githubName": "Kết nối GitHub",
      "dev.githubDesc": "Liên kết token truy cập cá nhân cho các tác vụ AI liên quan repo (tóm tắt push, trợ giúp code). Chỉ lưu trong bộ nhớ.",
      "dev.tokenLabel": "Token truy cập cá nhân GitHub",
      "dev.connect": "Kết nối",
      "dev.disconnect": "Ngắt kết nối",
      "dev.tokenHint": "Tạo token tại github.com/settings/tokens — không cần quyền nào cho dùng chỉ đọc.",
      "dev.diagGroup": "Chẩn đoán",
      "dev.backend": "Backend",
      "dev.keys": "Khóa API",
      "dev.model": "Mô hình",
      "dev.auth": "Xác thực",
      "dev.latency": "Độ trễ AI",
      "dev.messages": "Tin nhắn",
      "dev.refresh": "Làm mới",
      "dev.devtools": "Bật/tắt DevTools",
      "dev.running": "đang chạy",
      "dev.offline": "ngoại tuyến",
      "dev.none": "không có",
      "dev.signedOut": "chưa đăng nhập",

      "admin.title": "Terminal quản trị",
      "admin.close": "Đóng terminal quản trị",
      "admin.hint": "Quản lý mọi mô hình AI và tiện ích trò chuyện. Thay đổi áp dụng ngay trên máy này.",
      "admin.groupModels": "Mô hình AI",
      "admin.groupPlugins": "Chức năng trò chuyện (tiện ích)",
      "admin.enable": "Bật",
      "admin.disable": "Tắt",
      "admin.on": "BẬT",
      "admin.off": "TẮT",
      "admin.setDefault": "Đặt mặc định",
      "admin.isDefault": "MẶC ĐỊNH",
      "admin.openSettings": "Mở Cài đặt",
      "admin.done": "Xong",

      "convo.new": "Phiên mới",
      "code.copy": "Sao chép",
      "code.copied": "Đã sao chép",
      "sources.label": "Nguồn:",
      "failure.title": "Yêu cầu thất bại.",
      "failure.hint": "Kiểm tra khóa API trong Cài đặt → Mô hình & Khóa API, rồi thử lại.",

      "toast.themeSystem": "Theo chủ đề hệ thống",
      "toast.themeLight": "Chủ đề sáng",
      "toast.themeDark": "Chủ đề tối",
      "toast.devOn": "Đã bật chế độ nhà phát triển",
      "toast.devOff": "Đã tắt chế độ nhà phát triển",
      "toast.keySaved": "Đã lưu khóa API",
      "toast.keyRemoved": "Đã xóa khóa API",
      "toast.pasteKeyFirst": "Dán khóa API trước.",
      "toast.backendDown": "CogniFlow đang khởi động — vui lòng thử lại sau vài giây.",
      "toast.addKeyFirst": "Hãy thêm khóa API {provider} trong Cài đặt trước.",
      "toast.copied": "Đã sao chép vào bộ nhớ tạm",
      "toast.inserted": "Đã chèn vào ô soạn tin",
      "toast.pluginInstalled": "Đã cài tiện ích",
      "toast.pluginRemoved": "Đã gỡ tiện ích",
      "toast.pluginEnabled": "Đã bật tiện ích",
      "toast.pluginDisabled": "Đã tắt tiện ích",
      "toast.pluginBlocked": "Tiện ích này bị quản trị viên tắt.",
      "toast.languageSet": "Đã cập nhật ngôn ngữ",
      "toast.modelDisabled": "Mô hình này bị quản trị viên tắt.",
      "toast.supabaseOff": "Chưa cấu hình Supabase (auth.js) — chạy cục bộ.",

      "login.side1.t": "Kèm từng bước",
      "login.side1.d": "Giải thích hướng tới việc hiểu bài, không phải chép đáp án.",
      "login.side2.t": "Luyện tập chủ động",
      "login.side2.d": "Câu hỏi, ví dụ mẫu và kế hoạch học thích hợp với bạn.",
      "login.side3.t": "Tư nhân theo thiết kế",
      "login.side3.d": "Khóa và hội thoại nằm trên máy của bạn. Dữ liệu nhạy cảm được cảnh báo trước khi gửi đi.",
      "login.sideFoot": "Không gian học tập CogniFlow · v1.0.0",
      "login.kicker": "Chào mừng trở lại",
      "login.title": "Đăng nhập CogniFlow",
      "login.sub": "Phiên học, khóa và cài đặt của bạn gắn với tài khoản.",
      "login.idLabel": "Email hoặc tên đăng nhập",
      "login.idPh": "you@school.edu hoặc tên đăng nhập",
      "login.pwLabel": "Mật khẩu",
      "login.forgot": "Quên mật khẩu?",
      "login.submit": "Đăng nhập",
      "login.submitting": "Đang đăng nhập…",
      "login.alt": "Mới dùng CogniFlow?",
      "login.create": "Tạo tài khoản",
      "login.createDesc": "Mở an toàn trong trình duyệt",
      "login.note": "Việc tạo tài khoản diễn ra trên trang web của chúng tôi để trình duyệt xử lý xác minh email an toàn. Sau khi xác nhận email, quay lại đây và đăng nhập.",
      "login.errEmail": "Nhập email hoặc tên đăng nhập.",
      "login.errBackend": "CogniFlow đang khởi động. Vui lòng đợi vài giây rồi thử lại.",
      "login.errSignup": "SIGNUP_URL chưa đặt trong static/js/auth.js — việc tạo tài khoản nằm trên trang web.",
      "login.errReset": "SIGNUP_URL chưa đặt trong static/js/auth.js — đặt lại mật khẩu nằm trên trang web.",
      "login.errGeneric": "Đăng nhập thất bại.",
    },
  };

  function readSettings() {
    try { return JSON.parse(localStorage.getItem(LS_SETTINGS)) || {}; }
    catch (e) { return {}; }
  }
  function writeSettings(patch) {
    try {
      var s = readSettings();
      Object.assign(s, patch);
      localStorage.setItem(LS_SETTINGS, JSON.stringify(s));
    } catch (e) { /* storage unavailable */ }
  }

  var lang = "en";
  (function init() {
    var s = readSettings();
    if (s && DICT[s.lang]) lang = s.lang;
    else if (String(navigator.language || "").toLowerCase().indexOf("vi") === 0) lang = "vi";
  })();

  function t(key, vars) {
    var text = (DICT[lang] && DICT[lang][key]) || DICT.en[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        text = text.split("{" + k + "}").join(String(vars[k]));
      });
    }
    return text;
  }

  function apply(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = t(nodes[i].getAttribute("data-i18n"));
    var phs = scope.querySelectorAll("[data-i18n-ph]");
    for (var p = 0; p < phs.length; p++) phs[p].setAttribute("placeholder", t(phs[p].getAttribute("data-i18n-ph")));
    var tls = scope.querySelectorAll("[data-i18n-title]");
    for (var x = 0; x < tls.length; x++) tls[x].setAttribute("title", t(tls[x].getAttribute("data-i18n-title")));
    var arias = scope.querySelectorAll("[data-i18n-aria]");
    for (var a = 0; a < arias.length; a++) arias[a].setAttribute("aria-label", t(arias[a].getAttribute("data-i18n-aria")));
  }

  function setLang(next, opts) {
    if (!DICT[next]) next = "en";
    lang = next;
    writeSettings({ lang: lang });
    document.documentElement.lang = lang;
    document.body.dataset.lang = lang;
    apply();
    if (!(opts && opts.silent)) {
      // App pages toast through CogniFlowApp if present.
      if (window.CogniFlowApp && window.CogniFlowApp.toast) window.CogniFlowApp.toast(t("toast.languageSet"), "ok");
    }
    return lang;
  }

  function getLang() { return lang; }
  function languages() { return Object.keys(DICT); }

  // First paint: set body lang + apply before other scripts run their boot.
  function boot() {
    document.documentElement.lang = lang;
    document.body.dataset.lang = lang;
    apply();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.CogniFlowI18n = { t: t, apply: apply, setLang: setLang, getLang: getLang, languages: languages };
})();
