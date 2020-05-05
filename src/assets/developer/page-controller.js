document.addEventListener('DOMContentLoaded', event => {
  document.body.addEventListener('enable-edit-mode', handleCustomEvents);

  document.body.addEventListener('search-use-case', handleCustomEvents);
  document.body.addEventListener('create-use-case', handleCustomEvents);
  document.body.addEventListener('update-use-case', handleCustomEvents);
  document.body.addEventListener('delete-use-case', handleCustomEvents);
  document.body.addEventListener('activate-use-case', handleCustomEvents);
  document.body.addEventListener('select-use-case', handleCustomEvents);
  document.body.addEventListener('unselect-use-case', handleCustomEvents);

  document.body.addEventListener('search-mock-response', handleCustomEvents);
  document.body.addEventListener('create-mock-response', handleCustomEvents);
  document.body.addEventListener('update-mock-response', handleCustomEvents);
  document.body.addEventListener('delete-mock-response', handleCustomEvents);
  document.body.addEventListener('play-mock-response', handleCustomEvents);
  document.body.addEventListener('select-mock-response', handleCustomEvents);
  document.body.addEventListener('unselect-mock-response', handleCustomEvents);
  
  authorize(localStorage.getItem('auth-key'));
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
  // console.log('[mock-responses]  firing custom event', custEvent);
  srcEl.dispatchEvent(custEvent);
}

function authorize(key) {
  key = key || window.localStorage.getItem('ey');
  window.localStorage.setItem('auth-key', key);
  if (key === '2') {
    document.querySelector('.main').classList.remove('not-authorized');
  } else {
    document.querySelector('.main').classList.add('not-authorized');
  } 
}

function handleCustomEvents(event) {
  const type = event.type;
  const data = event.detail;

  // console.log('[mock-responses]  handling custom event', type, data, event);
  switch(type) {
    case 'enable-edit-mode': authorize(data); break;

    case 'search-use-case': UseCase.search(event, data); break;
    case 'create-use-case': UseCase.create(data); break;
    case 'update-use-case': UseCase.update(data); break;
    case 'delete-use-case': UseCase.delete(data); break;
    case 'activate-use-case': UseCase.activate(data); break;
    case 'select-use-case': UseCase.select(data); break;
    case 'unselect-use-case': UseCase.unselect(data); break;

    case 'search-mock-response': MockResponse.search(event, data); break;
    case 'create-mock-response': MockResponse.create(data); break;
    case 'update-mock-response': MockResponse.update(data); break;
    case 'delete-mock-response': MockResponse.delete(data); break;
    case 'play-mock-response': MockResponse.play(event, data); break;
    case 'select-mock-response': MockResponse.select(data); break;
    case 'unselect-mock-response': MockResponse.unselect(data); break;

    default: throw `Unhandled custom events ${type} ${data}`;
  }
}

var Main = {
  get dialogEl() {
    return document.querySelector('hce-dialog');
  }
}

var UseCase = {
  isValid: function(useCase) {
    const validMockResps = useCase.mock_responses.match(/^(\d+,)*\d+$/);
    const validUseCases = useCase.use_cases.match(/^(\d+,)*\d+$/);
    return useCase.name && useCase.description && validMockResps && validUseCases;
  },
  search: function(event, by) {
    const hceRoutesEl = event.target.closest('hce-routes');
    if (by.key) {
      hceRoutesEl.setAttribute('src', `/use-cases/index?q=${by.key}`);
    } else if (by.active) {
      hceRoutesEl.setAttribute('src', `/use-cases/index?active=${by.active}`);
    }
  },
  create: function(useCase) { // create-use-case
    if (!UseCase.isValid(useCase)) {
      Main.dialogEl.open({title: 'Error', body: 'Invalid Use Case Data'});
      return false;
    } 
    fetchUrl('/use-cases', {method: 'POST', body: JSON.stringify(useCase)})
      .then(resp => window.location.href = '#/use-cases/index?q=')
  },
  update: function(useCase) { // update-use-case
    if (!UseCase.isValid(useCase)) {
      Main.dialogEl.open({title: 'Error', body: 'Invalid Use Case Data'});
      return false;
    } 
    fetchUrl(`/use-cases/${useCase.id}`, {method: 'PUT', body: JSON.stringify(useCase)})
      .then(resp => window.location.href = '#/use-cases/index?q=')
  },
  delete: function(id) { // delete-use-case
    fetchUrl(`/use-cases/${id}`, {method: 'DELETE'})
      .then(resp => window.location.href = '#/use-cases/index?q=')
  },
  activate: function(id) { // activate-use-case
    fetchUrl(`/use-cases/${id}/activate`, {method: 'PUT'})
      .then(resp => window.location.href = `#/use-cases/index?active=${id}`)
  },
  select: function(id) {
    const useCasesEl = document.querySelector('.form #use_cases');
    const useCases = useCasesEl.value.trim().split(',').concat(id).filter(el => el);
    const noDupes = useCases.filter((v,i) => useCases.indexOf(v) === i);
    useCasesEl.setAttribute('value', noDupes.join(','));
    useCasesEl.dispatchEvent(new Event('change'));
    Main.dialogEl.close();
  },
  unselect: function(id) {
    const useCasesEl = document.querySelector('.form #use_cases');
    const useCases = useCasesEl.value.trim().split(',').filter(el => el !== ''+id);
    console.log({id, useCases})
    useCasesEl.setAttribute('value', useCases.join(','));
    useCasesEl.dispatchEvent(new Event('change'));
  }
}

var MockResponse = {
  isValid: function(mockResp) {
    return mockResp.name &&
      mockResp.req_url &&
      mockResp.res_status &&
      mockResp.res_delay_sec > -1 &&
      mockResp.res_content_type &&
      mockResp.res_body;
  },
  search: function(event, by) {
    const hceRoutesEl = event.target.closest('hce-routes');
    if (by.key) {
      hceRoutesEl.setAttribute('src', `/mock-responses/index?q=${by.key}`);
    } else if (by.ids) {
      hceRoutesEl.setAttribute('src', `/mock-responses/index?ids=${by.ids}`);
    } else if (by.active) {
      hceRoutesEl.setAttribute('src', `/mock-responses/index?active=${by.active}`);
    }
  },
  create: function(mockResponse) { // create-mock-response
    if (!MockResponse.isValid(mockResponse)) {
      Main.dialogEl.open({title: 'Error', body: 'Invalid Mock Response Data'});
    } else {
      fetchUrl('/mock-responses', {method: 'POST', body: JSON.stringify(mockResponse)})
        .then(resp => window.location.href = '#/mock-responses/index?q=')
    }
  },
  update: function(mockResponse) { // update-mock-response
    if (!MockResponse.isValid(mockResponse)) {
      Main.dialogEl.open({title: 'Error', body: 'Invalid Mock Response Data'});
    } else {
      fetchUrl(`/mock-responses/${mockResponse.id}`, {method: 'PUT', body: JSON.stringify(mockResponse)})
        .then(
           resp => window.location.href = '#/mock-responses/index?q=',
           async error => Main.dialogEl.open({title: `${error.status} Error` , body: await error.text()})
        );
    }  
  },
  delete: function(id) { // delete-mock-response
    fetchUrl(`/mock-responses/${id}`, {method: 'DELETE'})
      .then(resp => window.location.href = '#/mock-responses/index?q=')
  },
  play: function(event, id) { // play-mock-response
    const req = {};
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
        console.log('[mock-response]', req.url, req.method, req.body, resp);
        document.querySelector('hce-snackbar').message = 
          `${req.url} ${req.method} call is made. Check console log`;
      });
  },
  select: function(id) {
    const mockRespsEl = document.querySelector('.form #mock_responses');
    const mockResps = mockRespsEl.value.trim().split(',').concat(id).filter(el => el);
    const noDupes = mockResps.filter((v,i) => mockResps.indexOf(v) === i);
    mockRespsEl.setAttribute('value', noDupes.join(','));
    mockRespsEl.dispatchEvent(new Event('change'));
    Main.dialogEl.close();
  },
  unselect: function(id) {
    const mockRespsEl = document.querySelector('.form #mock_responses');
    const mockResps = mockRespsEl.value.trim().split(',').filter(el => el !== ''+id);
    mockRespsEl.setAttribute('value', mockResps.join(','));
    mockRespsEl.dispatchEvent(new Event('change'));
  }
};

function openSearchMockResponsesDialog() {
  const body = `<hce-routes class="dialog" src="/mock-responses/index"></hce-routes>`;
  Main.dialogEl.open({title: ' ', body});
}

function openSearchUseCasesDialog() {
  const body = `<hce-routes class="dialog" src="/use-cases/index"></hce-routes>`;
  Main.dialogEl.open({title: ' ', body});
}

function getFormData() {
  const inputEls = document.querySelectorAll('.form [id]');
  const data = Array.from(inputEls).reduce( (acc, el) => {
      acc[el.id] = el.value;
      return acc;
    }, {})
  return data;
}

function beautifyJSON() {
  const textArea = document.getElementById("res_body");
  textArea.value = JSON.stringify(JSON.parse(textArea.value), null, 2);
  textArea.style.height = textArea.scrollHeight + "px";
}