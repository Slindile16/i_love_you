// No npm dependencies. Start Chrome with --remote-debugging-port=9223 first.
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
const pages = await (await fetch('http://127.0.0.1:9223/json')).json();
const ws = new WebSocket(pages.find(p => p.type === 'page').webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let nextId = 0;
const pending = new Map();
const exceptions = [];
ws.addEventListener('message', ({data}) => {
  const msg = JSON.parse(data);
  if (msg.method === 'Runtime.exceptionThrown') exceptions.push(msg.params.exceptionDetails);
  if (msg.id) {
    const {resolve, reject} = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
  }
});
function cdp(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, {resolve, reject});
    ws.send(JSON.stringify({id, method, params}));
  });
}
async function js(expression) {
  const r = await cdp('Runtime.evaluate', {expression, returnByValue:true, awaitPromise:true});
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
  return r.result.value;
}
async function loaded() {
  for (let i = 0; i < 50; i++) {
    if (await js('document.readyState === "complete" && typeof window.handleAndroidBack === "function"')) return;
    await new Promise(r => setTimeout(r,100));
  }
  throw new Error('Page did not load');
}
try {
  await cdp('Page.enable');
  await cdp('Runtime.enable');
  await cdp('Emulation.setDeviceMetricsOverride', {width:360,height:800,deviceScaleFactor:1,mobile:true});
  await cdp('Page.navigate', {url:new URL('../index.html', import.meta.url).href});
  await loaded();
  await js('localStorage.clear(); sessionStorage.clear()');
  await cdp('Page.reload');
  await loaded();
  assert.equal(await js('sectionHer.hidden && appNav.hidden && !passwordGate.hidden'),true);
  await js('passwordInput.value="wrong"; passwordForm.requestSubmit()');
  assert.equal(await js('!passwordError.hidden && !passwordGate.hidden'),true);
  await js('passwordInput.value=PASSWORD; passwordForm.requestSubmit()');
  assert.equal(await js('passwordGate.hidden && !dashboardMenu.hidden && !appNav.hidden'),true);
  for (const [width,height] of [[320,640],[360,800],[412,915],[800,360]]) {
    await cdp('Emulation.setDeviceMetricsOverride', {width,height,deviceScaleFactor:1,mobile:true});
    for (const section of ['dashboard','her','him','ours']) {
      await js(`navigateTo('${section}')`);
      assert.equal(await js('document.documentElement.scrollWidth <= innerWidth'),true,`Overflow: ${section} at ${width}`);
      assert.equal(await js(`document.querySelector('.app-nav [data-section="${section}"]').getAttribute('aria-current')`),'page');
    }
  }
  await cdp('Emulation.setDeviceMetricsOverride', {width:360,height:800,deviceScaleFactor:1,mobile:true});
  await js('navigateTo("her"); document.querySelector(".checklist-item").click(); bucketListInput.value="A weekend away"; bucketListForm.requestSubmit(); sendLove()');
  await cdp('Page.reload');
  await loaded();
  assert.equal(await js('document.querySelector(".checklist-item").classList.contains("checked")'),true);
  assert.equal(await js('document.querySelector(".checklist").lastElementChild.textContent'),'A weekend away');
  assert.equal(await js('document.getElementById("lovePercentage").textContent'),'100%');
  await js('navigateTo("her"); openLetter()');
  assert.equal(await js('handleAndroidBack() && !letterModal.classList.contains("active")'),true);
  assert.equal(await js('handleAndroidBack() && !dashboardMenu.hidden'),true);
  assert.equal(await js('handleAndroidBack()'),false);
  await js('navigateTo("her"); openLetter(); gateYes.click(); gateYes.click(); gateYes.click(); gateYes.click(); closeLetter()');
  await new Promise(r => setTimeout(r,2500));
  assert.equal(await js('letterCard.hidden'),true,'Closing must cancel delayed reveal');
  await js('openLetter(); gateYes.click(); gateYes.click(); gateYes.click(); gateYes.click()');
  await new Promise(r => setTimeout(r,2500));
  assert.equal(await js('!letterCard.hidden && letterGate.hidden'),true);
  await js('closeLetter(); navigateTo("dashboard")');
  await new Promise(r => setTimeout(r,800));
  const shot = await cdp('Page.captureScreenshot',{format:'png'});
  await writeFile('/tmp/our-forever-mobile.png', Buffer.from(shot.data,'base64'));
  assert.deepEqual(exceptions,[]);
  assert.equal(await js('performance.getEntriesByType("resource").some(r => /^https?:/.test(r.name))'),false);
  console.log('PASS: unlock, 4 phone sizes, all stories, checklist persistence, love meter, letter, Back, offline resources; no JS errors.');
} finally { ws.close(); }
