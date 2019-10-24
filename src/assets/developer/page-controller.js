document.addEventListener('DOMContentLoaded', event => {
  document.body.addEventListener('enable-edit-mode', handleCustomEvents);

  document.body.addEventListener('list-use-cases', handleCustomEvents);
  document.body.addEventListener('new-use-case', handleCustomEvents);
  document.body.addEventListener('create-use-case', handleCustomEvents);
  document.body.addEventListener('edit-use-case', handleCustomEvents);
  document.body.addEventListener('activate-use-case', handleCustomEvents);
  document.body.addEventListener('update-use-case', handleCustomEvents);
  document.body.addEventListener('delete-use-case', handleCustomEvents);

  document.body.addEventListener('list-mock-responses', handleCustomEvents);
  document.body.addEventListener('new-mock-response', handleCustomEvents);
  document.body.addEventListener('create-mock-response', handleCustomEvents);
  document.body.addEventListener('edit-mock-response', handleCustomEvents);
  document.body.addEventListener('update-mock-response', handleCustomEvents);
  document.body.addEventListener('delete-mock-response', handleCustomEvents);
  document.body.addEventListener('play-mock-response', handleCustomEvents);
  
  enableEditMode();
});

function autoGrow(element) {
  if (element.scrollHeight > 30) { 
    element.style.height = '5px';
    element.style.height = `${element.scrollHeight}px`;
  }
}

function fetchUrl(url, options) {
  if (options) {
    options.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
  return new Promise( (resolve, reject) => {
    window.fetch(url, options)
      .then(resp => {
        if (!resp.ok) {
          return reject(resp);
        } else {
          const contentType = resp.headers.get('Content-Type');
          const content = (contentType || '').match(/\/json/) ? resp.json() : resp.text();
          return resolve(content);
        }
      });
  });
}

function fireEvent(event, type, data) {
  event && event.stopPropagation();
  const detail = typeof data === 'undefined' ? (event && event.detail) : data; 
  const custEvent = new CustomEvent(type, {detail, bubbles: true});

  const srcEl = (event && event.target) instanceof HTMLElement ? event.target : document.body;
  console.log('[mock-responses]  firing custom event', custEvent);
  srcEl.dispatchEvent(custEvent);
}

function enableEditMode(data) {
  data && window.localStorage.setItem('edit-mode', data);
  const func = window.localStorage.getItem('edit-mode') == 2 ? 'remove' : 'add';
  document.querySelector('.main').classList[func]('read-only');
}

function handleCustomEvents(event) {
  const type = event.type;
  const data = event.detail;

  console.log('[mock-responses]  handling custom event', type, data, event);
  switch(type) {
    case 'enable-edit-mode': enableEditMode(data); break;

    case 'list-use-cases':  UseCase.list(data); break;
    case 'new-use-case':    UseCase.new(data); break;
    case 'edit-use-case':   UseCase.edit(event, data); break;
    case 'activate-use-case': UseCase.activate(event, data); break;
    case 'create-use-case': UseCase.create(data); break;
    case 'update-use-case': UseCase.update(data); break;
    case 'delete-use-case': UseCase.delete(data); break;

    case 'list-mock-responses':  MockResponse.list(data); break;
    case 'new-mock-response':    MockResponse.new(data); break;
    case 'edit-mock-response':   MockResponse.edit(data); break;
    case 'create-mock-response': MockResponse.create(data); break;
    case 'update-mock-response': MockResponse.update(data); break;
    case 'delete-mock-response': MockResponse.delete(data); break;
    case 'play-mock-response': MockResponse.play(event, data); break;
    default: throw `Unhandled custom events ${type} ${data}`;
  }
}

var Main = {
  get sidebarEl() {
    return document.querySelector('.sidebar .hce-routes')
  },
  get routesEl() {
    return document.querySelector('.contents .hce-routes')
  },
  get dialogEl() {
    return document.querySelector('hce-dialog');
  }
}

var UseCase = {
  isValid: function(useCase) {
    const validMockResp = useCase.mock_responses.match(/^(\d+,)*\d+$/);
    return useCase.name && useCase.description && validMockResp && useCase.category;
  },
  list: function (keyword) { // list-use-cases
    const url = `/use-cases/index?q=${keyword||''}`;
    Main.sidebarEl.setAttribute('src', url);
    Main.dialogEl.close();
    window.location.href = '#' + url;
  },
  new: function(data) { //  new-use-case
    const qs = data ? `?from=${data}`: ''; // query string
    const url = `/use-cases/new${qs}`;

    Main.routesEl.setAttribute('src', url);
    window.location.href = '#' + url;
  },
  edit: function(event, useCase) { // edit-use-case
    const url = `/use-cases/${useCase}/edit`;
    Main.routesEl.setAttribute('src', url);
    Main.dialogEl.close();
    window.location.href = '#' + url;
  },
  activate: function(event, id) { // activate-use-case 
    const prevActivatedEl = document.querySelector('.use-case.active');
    prevActivatedEl && prevActivatedEl.classList.remove('active');
    fetchUrl(`/use-cases/${id}/activate`, {method: 'PUT'})
      .then(resp => {
        const url = `/use-cases/${id}/edit`;
        Main.routesEl.setAttribute('src', url )
        window.location.href = '#' + url;
        event.target.closest('.use-case').classList.add('active');
      });
  },
  create: function(useCase) { // create-use-case
    if (!UseCase.isValid(useCase)) {
      Main.dialogEl.open({title: 'Error', body: 'Invalid Use Case Data'});
    } else {
      fetchUrl('/use-cases', {method: 'POST', body: JSON.stringify(useCase)})
        .then(resp => fireEvent(null, 'list-use-cases', ''))
        .then(resp => fireEvent(null, 'list-mock-responses', ''));
    }
  },
  update: function(useCase) { // update-use-case
    if (!UseCase.isValid(useCase)) {
      Main.dialogEl.open({title: 'Error', body: 'Invalid Use Case Data'});
    } else {
      fetchUrl(`/use-cases/${useCase.id}`, {method: 'PUT', body: JSON.stringify(useCase)})
        .then(resp => fireEvent(null, 'list-use-cases', ''))
        .then(_ => Main.dialogEl.close());
    }
  },
  delete: function(id) { // delete-use-case
    fetchUrl(`/use-cases/${id}`, {method: 'DELETE'})
      .then(resp => fireEvent(null, 'list-use-cases', ''))
      .then(resp => fireEvent(null, 'list-mock-responses', ''));
  }
}

var MockResponse = {
  isValid: function(mockResp) {
    return mockResp.name &&
      [1,0].includes(mockResp.active) &&
      mockResp.req_url &&
      mockResp.res_status &&
      mockResp.res_delay_sec > -1 &&
      mockResp.res_content_type &&
      mockResp.res_body;
  },
  list: function (key) { // list-mock-responses
    const url = `/mock-responses/index?q=${key||''}`;
    Main.routesEl.setAttribute('src', url);
    Main.dialogEl.close();
    window.location.href = '#' + url;
  },
  new: function(data) {  // new-mock-response
    const qs = data ? `?from=${data}`: ''; // query string
    const url = `/mock-responses/new${qs}`;
    Main.routesEl.setAttribute('src', url);
    window.location.href = '#' + url;
  },
  edit: function(id) { // edit-mock-response
    const url = `/mock-responses/${id}/edit`;
    Main.routesEl.setAttribute('src', url );
    window.location.href = '#' + url;
  },
  create: function(mockResponse) { // create-mock-response
    if (!MockResponse.isValid(mockResponse)) {
      Main.dialogEl.open({title: 'Error', body: 'Invalid Mock Response Data'});
    } else {
      fetchUrl('/mock-responses', {method: 'POST', body: JSON.stringify(mockResponse)})
        .then(resp => fireEvent(null, 'list-mock-responses', ''))
        .then(_ => Main.dialogEl.close());
    }
  },
  update: function(mockResponse) { // update-mock-response
    if (!MockResponse.isValid(mockResponse)) {
      Main.dialogEl.open({title: 'Error', body: 'Invalid Mock Response Data'});
    } else {
      fetchUrl(`/mock-responses/${mockResponse.id}`, {method: 'PUT', body: JSON.stringify(mockResponse)})
        .then(
           resp => fireEvent(event, 'list-mock-responses', ''), 
           async error => Main.dialogEl.open({title: `${error.status} Error` , body: await error.text()})
        );
    }  
  },
  delete: function(id) { // delete-mock-response
    fetchUrl(`/mock-responses/${id}`, {method: 'DELETE'})
      .then(resp => fireEvent(null, 'list-mock-responses', ''));  
  },
  play: function(event, id) { // play-mock-response
    const req = {};
    let respStatus, respType;
    fetchUrl(`/mock-responses/${id}`)
      .then(resp => {
        req.url = resp.req_url;
        req.method = resp.req_method || 'POST';
        req.body = req.method !== 'GET' && resp.req_payload ? `{
          ${resp.req_payload.trim().split(',').map(el => `"${el.trim()}":""`).join(",")}
        }` : undefined;
        return window.fetch(req.url, {method: req.method, body: req.body, headers: {
          'Accept': resp.res_content_type,
          'Content-Type': 'application/json' 
        }});
      }).then( resp => {
        respStatus = resp.status;
        respType = resp.headers.get('Content-Type');
        return resp.text();
      }).then(resp => {
        const bodyHTML = `
          <fieldset><legend>Request</legend>
            <div>method: ${req.method}</div>
            <div>payloads: ${req.body}</div>
          </fieldset>
          <fieldset><legend>Response</legend>
            <div>status Code: ${respStatus}</div>
            <div>Content-Type: ${respType}</div>
            <pre>${resp}</pre>
          </fieldset>`;
        Main.dialogEl.open({title: req.url, body: bodyHTML});
      });
  }
};
