document.addEventListener('DOMContentLoaded', event => {
  document.body.addEventListener('list-use-cases', handleCustomEvents);
  document.body.addEventListener('new-use-case', handleCustomEvents);
  document.body.addEventListener('create-use-case', handleCustomEvents);
  document.body.addEventListener('edit-use-case', handleCustomEvents);
  document.body.addEventListener('update-use-case', handleCustomEvents);
  document.body.addEventListener('delete-use-case', handleCustomEvents);

  document.body.addEventListener('list-mock-responses', handleCustomEvents);
  document.body.addEventListener('new-mock-response', handleCustomEvents);
  document.body.addEventListener('edit-mock-response', handleCustomEvents);
  document.body.addEventListener('update-mock-response', handleCustomEvents);
  document.body.addEventListener('delete-mock-response', handleCustomEvents);
});

function fetchUrl(url, options) {
  if (options) {
    options.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
  return window.fetch(url, options)
    .then(resp => {
      if (!resp.ok) throw Error(resp); 
      console.log('resp', resp);
      return resp.json();
    });
}

function fireEvent(event, type, data) {
  const detail = data || event.detail || undefined;
  const custEvent = new CustomEvent(type, {detail, bubbles: true});

  const srcEl = event.target instanceof HTMLElement ? event.target : document.body;
  console.log('[mock-responses]  firing custom event', srcEl, custEvent);
  srcEl.dispatchEvent(custEvent);
}

function isValidUseCase(useCase) {
  const validMockResp = useCase.mock_responses.match(/^(\d+,)*\d+$/);
  return useCase.name && useCase.description && validMockResp;
}

function handleCustomEvents(event) {
  const type = event.type;
  const data = event.detail;

  console.log('[mock-responses]  handling custom event', type, data, event);
  switch(type) {
    case 'list-use-cases':  UseCase.list(data); break;
    case 'new-use-case':    UseCase.new(); break;
    case 'edit-use-case':   UseCase.edit(data); break;
    case 'create-use-case': UseCase.create(data); break;
    case 'update-use-case': UseCase.update(data); break;
    case 'delete-use-case': UseCase.delete(data); break;
  }

  switch(type) {
    case 'list-mock-responses':  MockResponse.list(data); break;
    case 'new-mock-response':    MockResponse.new(); break;
    case 'edit-mock-response':   MockResponse.edit(data); break;
    case 'create-mock-response': MockResponse.create(data); break;
    case 'update-mock-response': MockResponse.update(data); break;
    case 'delete-mock-response': MockResponse.delete(data); break;
  }
}

var UseCase = {
  list: function (keyword) {
    const url = `/use-cases?q=${keyword||''}`;
    document.querySelector('hce-list#use-cases').source = fetchUrl(url);
  },
  new: function() { // show form for create
    document.querySelector('.contents .hce-routes').setAttribute('src', '/use-cases/new');
  },
  edit: function(useCase) { // show form for edit
    document.querySelector('.contents .hce-routes').setAttribute('src', `/use-cases/edit/${useCase.id}`);
  },
  create: function(useCase) {
    console.log('....................... useCase', useCase);
    if (!isValidUseCase(useCase)) {
      document.querySelector('hce-dialog').open({title: 'Error', body: 'Invalid Use Case Data'});
    } else {
      fetchUrl('/use-cases', {method: 'POST', body: JSON.stringify(useCase)})
        .then(resp => fireEvent('list-use-cases'));
    }
  },
  update: function(useCase) {
    // TODO verify useCase data, and show error message.
    console.log('.......... update a use case', useCase);
  },
  delete: function(id) {
    console.log('.......... delete a use case', id);
  }
}

var MockResponse = {
  list: function (key) {
    const url = `/use-cases?q=${keyword||''}`;
    document.querySelector('hce-list#use-cases').source = fetchUrl(url);
  },
  new: function(data) { // show form for create
    console.log('.......... show form for mock response edit', data);
  },
  edit: function(mockResponse) { // show form for edit
    console.log('.......... show a use case', mockResponse);
  },
  create: function(mockResponse) {
    console.log('.......... create a use case', mockResponse);
  },
  update: function(mockResponse) {
    console.log('.......... update a use case', mockResponse);
  },
  delete: function(id) {
    console.log('.......... delete a use case', id);
  }
};
