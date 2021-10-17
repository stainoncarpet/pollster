export const submitCredentials = async (email, password) => {
    const res = await fetch("/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });
    const body = await res.json();
    return body;
};

export const registerCredentials = async (nickname, email, password) => {
    const res = await fetch("/user/create", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({nickname, email, password})
      });
    const body = await res.json();
    return body;
};

export const submitToken = async (token) => {
    const res = await fetch(`/user/confirm?t=${token}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"}
      });
    const body = await res.json();
    return body;
};

export const requestPasswordReset = async (email) => {
    const res = await fetch(`/user/password-reset/step-1?email=${email}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"}
      });
    const body = await res.json();
    return body;
};

export const confirmPasswordReset = async (token) => {
    const res = await fetch(`/user/password-reset/step-2?token=${token}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"}
      });
    const body = await res.json();
    return body;
};

export const setNewPassword = async (token, password) => {
    const res = await fetch(`/user/password-reset/step-3?token=${token}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ password })
      });
    const body = await res.json();
    return body;
};

export const updateAuth = async () => {
    const res = await fetch(`/user/update-auth`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
      });
    const body = await res.json();
    return body;
};