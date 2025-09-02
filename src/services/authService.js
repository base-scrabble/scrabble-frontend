// placeholder for guest login / wallet auth later
export async function guestLogin(nickname = "Guest") {
    return { ok: true, user: { id: Date.now().toString(), nickname } };
  }
  