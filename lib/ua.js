// A small, dependency-free user-agent parser for coarse analytics.

export function parseUA(userAgentRaw) {
  const userAgent = userAgentRaw || "";

  let os = "Other";

  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    os = "iOS";
  } else if (/Android/i.test(userAgent)) {
    os = "Android";
  } else if (/Windows/i.test(userAgent)) {
    os = "Windows";
  } else if (/Macintosh|Mac OS X/i.test(userAgent)) {
    os = "macOS";
  } else if (/Linux/i.test(userAgent)) {
    os = "Linux";
  }

  let inApp = null;

  if (/Instagram/i.test(userAgent)) {
    inApp = "Instagram";
  } else if (/FBAN|FBAV|FB_IAB/i.test(userAgent)) {
    inApp = "Facebook";
  } else if (/BytedanceWebview|TikTok/i.test(userAgent)) {
    inApp = "TikTok";
  } else if (/Threads/i.test(userAgent)) {
    inApp = "Threads";
  } else if (/Twitter/i.test(userAgent)) {
    inApp = "X/Twitter";
  } else if (/Line\//i.test(userAgent)) {
    inApp = "LINE";
  } else if (/MicroMessenger/i.test(userAgent)) {
    inApp = "WeChat";
  } else if (/Snapchat/i.test(userAgent)) {
    inApp = "Snapchat";
  }

  let browser = "Other";

  if (inApp) {
    browser = `${inApp} in-app`;
  } else if (/EdgiOS|Edge\//i.test(userAgent)) {
    browser = "Edge";
  } else if (/CriOS|Chrome\//i.test(userAgent)) {
    browser = "Chrome";
  } else if (/FxiOS|Firefox\//i.test(userAgent)) {
    browser = "Firefox";
  } else if (/Version\/.*Safari/i.test(userAgent)) {
    browser = "Safari";
  } else if (/Safari/i.test(userAgent)) {
    browser = "Safari";
  }

  const device = /Mobi|iPhone|Android/i.test(userAgent) ? "Mobile" : "Desktop";

  return { os, browser, device, inApp };
}

export function refDomain(referrer) {
  if (!referrer) {
    return "Direct";
  }

  try {
    const url = new URL(referrer);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return "Direct";
  }
}
