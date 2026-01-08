const SUPABASE_URL = 'https://jnordvkkajlengzfaxzj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_jpR2JZ7Mue2EPEqELM71iw_AcwermIp';
const sbClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// データを表形式で表示する
async function fetchDisplay() {
    const { data, error } = await sbClient
        .from('test_log')
        .select('*')
        .order('id', { ascending: false });

    const tbody = document.getElementById('table-body');
    if (error) {
        tbody.innerHTML = `<tr><td colspan="3">エラー: ${error.message}</td></tr>`;
        return;
    }

    tbody.innerHTML = "";
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.id}</td>
            <td>${row.name}</td>
            <td>${new Date(row.created_at).toLocaleString('ja-JP')}</td>
        `;
        tbody.appendChild(tr);
    });
}

// データを保存する
async function saveData() {
    const input = document.getElementById('nameInput');
    if (!input.value) return;

    const { error } = await sbClient
        .from('test_log')
        .insert([{ name: input.value }]);

    if (error) {
        alert("保存エラー: " + error.message);
    } else {
        input.value = "";
    }
}

// リアルタイム監視の設定
sbClient
    .channel('table-db')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'test_log' }, () => {
        fetchDisplay();
    })
    .subscribe();

// ボタンへのイベント登録
document.getElementById('sendBtn').addEventListener('click', saveData);

// 初回表示
fetchDisplay();
