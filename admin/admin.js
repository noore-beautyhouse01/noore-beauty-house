
(() => {
  const API = (window.NOORe_ADMIN_CONFIG?.API_BASE_URL || "").replace(/\/$/,"");
  const tokenKey = "noore_admin_token";
  const loginView = document.getElementById("loginView");
  const appView = document.getElementById("appView");
  const loginForm = document.getElementById("loginForm");
  const loginMsg = document.getElementById("loginMsg");
  const rows = document.getElementById("rows");
  const error = document.getElementById("error");
  let bookings = [];

  const token = () => localStorage.getItem(tokenKey);
  const showApp = () => { loginView.classList.add("hidden"); appView.classList.remove("hidden"); load(); };
  if (token()) showApp();

  loginForm.addEventListener("submit", async e => {
    e.preventDefault(); loginMsg.textContent = "Signing in…"; loginMsg.className = "msg";
    try {
      const r = await fetch(`${API}/auth/login`, {method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email:email.value,password:password.value})});
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "Login failed.");
      localStorage.setItem(tokenKey,d.token); showApp();
    } catch(err) { loginMsg.textContent = err.message; loginMsg.className = "msg error"; }
  });

  logout.addEventListener("click", () => { localStorage.removeItem(tokenKey); location.reload(); });
  refresh.addEventListener("click", load);
  [search,statusFilter,dateFilter].forEach(el => el.addEventListener("input", load));
  clearFilters.addEventListener("click", () => { search.value=""; statusFilter.value=""; dateFilter.value=""; load(); });

  async function api(path, options={}) {
    const r = await fetch(`${API}${path}`, {...options, headers:{...(options.headers||{}),Authorization:`Bearer ${token()}`}});
    if (r.status === 401) { localStorage.removeItem(tokenKey); location.reload(); }
    const d = await r.json().catch(()=>({}));
    if (!r.ok) throw new Error(d.message || "Request failed.");
    return d;
  }

  async function load() {
    error.textContent = "Loading…"; error.className = "msg";
    try {
      const params = new URLSearchParams();
      if (statusFilter.value) params.set("status",statusFilter.value);
      if (dateFilter.value) params.set("date",dateFilter.value);
      if (search.value.trim()) params.set("q",search.value.trim());
      const d = await api(`/bookings?${params}`);
      bookings = d.bookings || [];
      render();
      error.textContent = "";
    } catch(err) { error.textContent = err.message; error.className = "msg error"; }
  }

  function render() {
    const counts = {total:bookings.length,pending:0,confirmed:0,completed:0};
    bookings.forEach(b => { if (counts[b.status] !== undefined) counts[b.status]++; });
    total.textContent=counts.total; pending.textContent=counts.pending; confirmed.textContent=counts.confirmed; completed.textContent=counts.completed;
    rows.innerHTML = bookings.length ? bookings.map(b => `
      <tr>
        <td><strong>${esc(b.name)}</strong><small>${esc(b.phone)}</small></td>
        <td>${esc(b.service)}<br><small>${b.guests} guest${b.guests>1?"s":""}</small></td>
        <td><strong>${esc(b.date)}</strong><small>${esc(b.time)}</small></td>
        <td>${esc(b.notes || "—")}</td>
        <td><span class="badge ${esc(b.status)}">${esc(b.status)}</span></td>
        <td><div class="row-actions">
          ${b.status!=="confirmed"?`<button class="confirm" data-action="confirmed" data-id="${b._id}">Confirm</button>`:""}
          ${b.status!=="completed"?`<button data-action="completed" data-id="${b._id}">Complete</button>`:""}
          ${b.status!=="cancelled"?`<button data-action="cancelled" data-id="${b._id}">Cancel</button>`:""}
          <button class="delete" data-delete="${b._id}">Delete</button>
        </div></td>
      </tr>`).join("") : `<tr><td colspan="6">No appointments found.</td></tr>`;
  }

  rows.addEventListener("click", async e => {
    const action = e.target.dataset.action, id = e.target.dataset.id, del = e.target.dataset.delete;
    if (!id && !del) return;
    try {
      if (del) {
        if (!confirm("Delete this booking permanently?")) return;
        await api(`/bookings/${del}`,{method:"DELETE"});
      } else {
        await api(`/bookings/${id}/status`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:action})});
      }
      load();
    } catch(err) { error.textContent=err.message; error.className="msg error"; }
  });

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  }
})();
