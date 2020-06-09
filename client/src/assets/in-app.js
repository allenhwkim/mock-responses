// Usage
// <script src="assets/in-app.js" id="in-app" iframe-src="/#/set-use-case"></script>
const html = `<div class="mock-responses in-app js">
  <style>
    .dialog { display: none; }
    .dialog.open { display: block; }

    .blocker { position: fixed; top: 0; left: 0; bottom: 0; right: 0; background: rgba(0,0,0,.5); }
    .dialog .contents {
      position: fixed; top: 50vh; left: 50vw; transform: translate(-50%, -50%);
      display: flex; align-items: center; justify-content: center; background: #FFF;
      border: 1px solid #ccc; border-radius: 5px; 
      width: 800px; height: calc(100vh - 100px);
    }
    .mock-responses.in-app.settings { display: inline-block; position: fixed; top: 0; left: 0; }
  </style>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />

  <button onclick="showDialog()" class="mock-responses in-app settings">
    <i class="fa fa-cog" aria-hidden="true"></i>
  </button>
  <div class="mock-responses in-app dialog">
    <div class="blocker" onclick="hideDialog()"></div>
    <div class="contents">
      <iframe id="iframe" width="100%" height="100%" frameborder="0"></iframe>
    </div>
  </div>
</div>`;
function showDialog() {
  document.querySelector('.mock-responses.in-app.dialog').classList.add('open');
}
function hideDialog() {
  document.querySelector('.mock-responses.in-app.dialog').classList.remove('open');
}
document.addEventListener('DOMContentLoaded', function() {
  try {
    const iframeSrc = document.querySelector('script#in-app').getAttribute('iframe-src');
    document.body.insertAdjacentHTML('beforeend', html);
    setTimeout(_ => {
      document.querySelector('.mock-responses.in-app.dialog #iframe').setAttribute('src', iframeSrc);
    }, 1000)
  } catch (e) {
    console.error('[mock-responses] error in script#in-app[iframe-src]');
    throw e;
  }
}, false);